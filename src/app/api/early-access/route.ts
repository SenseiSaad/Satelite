import { NextResponse } from 'next/server';
import { earlyAccessSchema } from '@/lib/schemas';
import { MIN_SUBMIT_MS, recordSignup } from '@/lib/signup';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ErrorBody {
  ok: false;
  error: string;
  fields?: Record<string, string>;
}

function errorResponse(status: number, body: ErrorBody): NextResponse<ErrorBody> {
  return NextResponse.json(body, { status });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (!forwarded) return 'unknown';
  const first = forwarded.split(',')[0]?.trim();
  return first || 'unknown';
}

/**
 * Early access signup endpoint.
 *
 * Validates with the same Zod schema as the form, applies a honeypot check,
 * a minimum submit time and a per IP rate limit, then saves it for real:
 * a DynamoDB conditional put when AWS is configured, otherwise one email to
 * CONTACT_EMAIL through Resend. It only saves data and sends no confirmation
 * to the submitter. When no storage is configured it returns an error rather
 * than a fake success.
 */
export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, { ok: false, error: 'invalid_json' });
  }

  const parsed = earlyAccessSchema.safeParse(body);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (key && !fields[key]) {
        fields[key] = issue.message;
      }
    }
    return errorResponse(400, { ok: false, error: 'validation', fields });
  }

  const data = parsed.data;

  if (data.honeypot !== '') {
    // Filled by a bot. Same response shape as any other bad request.
    return errorResponse(400, { ok: false, error: 'validation' });
  }

  const now = Date.now();
  if (!Number.isFinite(data.formStartedAt) || now - data.formStartedAt < MIN_SUBMIT_MS) {
    return errorResponse(400, {
      ok: false,
      error: 'validation',
      fields: { formStartedAt: 'That was submitted too quickly. Please try again.' },
    });
  }

  if (data.formStartedAt > now + 10_000) {
    return errorResponse(400, { ok: false, error: 'validation' });
  }

  const result = await recordSignup(data, { ip: clientIp(request) });

  if (!result.ok) {
    return errorResponse(result.status, { ok: false, error: result.error });
  }

  return NextResponse.json({
    ok: true,
    duplicate: result.duplicate,
  });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: false, error: 'method_not_allowed' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
