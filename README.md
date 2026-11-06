# Fieldline

Early access site for Fieldline, a satellite based crop risk index platform for
agriculture. One page, eleven sections, a validated early access form, and a
serverless signup endpoint.

The working name, domain, region and crop in the copy are placeholders. Replace
them with your own before launch. See [Before you launch](#before-you-launch).

## Stack

- Next.js 16 (App Router) with React 19 and TypeScript 5.9 in strict mode
- Tailwind CSS 4 with design tokens in `src/styles/tokens.css`
- Motion, GSAP with ScrollTrigger, and Lenis for animation and smooth scroll
- Zod 4 plus React Hook Form for client and server validation
- AWS SDK v3 (DynamoDB, SES) for signup persistence and confirmation mail
- pnpm, ESLint 10, Prettier

No component library. No WebGL. No 3D. Light theme only.

## Requirements

- Node.js 22.12 or newer (22 is what CI and Vercel use)
- pnpm 12 (the version is pinned in `package.json` under `packageManager`)

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

With no AWS variables set the API runs in **mock mode**: submissions are
validated, logged to the server console, and answered with a success response.
Nothing is written to a database and no mail is sent. This is the default
experience for local development.

## Scripts

| Command             | What it does               |
| ------------------- | -------------------------- |
| `pnpm dev`          | Development server         |
| `pnpm build`        | Production build           |
| `pnpm start`        | Serve the production build |
| `pnpm lint`         | ESLint over the whole repo |
| `pnpm typecheck`    | `tsc --noEmit`             |
| `pnpm format`       | Prettier write             |
| `pnpm format:check` | Prettier check             |

## Environment variables

Copy `.env.example` to `.env.local` for local work. Set the same names in your
host for production.

| Name                                   | Required         | Purpose                                                   |
| -------------------------------------- | ---------------- | --------------------------------------------------------- |
| `DATABASE_TABLE`                       | Yes (production) | DynamoDB table name for signups                           |
| `AWS_REGION`                           | Yes (production) | Region holding the table and SES, for example `us-west-2` |
| `AWS_ACCESS_KEY_ID`                    | No               | Access key, only if you are not using OIDC                |
| `AWS_SECRET_ACCESS_KEY`                | No               | Secret key, only if you are not using OIDC                |
| `SES_FROM_ADDRESS`                     | Yes (production) | Verified sender for the confirmation mail                 |
| `NEXT_PUBLIC_SITE_URL`                 | Recommended      | Canonical origin, for example `https://fieldline.ag`      |
| `NEXT_PUBLIC_COMPANY_NAME`             | No               | Overrides the wordmark and legal name                     |
| `NEXT_PUBLIC_PRODUCT_NAME`             | No               | Overrides the product name                                |
| `NEXT_PUBLIC_CONTACT_EMAIL`            | No               | Overrides `hello@fieldline.ag` everywhere it appears      |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED` | No               | Set to `true` to load Vercel Analytics and Speed Insights |
| `NEXT_PUBLIC_SITE_NAME`                | No               | Overrides the short name used in titles                   |

`NEXT_PUBLIC_*` values are inlined at build time. Set them before you run
`next build`.

## AWS setup

You need three things in AWS: a DynamoDB table, a verified SES sender, and a
credential that can do a conditional put plus a send.

### 1. DynamoDB table

The table stores one item per signup. `email` is the partition key with a
duplicate condition on write, which is what stops double submissions.

Console settings:

- Table name: `fieldline-early-access` (any name, then set `DATABASE_TABLE`)
- Partition key: `email`, type `String`
- No sort key
- Capacity: on demand
- No secondary indexes needed

Command line equivalent:

```bash
aws dynamodb create-table \
  --table-name fieldline-early-access \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-west-2
```

To remove a test row:

```bash
aws dynamodb delete-item \
  --table-name fieldline-early-access \
  --key '{"email":{"S":"person@example.com"}}' \
  --region us-west-2
```

Item shape written by the app:

```json
{
  "email": { "S": "person@example.com" },
  "name": { "S": "Ayesha Khan" },
  "role": { "S": "Insurer" },
  "region": { "S": "Sindh" },
  "notes": { "S": "Optional free text" },
  "source": { "S": "early-access" },
  "formStartedAt": { "S": "1767225600000" },
  "submittedAt": { "S": "1767225600000" }
}
```

### 2. SES sender

- Move the account out of the SES sandbox, or at minimum verify the destination
  addresses you test with.
- Verify `SES_FROM_ADDRESS` in the same region as `AWS_REGION`.
- If the address is a domain, use DKIM and DMARC records so the mail lands in
  the inbox.

### 3. IAM policy

Minimal policy for the role or user the app runs as. Replace the account id and
region.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PutSignupIfEmailIsNew",
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:us-west-2:123456789012:table/fieldline-early-access"
    },
    {
      "Sid": "SendConfirmationMail",
      "Effect": "Allow",
      "Action": ["ses:SendEmail", "ses:SendRawEmail"],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "ses:FromAddress": "hello@fieldline.ag"
        }
      }
    }
  ]
}
```

If the table is created with a CMK, also allow `kms:Encrypt` and
`kms:GenerateDataKey` on that key.

### Credentials: prefer OIDC on Vercel

Short lived credentials from OIDC are better than a long lived access key, and
the app does not care which one it gets: the AWS SDK picks up whatever the
standard environment provides.

1. Create an IAM role that trusts `token.actions.githubusercontent.com` (for
   GitHub Actions) or the Vercel OIDC issuer, scoped to this repository.
2. Attach the policy above.
3. In Vercel, add the OIDC token exchange for the project.
4. Export the standard AWS variables into the build and runtime environment:

```bash
AWS_REGION=us-west-2
AWS_ROLE_ARN=arn:aws:iam::123456789012:role/fieldline-app
```

The AWS SDK for JavaScript v3 supports `AWS_ROLE_ARN` with OIDC credentials out
of the box through `@aws-sdk/credential-providers`, which Next.js loads on the
server. If your setup needs an explicit provider, set `AWS_WEB_IDENTITY_TOKEN_FILE`
and `AWS_ROLE_ARN` instead, which is the same mechanism in a different shape.

### Credentials: access key fallback

If you would rather use an IAM user:

1. Create an IAM user with no console access.
2. Attach only the policy above.
3. Create an access key and put both values in the environment.
4. Rotate the key on a schedule, or move to OIDC later.

Never commit these values. `.env.local` and `.env*.local` are git ignored.

## How the signup endpoint works

`POST /api/early-access` in `src/app/api/early-access/route.ts`:

1. Rate limits the caller by IP, 5 attempts per 10 minutes per IP.
2. Rejects payloads larger than 16 KB.
3. Validates the body with the shared Zod schema in `src/lib/schemas.ts`.
4. Rejects the honeypot field if it was filled.
5. Rejects submissions that arrive faster than 3 seconds after page load.
6. Checks the AWS environment. If any required variable is missing it runs in
   mock mode and returns success without touching AWS.
7. Writes to DynamoDB with a condition on `email`, so a duplicate returns a
   friendly "already on the list" answer instead of an error.
8. Sends the confirmation mail with SES. A mail failure is logged and does not
   fail the request, because the signup is already stored.
9. Returns a stable shape: `{ ok, code, message }`.

The rate limit lives in module memory. On a single serverless instance that is
honest protection against casual abuse. Across many instances it is best
effort. For hard limits use a shared store such as DynamoDB, Upstash Redis, or
a WAF rule, and swap the two functions in `src/lib/rate-limit.ts`.

## Deployment

### Vercel

1. Push the repository to GitHub.
2. Import it at vercel.com with the Next.js preset.
3. Add the environment variables from the table above to Production and Preview.
4. Deploy. The build runs `next build` automatically.
5. Point DNS for your domain at Vercel and set `NEXT_PUBLIC_SITE_URL` to the
   final origin.

### Any Node host

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

The app needs a Node runtime for the API route. `export const runtime =
'nodejs'` is already set on the route. A pure edge runtime would need a
different AWS credential path.

## Project structure

```
src/
  app/
    api/early-access/route.ts   server validation, rate limit, AWS writes
    favicon.ico, icon.svg, apple-icon.png, opengraph-image.tsx
    globals.css                 theme and base styles
    layout.tsx                  fonts, metadata, skip link, analytics
    page.tsx                    the eleven sections
  components/
    ui/                         Button, Field (form primitives)
    *.tsx                       sections and animation components
  lib/
    aws.ts                      DynamoDB and SES clients
    content.ts                  all structured copy, edit this first
    gsap.ts                     lazy GSAP loader
    rate-limit.ts               in memory limiter
    schemas.ts                  shared Zod schema
    signup.ts                   signup orchestration and mock mode
    site.ts                     canonical brand and link values
    utils.ts                    helpers
  styles/
    tokens.css                  colors, fonts, radii, easing, shadows
    base.css                    layout utilities and animation contracts
```

## Editing the copy

- Brand, links, region and crop: `src/lib/site.ts`
- Sections, steps, metrics, audiences, services, roadmap, FAQ:
  `src/lib/content.ts`
- Colors, fonts, radii: `src/styles/tokens.css`
- Type scale and spacing: `src/styles/tokens.css` and `src/styles/base.css`

Numbers you do not have yet are written as `TODO` in `content.ts`, for example
the roadmap dates. Qualitative claims are written as plain statements with no
figure attached. Do not invent a statistic, a customer, or a testimonial to fill
a gap.

## Fonts

Two families plus one mono, loaded with `next/font` in `src/app/layout.tsx`:

- Display: Bricolage Grotesque
- Text: Inter
- Data and labels: IBM Plex Mono

To swap a family, change the import and the `--font-display`, `--font-sans` and
`--font-mono` variables in `src/styles/tokens.css`. The build fails if Google
Fonts cannot be reached, which is the signal that the family name or weight
range is wrong.

## Animation

- Lenis drives scroll and is synced to the GSAP ticker in
  `src/components/SmoothScrollProvider.tsx`, so there is one loop.
- Hero canvas animation lives in `src/components/FieldGridCanvas.tsx`. It is
  imported with `next/dynamic`, pauses when off screen, and caps device pixel
  ratio at 2.
- The "How it works" sequence uses CSS `position: sticky` with a ScrollTrigger
  progress value. No GSAP pin, so no pin spacer and no layout shift.
- Under `prefers-reduced-motion: reduce` every reveal is static, the smooth
  scroll provider is inert, the canvas renders one frame, and the pinned
  sequence becomes a stacked list.

## Accessibility

- One `h1`, then `h2` per section, `h3` inside sections.
- Skip link, visible focus rings, labelled form fields, `aria-expanded` on the
  FAQ buttons.
- Body text meets WCAG AA against its background. Muted text is only used at
  16px and up.
- Color is never the only signal. The risk index uses text and a number as well
  as a bar.

## Security notes

- The API route never trusts client input beyond the validated schema.
- The honeypot and minimum submit time are speed bumps, not proof of a human.
- The CSP in `next.config.ts` is report friendly but strict: no inline script,
  no third party origins except Google Fonts and Vercel endpoints. If you add a
  script, add its origin to `script-src`.
- The DynamoDB write uses `ConditionExpression`, so a duplicate email cannot be
  inserted twice.

## Before you launch

Replace every placeholder. The full list is in the README section of your handoff
notes, and in short:

1. Company name, product name, domain, and contact email in `src/lib/site.ts`.
2. Legal page URLs (privacy, terms) in the footer links.
3. Social profile URLs in the footer.
4. Roadmap dates in `src/lib/content.ts`.
5. Any figure you want to publish, with a source, or remove the placeholder.
6. The AWS table, SES sender, and credential described above.
7. A designed Open Graph image if you do not want the generated one.
8. `NEXT_PUBLIC_SITE_URL` in every environment.

## License

Add your license here before publishing.
