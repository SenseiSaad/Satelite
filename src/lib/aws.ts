/**
 * Server side AWS clients.
 *
 * Created lazily so that local development without credentials never tries to
 * connect. The default credential provider chain is used, which covers
 * access keys, named profiles and the web identity token file that Vercel
 * OIDC sets.
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SESClient } from '@aws-sdk/client-ses';

let documentClient: DynamoDBDocumentClient | null = null;
let sesClient: SESClient | null = null;

export function getDocumentClient(): DynamoDBDocumentClient {
  if (!documentClient) {
    documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return documentClient;
}

export function getSesClient(): SESClient {
  if (!sesClient) {
    sesClient = new SESClient({});
  }
  return sesClient;
}

/**
 * True when every variable the signup backend needs is present.
 * When false the API runs in mock mode: log to console, return success.
 */
export function isAwsConfigured(): boolean {
  if (!process.env.DYNAMODB_TABLE_NAME || !process.env.SES_FROM_ADDRESS) {
    return false;
  }

  const hasStaticKeys = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
  const hasOidcRole = Boolean(process.env.AWS_ROLE_ARN);
  const hasWebIdentity = Boolean(process.env.AWS_WEB_IDENTITY_TOKEN_FILE);
  const hasProfile = Boolean(process.env.AWS_PROFILE);

  return hasStaticKeys || hasOidcRole || hasWebIdentity || hasProfile;
}

export function awsConfigMissing(): string[] {
  const missing: string[] = [];
  if (!process.env.DYNAMODB_TABLE_NAME) missing.push('DYNAMODB_TABLE_NAME');
  if (!process.env.SES_FROM_ADDRESS) missing.push('SES_FROM_ADDRESS');
  if (!process.env.AWS_REGION) missing.push('AWS_REGION');
  return missing;
}
