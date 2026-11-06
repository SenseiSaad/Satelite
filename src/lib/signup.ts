/**
 * Early access signup: validate, store in DynamoDB, confirm by email.
 *
 * Mock mode: when the AWS environment variables are missing the submission is
 * logged to the server console and reported as success, so the repository runs
 * locally with zero setup.
 */

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { getDocumentClient, getSesClient, isAwsConfigured } from './aws';
import { checkRateLimit } from './rate-limit';
import type { EarlyAccessData } from './schemas';
import { organizationTypeLabels, hectareLabels } from './schemas';
import { escapeHtml } from './utils';
import { site } from './site';

export type SignupResult =
  | { ok: true; mock: boolean; duplicate: boolean }
  | { ok: false; status: number; error: 'rate_limit' | 'server' };

/** Minimum time between form mount and submit, in milliseconds. */
export const MIN_SUBMIT_MS = 3_000;

function isConditionalCheckFailed(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { name?: string }).name === 'ConditionalCheckFailedException'
  );
}

export async function recordSignup(
  data: EarlyAccessData,
  meta: { ip: string },
): Promise<SignupResult> {
  const now = Date.now();

  if (!checkRateLimit(meta.ip, now)) {
    return { ok: false, status: 429, error: 'rate_limit' };
  }

  if (!isAwsConfigured()) {
    // Mock mode. No credentials, no table, still a working demo.
    console.log(
      '[early-access:mock]',
      JSON.stringify({
        email: data.email,
        organization: data.organization,
        organizationType: data.organizationType,
        regionOfInterest: data.regionOfInterest,
        cropsOfInterest: data.cropsOfInterest,
        hectares: data.hectares,
        receivedAt: new Date(now).toISOString(),
        ip: meta.ip,
      }),
    );
    return { ok: true, mock: true, duplicate: false };
  }

  const table = process.env.DYNAMODB_TABLE_NAME as string;
  const fromAddress = process.env.SES_FROM_ADDRESS as string;
  const email = data.email;

  try {
    await getDocumentClient().send(
      new PutCommand({
        TableName: table,
        Item: {
          // Partition key. The conditional put on this key blocks duplicates.
          pk: `EMAIL#${email}`,
          entityType: 'early_access',
          email,
          fullName: data.fullName,
          organization: data.organization,
          organizationType: data.organizationType,
          regionOfInterest: data.regionOfInterest,
          cropsOfInterest: [...data.cropsOfInterest],
          hectares: data.hectares,
          useCase: data.useCase,
          consent: data.consent,
          createdAt: new Date(now).toISOString(),
          ip: meta.ip,
        },
        ConditionExpression: 'attribute_not_exists(pk)',
      }),
    );
  } catch (error) {
    if (isConditionalCheckFailed(error)) {
      return { ok: true, mock: false, duplicate: true };
    }
    console.error('[early-access] dynamodb put failed', error);
    return { ok: false, status: 500, error: 'server' };
  }

  // Confirmation email is best effort. The stored row is the source of truth.
  try {
    await getSesClient().send(
      new SendEmailCommand({
        Source: fromAddress,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: `${site.name}: your form has been saved` },
          Body: {
            Text: { Data: buildTextBody(data) },
            Html: { Data: buildHtmlBody(data) },
          },
        },
      }),
    );
  } catch (error) {
    console.error('[early-access] ses send failed', error);
  }

  return { ok: true, mock: false, duplicate: false };
}

function buildTextBody(data: EarlyAccessData): string {
  return [
    `Hi ${data.fullName},`,
    '',
    `Thanks for asking about ${site.name} early access. Your form has been saved and you will be contacted shortly.`,
    '',
    `Organization: ${data.organization} (${organizationTypeLabels[data.organizationType]})`,
    `Region of interest: ${data.regionOfInterest}`,
    `Crops: ${data.cropsOfInterest.join(', ')}`,
    `Area in scope: ${hectareLabels[data.hectares]}`,
    '',
    'What happens next: we review every request by hand and reply with pilot',
    'details, the field boundaries format we need, and a call if it fits.',
    '',
    site.email
      ? `Questions? Reply to this address or write to ${site.email}.`
      : 'Questions? Reply to this email.',
    '',
    `${site.name}`,
    site.tagline,
  ].join('\n');
}

function buildHtmlBody(data: EarlyAccessData): string {
  const name = escapeHtml(data.fullName);
  const organization = escapeHtml(data.organization);
  const region = escapeHtml(data.regionOfInterest);
  const crops = escapeHtml(data.cropsOfInterest.join(', '));
  const hectares = escapeHtml(hectareLabels[data.hectares]);
  const orgType = escapeHtml(organizationTypeLabels[data.organizationType]);

  return [
    `<p>Hi ${name},</p>`,
    `<p>Thanks for asking about ${escapeHtml(site.name)} early access. Your form has been saved and you will be contacted shortly.</p>`,
    `<p><strong>Organization:</strong> ${organization} (${orgType})<br>`,
    `<strong>Region of interest:</strong> ${region}<br>`,
    `<strong>Crops:</strong> ${crops}<br>`,
    `<strong>Area in scope:</strong> ${hectares}</p>`,
    '<p><strong>What happens next:</strong> we review every request by hand and reply',
    'with pilot details, the field boundaries format we need, and a call if it fits.</p>',
    site.email
      ? `<p>Questions? Write to <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>.</p>`
      : '<p>Questions? Reply to this email.</p>',
    `<p>${escapeHtml(site.name)}<br>${escapeHtml(site.tagline)}</p>`,
  ].join('\n');
}
