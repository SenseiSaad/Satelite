# Northgate Labs: early access site

Early access website for Northgate Labs. Northgate Labs is an early-stage product that
aims to summarize crop condition and possible flood impact from open satellite
data. No pilot results or accuracy figures are published on this site.

Local work uses pnpm with Node 20 or newer.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm typecheck
pnpm lint
pnpm build
```

Copy `.env.example` to `.env.local` for local work. Set the same names in
Vercel for production.

| Name                       | Required        | Purpose                                                        |
| -------------------------- | --------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Yes (production)| Canonical origin used for metadata, sitemap and robots          |
| `CONTACT_EMAIL`            | Yes             | Footer contact, reply address shown after the form saves it     |
| `DYNAMODB_TABLE_NAME`      | Option 1        | DynamoDB table that stores early access signups                 |
| `AWS_REGION`               | Option 1        | Region holding the table, for example `us-west-2`               |
| `AWS_ACCESS_KEY_ID`        | Option 1        | Access key, only if you are not using OIDC                      |
| `AWS_SECRET_ACCESS_KEY`    | Option 1        | Secret key, only if you are not using OIDC                      |
| `RESEND_API_KEY`           | Option 2        | Resend key, sends the submission as one email to `CONTACT_EMAIL`|
| `RESEND_FROM_ADDRESS`      | No              | Overrides the default Resend onboardingsender                   |
| `ENABLE_VERCEL_ANALYTICS`  | No              | Set to `1` in production to load Vercel Analytics               |

Pick one storage option for the form. Option 1 saves each submission in
DynamoDB; Option 2 emails it to `CONTACT_EMAIL` through Resend. The form only
reports success after the write succeeds, and it saves data only: no
confirmation email is sent to the person who submits.

## Early access form

- Honeypot field, minimum submit time and per-IP rate limit stay enabled.
- Duplicate emails are blocked in the DynamoDB path with a conditional put.
- Consent checkbox is required; see /privacy for what is stored.
- If nothing is configured the API answers with an error rather than a fake
  success.

## AWS setup

### 1. DynamoDB table

```bash
aws dynamodb create-table \
  --table-name northgate-early-access \
  --attribute-definitions AttributeName=pk,AttributeType=S \
  --key-schema AttributeName=pk,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-west-2
```

Item shape written by the app:

```json
{
  "pk": { "S": "EMAIL#admin@northgatelabs.space" },
  "entityType": { "S": "early_access" },
  "email": { "S": "admin@northgatelabs.space" },
  "fullName": { "S": "Full name" },
  "organization": { "S": "Organization" },
  "consent": { "BOOL": true },
  "createdAt": { "S": "2026-01-01T00:00:00.000Z" }
}
```

To remove a test row:

```bash
aws dynamodb delete-item \
  --table-name northgate-early-access \
  --key '{"pk":{"S":"EMAIL#admin@northgatelabs.space"}}' \
  --region us-west-2
```

### 2. IAM policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PutSignupIfEmailIsNew",
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:us-west-2:123456789012:table/northgate-early-access"
    }
  ]
}
```

### 3. Credentials: prefer OIDC on Vercel

Use Vercel OIDC with `AWS_ROLE_ARN` rather than long lived keys. Locally,
access keys or a named profile are fine.
