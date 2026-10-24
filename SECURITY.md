# Security Policy

## Scope

Markazlashgan B is currently an educational MVP with a client-side demo quiz and read-only serverless endpoints. It is not yet suitable for storing real student records or sensitive personal data.

## Reporting a vulnerability

Please do not publish credentials, student information, or exploitable details in public issues. Contact the repository maintainers privately through GitHub's supported security reporting channel, if enabled. Otherwise, contact a maintainer directly and include reproduction steps, impact, and affected commit.

## Deployment checklist

- Keep secrets out of source control and client-side `VITE_*` variables.
- Store production secrets only in the hosting provider's secret/environment-variable store.
- Enable GitHub two-factor authentication and review repository access.
- Review dependency alerts and update vulnerable packages promptly.
- Keep write endpoints authenticated, authorized, validated, rate-limited, and protected against abuse before introducing them.
- Do not store real student results until server-side authentication, access controls, database backups, retention rules, and privacy requirements are implemented.
- Verify response headers and production health endpoint after each deployment.

## Supported versions

Security fixes target the current default branch. There is no separate supported release branch yet.
