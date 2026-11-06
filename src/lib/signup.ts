/**
 * Early access signup: validate, then persist for real.
 *
 * Storage: a conditional put in DynamoDB (on-demand table) when the AWS
 * environment variables are configured. Without AWS credentials the
 * submission is emailed to CONTACT_EMAIL through Resend, which works on
 * Vercel. Neither path can return success unless the write succeeded, so
 * the UI never shows a false confirmation.
 *
 * The signup only saves data. No confirmation email is sent to the
 * submitter; a person replies directly from CONTACT_EMAIL.
 */

import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDocumentClient, isAwsConfigured } from './aws';
import { checkRateLimit } from './rate-limit';
import type { EarlyAccessData } from './schemas';
import { organizationTypeLabels, hectareLabels } from './schemas';
import { site } from './site';

export type SignupResult =
  | { ok: true; storage: 'dynamodb'; duplicate: boolean }
  | { ok: true; storage: 'email'; duplicate: boolean }
  | { ok: false; status: number; error: 'rate_limit' | 'not_configured' | 'server' };

/** Minimum time between form mount and submit, in milliseconds. */
export const MIN_SUBMIT_MS = 3_000;

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && site.email);
}

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

  if (isAwsConfigured()) {
    return storeInDynamoDb(data, { ip: meta.ip, now });
  }

  if (isResendConfigured()) {
    return sendByEmail(data, { ip: meta.ip, now });
  }

  // Nothing is configured to persist the request. Fail honestly instead of
  // pretending the submission was saved.
  console.error('[early-access] no storage configured: set DYNAMODB_TABLE_NAME plus AWS credentials, or RESEND_API_KEY with CONTACT_EMAIL');
  return { ok: false, status: 500, error: 'not_configured' };
}

async function storeInDynamoDb(
  data: EarlyAccessData,
  meta: { ip: string; now: number },
): Promise<SignupResult> {
  const table = process.env.DYNAMODB_TABLE_NAME as string;

  try {
    await getDocumentClient().send(
      new PutCommand({
        TableName: table,
        Item: {
          // Partition key. The conditional put on this key blocks duplicates.
          pk: `EMAIL#${data.email}`,
          entityType: 'early_access',
          email: data.email,
          fullName: data.fullName,
          organization: data.organization,
          organizationType: data.organizationType,
          regionOfInterest: data.regionOfInterest,
          cropsOfInterest: [...data.cropsOfInterest],
          hectares: data.hectares,
          useCase: data.useCase,
          consent: data.consent,
          createdAt: new Date(meta.now).toISOString(),
          ip: meta.ip,
        },
        ConditionExpression: 'attribute_not_exists(pk)',
      }),
    );
  } catch (error) {
    if (isConditionalCheckFailed(error)) {
      return { ok: true, storage: 'dynamodb', duplicate: true };
    }
    console.error('[early-access] dynamodb put failed', error);
    return { ok: false, status: 500, error: 'server' };
  }

  return { ok: true, storage: 'dynamodb', duplicate: false };
}

async function sendByEmail(
  data: EarlyAccessData,
  meta: { ip: string; now: number },
): Promise<SignupResult> {
  const apiKey = process.env.RESEND_API_KEY as string;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_ADDRESS ?? `Northgate Labs <onboarding@resend.dev>`,
        to: [site.email],
        subject: `Early access request: ${data.organization}`,
        text: buildSubmissionText(data, meta.now, meta.ip),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('[early-access] resend send failed', response.status, detail);
      return { ok: false, status: 500, error: 'server' };
    }
  } catch (error) {
    console.error('[early-access] resend send failed', error);
    return { ok: false, status: 500, error: 'server' };
  }

  return { ok: true, storage: 'email', duplicate: false };
}

function buildSubmissionText(data: EarlyAccessData, now: number, ip: string): string {
  return [
    'New early access request from the website form.',
    '',
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    `Organization: ${data.organization} (${organizationTypeLabels[data.organizationType]})`,
    `Region of interest: ${data.regionOfInterest}`,
    `Crops: ${data.cropsOfInterest.map((crop) => cropLabels[crop] ?? crop).join(', ')}`,
    `Area: ${hectareLabels[data.hectares]}`,
    '',
    'Use case:',
    data.useCase,
    '',
    `Received at: ${new Date(now).toISOString()}`,
    `IP: ${ip}`,
  ].join('\n');
}

const cropLabels: Record<string, string> = {
  cotton: 'Cotton',
  wheat: 'Wheat',
  rice: 'Rice',
  maize: 'Maize',
  sugarcane: 'Sugarcane',
  soybean: 'Soybean',
  other: 'Other',
};
