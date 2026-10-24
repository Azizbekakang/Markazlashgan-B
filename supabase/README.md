# Supabase database foundation

This folder contains an initial PostgreSQL schema for student profiles, quiz attempts, and lesson completion.

## Apply

1. Create a Supabase project.
2. Review the migration and the applicable student-data/privacy requirements.
3. Apply `migrations/20261024000000_initial_schema.sql` in the Supabase SQL Editor or through the Supabase CLI migration workflow.
4. Verify RLS is enabled on all three tables and test policies with two separate authenticated test users.
5. Configure backups, retention, monitoring, and access to the project before production use.

## Security model

- Profile rows are scoped to `auth.uid() = id`.
- Quiz attempts and lesson progress are scoped to `auth.uid() = user_id`.
- The schema intentionally has no public/anonymous access policies.
- Never expose a Supabase service-role key in frontend code or any `VITE_*` variable.
- Validate score and payload semantics in trusted server-side code as well; database constraints are defense in depth.

## Integration status

This is database groundwork only. The current React UI and demo API do not yet read or write these tables, and no Supabase project credentials are configured. Do not treat this migration as a completed authentication or persistence integration.
