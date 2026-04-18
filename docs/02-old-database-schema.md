# Twikka — Old Postgres Schema Reference

**Status:** Reference document. The old database is the **Supabase Postgres** instance behind the previous Twikka Flutter app. The new Twikka rebuild (this repo) targets **Convex** (see `01-architecture-patterns.md`); this document exists so the Convex schema design has a complete, faithful picture of what the old data model actually is.

**Source of truth:** The `supabase-twikka` MCP server, queried on **2026-04-18**. Methodology and exact queries are listed at the end of this document so the dump can be regenerated and diffed if/when the old DB changes.

**Scope:** Schemas `public` (57 tables, 2 views) and `social` (15 tables, 1 view). The Supabase-managed schemas (`auth`, `storage`, `realtime`, `extensions`, `vault`, `pgsodium`, `pgmq`, `graphql`, `pg_catalog`, etc.) are intentionally excluded except where the app schema references them — the only such reference is `public.user_data.auth_id → auth.users.id`.

**What this document is not:** It is not a migration script. It is not a Convex schema. It is the input artefact those will be derived from. Where the old schema looks broken, dead, or accidental, that is called out — see [§ Known oddities and likely-dead tables](#known-oddities-and-likely-dead-tables) before you copy anything blindly into the new model.

---

## Table of contents

- [High-level shape](#high-level-shape)
- [Custom enums](#custom-enums)
- [Views](#views)
- [Triggers](#triggers)
- [Stored functions](#stored-functions)
- [Installed extensions](#installed-extensions)
- [RLS posture](#rls-posture)
- [`public` schema — tables](#public-schema--tables)
- [`social` schema — tables](#social-schema--tables)
- [Known oddities and likely-dead tables](#known-oddities-and-likely-dead-tables)
- [Notes for the Convex rebuild](#notes-for-the-convex-rebuild)
- [Methodology — how this dump was produced](#methodology--how-this-dump-was-produced)

---

## High-level shape

The old database has two app-owned schemas that play very different roles:

- **`public`** — the original product surface. Contains the user record (`user_data`), the activity-planning domain (`plan`, `plan_day`, `plan_day_activity`, `day`, `day_activity`, `day_plan_activity`, `day_stats`), the activity catalog (`activity`, `activity_alias`, `activity_favorite`, plus a legacy `activity_type` and a now-unused `coa_*` Compendium-of-Physical-Activities reference dataset), the marketing blog (`blog_post`, `blog_category`, `blog_tag` and join tables), and a long tail of operational tables (notifications/`user_comm`, transactional email/`messages`, RevenueCat webhook log, organisation/affiliate management, content tips, geographical reference data, debug logging, web form submissions). Almost every table has a `created_at timestamptz default now()` and a bigint identity primary key — Supabase defaults.
- **`social`** — a self-contained subdomain for messaging and groups. Has its own `user` table (one-to-one with `public.user_data` via `social.user.app_user`), and models `group`, `member`, `message`, `message_attachment`, `message_reaction`, `message_read`, `event`, `event_attendee`, `challenge`, `challenge_entry`, `block`, `connection_request`, `moderation`, `avatar`. Was added later than the core `public` schema; the comment on `social.user` explicitly says *"For encapsulation"*.

**Cross-schema bridges:**
1. `public.user_data.auth_id (uuid) → auth.users.id` — Supabase Auth bridge. **In Convex+Clerk, this is replaced by a Clerk subject string stored on the user document; see `01-architecture-patterns.md`.**
2. `social.user.app_user → public.user_data.id` — every social user shadows a public user.
3. `social.avatar.user → public.user_data.id` and `social.avatar.group → social.group.id` — the avatar table is polymorphic (discriminated by `social.avatar.type` enum `{user, group}`) and reaches across schemas to attach to either side.

**Counts (rows) — only tables with non-zero rows at the time of the dump:**

| Schema.Table | Rows | Note |
|---|--:|---|
| `public.dbg_log` | 27,389 | Debug log — drop in rebuild. |
| `public.day` | 447 | Real planning data (one user). |
| `public.day_stats` | 447 | Mirrors `day` 1:1. |
| `public.day_plan_activity` | 319 | |
| `public.user_comm` | 317 | Outbound notifications. |
| `public.blog_post` | 69 | Marketing content. |
| `public.plan_day` | 21 | |
| `public.web_form_submission` | 17 | Contact form etc. |
| `public.plan_day_activity` | 11 | |
| `public.blog_category` | 7 | |
| `public.plan` | 3 | |
| `public.blog_post_category` | 3 | |
| `public.activity_favorite` | 2 | |
| `public.user_data` | 1 | Single user in this DB. |
| `social.user` | 1 | The same user, shadowed. |

Everything else is empty. The DB is sparsely populated — likely a dev / staging instance, not production. **Do not use the row counts to infer "this table doesn't matter"**; many empty tables are part of the design (e.g., `interest`, `interest_category`, `social.*` chat tables) and will populate in production.

---

## Custom enums

Eleven enums, all in `public` or `social`. Values are listed in declaration order (the order Postgres uses for ordinal comparisons on enum columns).

| Schema.Type | Values |
|---|---|
| `public.appearance` | `light`, `dark`, `system` |
| `public.organisation_type` | `affiliate`, `corporate` |
| `public.plans` | `Personal`, `Plus`, `Mentor`, `Enterprise` |
| `public.role` | `owner`, `admin`, `user`, `viewer` |
| `social.avatar_type` | `user`, `group` |
| `social.connection_status_type` | `Pending`, `Accepted`, `Rejected` |
| `social.event_option_type` | `Yes`, `No`, `Maybe`, `Cancelled`, `No show` |
| `social.group_status_type` | `Active`, `Suspended`, `Archived` |
| `social.member_status_type` | `Pending`, `Active`, `Rejected`, `Left`, `Suspended`, `Blocked`, `Removed` |
| `social.message_file_type` | `Photo`, `Video`, `Audio`, `File` |
| `social.moderation_status_type` | `Submitted`, `In Review`, `Accepted`, `Flagged`, `Violation` |

PostGIS `geography` is also used as a column type on `public.location.point` and `social.group.point` (typed as `USER-DEFINED` in `information_schema`). The `vector` extension is *available* but not installed — there are no `vector` columns in either schema.

**Style note:** Casing is inconsistent — some enums use lower-snake-case values (`appearance`, `role`, `plans`, `organisation_type`, `avatar_type`), others use Title Case with spaces (`event_option_type` includes `"No show"`, `moderation_status_type` includes `"In Review"`). The Convex rebuild should normalise on one convention (recommended: lower-snake) and document the mapping when migrating data.

---

## Views

There are two views and zero materialized views.

### `public.user_comm_monitor`
Operational view layered over `user_comm` for the admin dashboard. Computes a human-readable `status` column using emoji prefixes (`✅ Sent`, `❌ Stale (missed)`, `⏳ Due`, `🕒 Future`, `❓ Unknown`) based on the relationship between `now()`, `scheduled`, `sent`, and `processed`. Stale-after window is 30 minutes past scheduled. The view is `ORDER BY uc.created_at DESC`, so it's intended for direct human read, not for joining.

### `social.user_connections`
Synthesises a user's "connections" from the membership graph. The interesting trick is that **a 1:1 chat** is represented as a private `group` with exactly two members — the view detects this with `g.private = true AND g.user_count = 2` and re-labels the row as `connection_type = 'connection'` (versus `'group'`) and pulls the *other* user's `display_name` as the `display_name` column. Filters to `member.status = 'Active'` only.

This is load-bearing: it tells you that the old data model **does not have a separate "DM" entity** — DMs are encoded as private 2-member groups. The Convex rebuild needs to decide whether to preserve that encoding or model 1:1 chats as a first-class entity.

---

## Triggers

19 user-defined triggers across `public` and `social`. They fall into three groups:

### App-logic triggers (plpgsql, internal)
Drive the cascading "day rollups" — when a `day_activity` is inserted, recompute summary fields on the parent `day`; when a `day` is updated, recompute parent `plan` totals; etc. Naming convention is `<table>_<event>_<timing>` where event ∈ `{c=create, u=update, d=delete}` and timing ∈ `{b=before, a=after}`.

| Schema.Table | Trigger | Timing | Event | Function |
|---|---|---|---|---|
| `public.content` | `content_c_u_b` | BEFORE | INSERT | `content_c_u_b` |
| `public.day` | `day_c_b` | BEFORE | INSERT | `day_c_b` |
| `public.day` | `day_c_a` | AFTER | INSERT | `day_c_a` |
| `public.day` | `day_u_b` | BEFORE | UPDATE | `day_u_b` |
| `public.day` | `day_d` | AFTER | DELETE | `day_d` |
| `public.day_activity` | `day_activity_cud` | AFTER | INSERT | `day_activity_cud` |
| `public.revenuecat` | `revenuecat_c_b` | BEFORE | INSERT | `revenucat_c_b` *(typo preserved from prod)* |
| `public.revenuecat` | `revenuecat_c_a` | AFTER | INSERT | `revenuecat_c_a` |
| `public.user_comm` | `user_comm_c_b` | BEFORE | INSERT | `user_comm_c_b` |
| `public.user_data` | `user_data_cu_b` | BEFORE | INSERT | `user_data_cu_b` |
| `public.user_data` | `user_data_cu_a` | AFTER | INSERT | `user_data_cu_a` |
| `social.member` | `update_group_member_count` | AFTER | INSERT | `social.update_group_member_count` |

### HTTP-fanout triggers (`extensions.http_request`)
Side-effect-on-write triggers that POST to external services (Make.com, Zoho, etc.) when rows are inserted/updated. **These are how the old system fires off webhooks. None of this transfers to Convex** — in Convex you'd write a `mutation` that explicitly calls `ctx.scheduler.runAfter(0, ...)` to enqueue the side-effect, with much better failure semantics than these triggers offer.

| Schema.Table | Trigger | Timing | Event | Notes |
|---|---|---|---|---|
| `public.day` | `iu_day_Make` | AFTER | INSERT | Make.com webhook |
| `public.day` | `newUpdateDay` | AFTER | INSERT | Make.com webhook |
| `public.plan_day` | `updatePlanDay` | AFTER | UPDATE | Make.com webhook |
| `public.user_data` | `newUserData` | AFTER | INSERT | Make.com webhook |
| `public.user_data` | `newUserZoho` | AFTER | INSERT | Zoho CRM sync |
| `public.user_data` | `updateUserData` | AFTER | UPDATE | Make.com webhook |

### Notification trigger
`public.web_form_submission.on_web_form_submission_insert` (AFTER INSERT) → `notify_web_form_submission()` — sends an email when someone submits the marketing-site contact form.

---

## Stored functions

There are **66 user-defined functions** in `public` and **1** in `social` (`update_group_member_count`). They fall into broad categories — full names are listed so you can grep the old DB if you need to port the logic.

**Trigger functions** (return `trigger`): `auth_new_user`, `auth_user_c`, `chat_member_c_d`, `content_c_u_b`, `day_c_a`, `day_c_b`, `day_d`, `day_u_b`, `day_activity_cud`, `fcm_token_cu_a`, `handle_auth_user_email_change`, `notify_web_form_submission`, `plan_c`, `plan_d`, `plan_day_d`, `plan_day_u_a`, `plan_day_u_b`, `plan_day_activity_cud`, `revenucat_c_b` (sic), `revenuecat_c_a`, `update_day_plan_activity_done`, `user_comm_c_b`, `user_data_cu_a`, `user_data_cu_b`, `social.update_group_member_count`.

**Day/plan rollup logic (the real product brain):** `update_active_day_records`, `update_day_p_fields`, `populate_day_graph`, `util_populate_day_graph`, `pl_ac_percent(planned int, actual int)`, `daily_activity`, `user_activity_days`, `user_activity_stats`, `create_days_for_user(target_user_id, start_date, end_date)`, `debug_day_c(p_user_id, p_date)`, `delete_plan(plan_id)`, `discard_plan_package(p_plan_id)`, `get_day_graph_data(p_user_id)`, `get_day_package(p_user_id, p_date)`, `get_plan_package(p_user_id, p_plan_id)`, `get_user_activities(p_user_id)`, `get_week_start_dates(user_id)`, `read_plan_package(p_plan_id)`, `save_plan_package(p_package, p_user_id)`, `save_plan_package_temp(p_package)`, `day_stats(user_id, interval_type, num_units)`, `day_stats_weekly(user_id)`, `day_stats_monthly(user_id)`. **All of this becomes Convex queries / mutations / actions.** The `*_package` family in particular is the contract the old Flutter app uses to fetch a day or plan as a single JSON blob — those exact shapes are likely what the old Flutter UI expected, so they're the place to start when defining Convex `query` shapes.

**Notification dispatch:** `comms_send_cron`, `notification_email`, `notification_push(communication_rec_id)`, `notification_sms`, `mail_send_email(message jsonb)`, `send_email_mailersend`, `send_email_message`, `send_email_new_user(user_id)`, `signup_user_mailerlite(p_name, p_email)`, `test_onesignal`. **In the new stack, transactional email is Postmark called from Convex actions; push is OneSignal called from Convex actions** — this whole block is replaced wholesale.

**Deletion/lifecycle:** `delete_user_data(p_user_data_id integer)`, `delete_plan(plan_id bigint)`. Both are non-trivial cascades; reread before designing the Convex equivalents.

**User profile / interests:** `update_user_data`, `update_user_interests(p_user_id, p_interest_ids[])`.

**Auth integration / OTP:** `check_otp_access(p_identifier text, p_app_id text)` — returns a record. Likely the magic-link / OTP web sign-in path. Replaced by Clerk in the new stack.

**Rate limiting:** `check_form_rate_limit(p_table_name, p_ip_address, p_limit, p_window_hours)` — guards `web_form_submission` etc. against abuse from anon writes. In the Convex rebuild this either disappears (if forms go through a server action behind Clerk) or is reimplemented in Convex with a small rate-limit table.

**Maintenance / cron:** `cron_run_vacuum`, `day_c_cron`, `comms_send_cron`. These run via `pg_cron`. The `cron_job` table is an audit log of what fired.

**Debug / scratch:** `debug_log(message text)`, `debug_day_c`, `copy_workout_to_activity` (one-off migration helper from `workout_type` → `activity`).

For each function, `security_definer` and language are recorded in the methodology dump. Notable security-definer functions (run as the function owner, bypassing RLS): `auth_new_user`, `auth_user_c`, `check_form_rate_limit`, `check_otp_access`, `delete_plan`, `get_user_activities`, `handle_auth_user_email_change`, `notify_web_form_submission`, `send_email_*`, `update_user_interests`, `user_data_cu_a`, `user_data_cu_b`, `social.update_group_member_count`. **In Convex this concept disappears** — Convex functions always run with full DB access; you enforce per-call authorization in code.

---

## Installed extensions

Only the actually-installed ones (the dump also lists ~80 available-but-not-installed extensions; those are noise):

| Extension | Schema | Version | Purpose |
|---|---|---|---|
| `plpgsql` | `pg_catalog` | 1.0 | Procedural language. |
| `pg_cron` | `pg_catalog` | 1.6 | Scheduled jobs (drives `*_cron` functions and the `cron_job` audit table). |
| `uuid-ossp` | `extensions` | 1.1 | UUID generation (used for `messages.id`). |
| `pgcrypto` | `extensions` | 1.3 | Cryptographic functions. |
| `pgjwt` | `extensions` | 0.2.0 | JWT helpers. |
| `pg_stat_statements` | `extensions` | 1.10 | Query stats — Supabase-default. |
| `pg_trgm` | `extensions` | 1.6 | Trigram fuzzy text search. |
| `pg_net` | `extensions` | 0.14.0 | Async HTTP — *probably* what `http_request` triggers use; may also be `http`. |
| `http` | `extensions` | 1.6 | Synchronous HTTP client — used by HTTP-fanout triggers above. |
| `postgis` | `extensions` | 3.3.7 | Geography types on `location.point`, `social.group.point`. |
| `wrappers` | `extensions` | 0.4.3 | Foreign Data Wrappers (Supabase). |
| `pg_graphql` | `graphql` | 1.5.9 | Auto-GraphQL over Postgres — Supabase default; not used by the Flutter app. |
| `supabase_vault` | `vault` | 0.2.8 | Encrypted-secrets storage — Supabase default. |
| `pgsodium` | `pgsodium` | 3.1.8 | Crypto primitives backing `vault`. |
| `pgmq` | `pgmq` | 1.4.4 | Message queue — present but unused by the app schema. |

**For Convex rebuild planning:** the only extensions doing real product work are `http`/`pg_net` (HTTP-fanout triggers — replaced by Convex actions/scheduler), `pg_cron` (scheduled jobs — replaced by Convex `crons.ts`), and `postgis` (geo — Convex has no native geo type; we'll need to store `{lat, lng}` and either do bounding-box filters in queries or push geo search out to a vector DB or external service).

---

## RLS posture

**Every table in `public` and `social` has `rls_enabled = true`.** That is the *Supabase default*; what matters is the policy bodies. The pattern across the dump is:

1. **"Default permit-all" policies** — many tables have a policy literally named `default` with `cmd = ALL`, `roles = {public}`, `qual = true`, `with_check = true`. This is RLS-enabled-but-effectively-open. Tables in this category include: `activity_type`, `app`, `barrier`, `content`, `content_tag`, `country_code`, `cron_job`, `day`, `day_activity`, `day_plan_activity`, `day_stats`, `dbg_log`, `messages` (also has explicit-deny policies layered on top — see below), `organisation`, `organisation_user`, `pending_signups`, `plan`, `plan_day`, `plan_day_activity`, `reason`, `referrals`, `revenuecat`, `skip_reason`, `stats_prev_week`, `subscription_events`, `test`, `time_zone`, `time_zone_full`, `timezone_name`, `tip`, `tip_tag`, `user_comm`, `user_data`, `user_new_corp`, `video_urls`, `workout_type`. **This is not real authorization — the security model lives in the Flutter client and in the Postgres functions, not in RLS.** That's important context for the Convex rebuild: don't assume the old DB enforced anything; assume the *application layer* did.

2. **Genuine per-user RLS** — only `public.user_interest` has real policies: `auth.uid() = (SELECT user_data.auth_id FROM user_data WHERE id = user_interest.user_data)` for SELECT/INSERT/UPDATE/DELETE.

3. **Admin-gated writes** — `public.interest` and `public.interest_category` allow read to all authenticated users but restrict INSERT/UPDATE/DELETE to admins, identified by `auth.jwt() ->> 'email' IN (SELECT email FROM user_data WHERE admin = true)`. Scales poorly (subquery per row) but works.

4. **Public-read / restricted-write** — the blog (`blog_category`, `blog_post`, `blog_post_category`, `blog_post_tag`, `blog_tag`) is publicly SELECTable; `blog_post` is filtered to `status = 'published'`. No INSERT/UPDATE/DELETE policies — writes presumably go through service-role from a CMS process.

5. **Anon-write / authenticated-read** — `public.web_form_submission` allows `INSERT` from `anon` but `SELECT` only from `authenticated`. The marketing contact form pattern.

6. **Explicit-deny** — `public.city` has explicit `qual = false` / `with_check = false` policies for INSERT/UPDATE/DELETE; `public.messages` does the same. This is "RLS-enabled, public-readable for SELECT, blocked for everything else" (writes go through service-role only). `public.messages` *also* has the `default` permit-all policy, so the deny policies are layered on top — Postgres OR's permissive policies, so the *more permissive* one wins. This means the explicit denies on `public.messages` are dead code; writes are effectively allowed. **Probable bug in the original RLS configuration.**

7. **`activity`, `activity_alias`, `activity_favorite`** — four named "Allow all users to" policies for {SELECT, INSERT, UPDATE, DELETE}, gated by `roles = {anon, authenticated}` with `qual = true`. Functionally identical to the `default` permit-all but written more explicitly.

8. **`social.*` tables** — uniformly four "Enable {select|insert|update|delete} for authenticated users" policies with `qual = true`. So: any authenticated user can read/write any social row. Per-user authorization is enforced in the application layer, not in RLS. Same pattern as `public.user_data` and friends.

**Bottom line for the Convex port:** RLS in the old DB is mostly performative. The actual authorization rules — who can read whose `day`, who can post in which `group`, who can edit which `plan` — live in the Flutter app and in the `*_package` SQL functions. The Convex rebuild needs to make those rules **first-class** (in `query`/`mutation` bodies, gated on `ctx.auth`), and we can't lift the rules from RLS — they aren't there.

---

## `public` schema — tables

Tables are listed alphabetically. For each table: comment (if present), primary key, columns (with type, nullability, default, and notes), foreign keys *out*, and incoming references *from*. RLS posture summarised inline; full policy text is in the [RLS posture](#rls-posture) section.

> **Conventions:**
> - Every table has `rls_enabled = true` — only deviations from the default permit-all policy are called out per-table.
> - `id bigint identity` is the standard PK; only deviations are noted.
> - `created_at timestamptz default now()` is on virtually every table; only the few exceptions are called out.

### `public.activity`
**Comment:** *Unified activity list for integrations.*
**PK:** `id` (bigint, *not* identity — IDs are externally assigned, presumably matched to iOS/Android workout type identifiers).
**Columns:** `id`; `display_name text NOT NULL ''`; `cardio bool NOT NULL false`; `strength bool NOT NULL false`; `workout_type text NOT NULL ''`; `ios_name text NOT NULL ''`; `android_name text NOT NULL ''`; `comment text NOT NULL ''`; `deprecated bool NOT NULL false`. **No `created_at`.**
**Referenced by:** `activity_alias.activity`, `activity_favorite.activity`, `day_activity.activity`, `day_plan_activity.activity`, `plan_day_activity.activity`.
**Notes:** This is the canonical activity catalogue. Supersedes `activity_type` and `workout_type` (both retained for legacy reasons; see [§ Known oddities](#known-oddities-and-likely-dead-tables)).

### `public.activity_alias`
**Comment:** *User's own name for activities.*
**PK:** `id`.
**Columns:** `id`; `created_at`; `activity bigint NOT NULL`; `user_data bigint NOT NULL`; `alias text NOT NULL ''`.
**FKs:** `activity → public.activity.id`; `user_data → public.user_data.id`.
**Notes:** Junction table letting a user rename an activity in their UI without changing the catalogue.

### `public.activity_favorite`
**Comment:** *User favorite activities.*
**PK:** `id`.
**Columns:** `id`; `created_at`; `activity bigint NOT NULL`; `user_data bigint NOT NULL`; `cardio bool NOT NULL false`; `strength bool NOT NULL false`.
**FKs:** `activity → public.activity.id`; `user_data → public.user_data.id`.

### `public.activity_type`
**Comment:** *Available activity options.*
**PK:** `id`.
**Columns:** `id`; `created_at`; `name text`; `cardio bool`; `strength bool`; `order smallint`; `visible bool default false`; `workout_type text`; `ios_name text`; `android_name text`; `ios bool`; `android_fit bool`; `android_connect bool`; `comment text`.
**Notes:** **Legacy.** The columns overlap heavily with `activity` but are nullable/looser. Superseded by `public.activity`. Keep for reference only.

### `public.activity_type_changed`
**No comment.** **PK:** `id`.
**Columns:** mirrors `activity_type` columns plus `matches text`. **All nullable.**
**Notes:** **Audit/migration scratch table.** No FKs, no triggers; looks like a one-shot snapshot taken when migrating `activity_type` → `activity`. **Drop in the rebuild.**

### `public.app`
**Comment:** *Global app state.*
**PK:** `id`.
**Columns:** `id`; `created_at`; `available bool`; `reason text`; `back_online timestamptz`; `min_app_version real default 1`.
**Notes:** Singleton pattern — a single row gates the app's "we're up / we're in maintenance" banner and the minimum supported app version. In Convex this is a single document or a small table read on app boot.

### `public.barrier`
**Comment:** *Barriers to Exercise.* **PK:** `id`. **Columns:** `id`; `created_at`; `barrier text`; `order smallint`. **Notes:** Reference data shown during onboarding ("what stops you exercising?"). Likely seeded.

### `public.blog_category`
**No comment.** **PK:** `id` (identity ALWAYS).
**Columns:** `id`; `name text NOT NULL`; `slug text NOT NULL`; `description text`; `display_order int default 0`; `is_active bool default true`; `ripplebase_id uuid`; `ripplebase_synced_at timestamptz`; `created_at`; `updated_at`; `canonical_id bigint`; `language_code varchar default 'en'`.
**Referenced by:** `blog_post_category.category_id`.
**Notes:** The `ripplebase_*` columns indicate the blog content is mirrored from an external CMS called **Ripplebase**; the local table is a synced read-cache. The `canonical_id` + `language_code` + `translation_status` triple (see `blog_post`) implements i18n by row-duplication: each translation is a separate row sharing a `canonical_id`. **Worth preserving in the rebuild** since i18n is a confirmed v2 goal.

### `public.blog_post`
**No comment.** **PK:** `id` (identity ALWAYS).
**Columns:** `id`; `ripplebase_id uuid`; `ripplebase_version int`; `ripplebase_synced_at timestamptz`; `title text NOT NULL`; `slug text NOT NULL`; `excerpt text`; `content text`; `content_html text`; `cover_image_url text`; `cover_image_alt text`; `author_name text`; `author_bio text`; `author_image_url text`; `meta_title text`; `meta_description text`; `status text default 'draft'` **CHECK** `status IN ('draft','published','archived')`; `published_at timestamptz`; `reading_time_minutes int`; `word_count int`; `created_at`; `updated_at`; `is_featured bool default false`; `canonical_id bigint`; `language_code varchar default 'en'`; `is_original bool default true`; `translated_from_id bigint`; `translation_status varchar default 'original'`.
**FKs:** `translated_from_id → public.blog_post.id` (self-referential — translation lineage).
**Referenced by:** `blog_post_category.post_id`, `blog_post_tag.post_id`.
**RLS:** `SELECT` is public but filtered to `status = 'published'`.
**Notes:** Public marketing blog. The only table in the entire dump with a CHECK constraint exposed by the dump.

### `public.blog_post_category` *(junction)*
**PK:** `(post_id, category_id)` composite.
**Columns:** `post_id bigint NOT NULL`; `category_id bigint NOT NULL`; `is_primary bool default false`.
**FKs:** `post_id → blog_post.id`; `category_id → blog_category.id`.

### `public.blog_post_tag` *(junction)*
**PK:** `(post_id, tag_id)` composite. **Columns:** `post_id`, `tag_id`. **FKs:** to `blog_post`, `blog_tag`.

### `public.blog_tag`
**PK:** `id` (identity ALWAYS). **Columns:** `id`; `name text NOT NULL`; `slug text NOT NULL`; `ripplebase_id uuid`; `ripplebase_synced_at timestamptz`; `created_at`; `canonical_id bigint`; `language_code varchar default 'en'`. **Referenced by:** `blog_post_tag.tag_id`.

### `public.city`
**Comment:** *Cities with IANA time_zones.*
**PK:** `geonameid` *(not a sequence — uses GeoNames IDs verbatim).*
**Columns:** `geonameid bigint NOT NULL`; `name text`; `asciiname text`; `alternatenames text`; `latitude double precision`; `longitude double precision`; `country_code text`; `timezone text`.
**RLS:** publicly readable; writes explicitly denied (see [§ RLS posture #6](#rls-posture)).
**Notes:** Reference dataset from GeoNames. Used for "what city are you in?" autocomplete during onboarding. Almost certainly drop-and-reseed in the rebuild.

### `public.coa_activity`
**Comment:** *Combined Compendium of Physical Activity.*
**PK:** `id` (sequence `coa_activities_id_seq`).
**Columns:** `activity_code bigint`; `met double precision` *(metabolic equivalent)*; `activity_description text`; `id`; `heading bigint`; `class bigint`.
**FKs:** `heading → coa_heading.id`; `class → coa_class.id`.
**Notes:** Compendium of Physical Activities reference dataset for MET (metabolic equivalent of task) lookup. **Dead in production** — the app uses `activity` for selection. Could be retained as a seed dataset for future MET calculations, or dropped.

### `public.coa_class`
**Comment:** *Adult, Older Adult or Wheel Chair.* PK `id`. Columns: `id`; `created_at`; `class text`. **Referenced by:** `coa_activity.class`.

### `public.coa_heading`
**Comment:** *Type of Activity.* PK `id`. Columns: `id`; `created_at`; `heading text`. **Referenced by:** `coa_activity.heading`.

### `public.content`
**Comment:** *App content.*
**PK:** `id`. **Columns:** `id`; `created_at` (timestamp **without** time zone — unlike most tables); `title text`; `content text`; `url text`; `pic_url text`; `tags text[]`; `url_name text`; `published bool default false`; `content_short text`.
**Trigger:** `content_c_u_b` BEFORE INSERT.
**Notes:** In-app content cards / articles. Distinct from `blog_post` (which is the public marketing blog).

### `public.content_revised`
**No comment.** PK `id`. **Notes:** Migration-scratch table mirroring `content` with `tags` reshaped from `text[]` to `jsonb` and an extra `title_new` / `content_long` column. **Drop.**

### `public.content_tag`
**Comment:** *Tags for content.* PK `id`. Columns: `id`; `created_at` (no TZ); `tag text`; `order smallint`. **Notes:** No FK from `content` — tags are denormalised onto `content.tags`.

### `public.country_code`
**Comment:** *Country codes from TimeZoneDB.* PK `id`. Columns: `id`; `created_at`; `code varchar`; `country varchar`. **Notes:** Reference data; reseed in rebuild.

### `public.cron_job`
**Comment:** *Audit of pg_cron activity.* PK `id`. Columns: `id`; `created_at`; `job_name varchar`. **Notes:** Tells you when scheduled jobs fired. Doesn't transfer — Convex has its own scheduler and observability.

### `public.day`
**Comment:** *Daily record for users.* **High-volume table** (447 rows for one user — one per day they were active).
**PK:** `id`.
**Columns:** `id`; `created_at`; `date date`; `day_name text`; `complete bool default false`; `skipped bool default false`; `skip_note text default ''`;
*Plan-side rollups* (computed from this user's `plan` for this `day`): `p_summary text`; `p_total_sessions smallint`; `p_cardio_sessions smallint`; `p_strength_sessions smallint`; `p_total_minutes smallint`; `p_cardio_minutes smallint`; `p_strength_minutes smallint`;
`day_number smallint` (ordinal within the plan);
*Actual-side rollups* (computed from `day_activity` rows): `a_summary text`; `a_total_sessions smallint`; `a_cardio_sessions smallint`; `a_strength_sessions smallint`; `a_total_minutes smallint`; `a_cardio_minutes smallint`; `a_strength_minutes smallint`;
*Percent-complete derivatives*: `total_mins_percent double`; `cardio_mins_percent double`; `strength_mins_percent double`; `total_sess_percent double`; `cardio_sess_percent double`; `strength_sess_percent real`;
`user_data bigint`; `plan bigint`; `update_trigger bool default false` *(internal flag used by triggers)*; `skip_reasons text[]`; `a_equiv_minutes smallint`.
**FKs:** `plan → plan.id`; `user_data → user_data.id`.
**Triggers:** `day_c_b` BEFORE INSERT, `day_c_a` AFTER INSERT, `day_u_b` BEFORE UPDATE, `day_d` AFTER DELETE, plus two HTTP webhook triggers (`iu_day_Make`, `newUpdateDay`).
**Referenced by:** `day_activity.day`, `day_plan_activity.day`, `day_stats.day`.
**Notes:** This table is **the heart of the product**. The `p_*` and `a_*` columns are denormalised aggregates maintained by triggers; the Convex equivalent will need similar derived data, but you have the option of doing it in queries (with proper indexing) instead of writing-on-write. Worth thinking about carefully.

### `public.day_activity`
**Comment:** *A single activity on a day. Related to day.*
**PK:** `id`.
**Columns:** `id`; `created_at`; `day bigint`; `activity_text text`; `cardio bool`; `strength bool`; `quantity smallint`; `units text`; `time_of_day text`; `effort smallint`; `mood_before smallint`; `done bool default false`; `note text`; `time_of_day_order smallint`; `summary text`; `planned_activity_id bigint` *(no FK — soft link to `day_plan_activity`)*; `mood_after smallint`; `activity bigint`.
**FKs:** `activity → activity.id`; `day → day.id`.
**Trigger:** `day_activity_cud` AFTER INSERT (drives the parent `day`'s `a_*` rollups).

### `public.day_plan_activity`
**Comment:** *A single planned activity. Related to plan.* (despite the name and comment, this is per-day, not per-plan).
**PK:** `id`.
**Columns:** `id`; `created_at`; `activity_text text`; `cardio bool`; `strength bool`; `quantity smallint`; `units text`; `time_of_day text`; `day bigint`; `summary text`; `time_of_day_order smallint`; `done bool default false`; `plan_day_activity bigint` *(soft link, no FK — references `plan_day_activity.id` template)*; `activity bigint`.
**FKs:** `activity → activity.id`; `day → day.id`.
**Notes:** The plan template (`plan_day_activity`) is **copied into** `day_plan_activity` per-day, so the user's plan-as-executed survives plan edits. Don't conflate with `day_activity` (actual completed work) or `plan_day_activity` (the recurring template).

### `public.day_stats`
**Comment:** *Cumulative statistics for this day for a given user.*
**PK:** `id`. **Columns:** `id`; `created_at`; `user_data bigint`; `date date`; `plan_mins_day int default 0`; `plan_mins_total int default 0`; `actual_mins_day int default 0`; `actual_mins_total int default 0`; `user_active bool NOT NULL default false`; `cardio_mins_day int default 0`; `cardio_mins_total int default 0`; `strength_mins_day int default 0`; `strength_mins_total int default 0`; `day bigint`.
**FKs:** `user_data → user_data.id`; `day → day.id`.
**Notes:** 1:1 with `day` (447 rows, same as `day`). The `*_total` columns are running cumulatives — feeds the streak / progress UI without recomputing on read.

### `public.dbg_log`
**Comment:** *Logging info for functions etc.* PK `id`. Columns: `id`; `created_at`; `message text`; `json jsonb`. **27,389 rows** — by far the largest table. **Drop in rebuild** (Convex has its own logs / dashboard).

### `public.email_events`
**Comment:** *Transactional email events.* PK `id`. Columns: `id`; `created_at`; `webhook jsonb`; `event text`; `from text`; `to text`; `subject text`. **Notes:** Receiver for ESP webhooks (MailerSend etc.). New stack: Postmark webhooks land in a Convex action and get persisted similarly.

### `public.image`
**Comment:** *Image reference table to include blurhash.* PK `id`. Columns: `id`; `created_at`; `url text`; `blurhash text`. **Notes:** Empty in dump; intended for shared image refs with blurhash placeholders.

### `public.interest`
**Comment:** *Personal interests for social matching.* PK `id`. Columns: `id`; `created_at`; `category bigint`; `interest text`. **FKs:** `category → interest_category.id`. **RLS:** read for authenticated users; admin-gated writes (see [§ RLS posture #3](#rls-posture)).

### `public.interest_category`
**Comment:** *Interest categories for social matching.* PK `id`. Columns: `id`; `created_at`; `sort_order smallint`; `category text`. **Referenced by:** `interest.category`. **RLS:** same admin-gated pattern.

### `public.location`
**Comment:** *A physical location.* PK `id`. Columns: `id`; `created_at`; `name text`; `address text`; `latitude double precision`; `longitude double precision`; `point geography` *(PostGIS)*. **Notes:** Empty. No FKs in or out — orphan table. Probably abandoned in favour of inline lat/lng on `user_data` and `social.group`.

### `public.messages`
**No comment.** **PK:** `id uuid default gen_random_uuid()` *(distinct from every other table — UUID PK).*
**Columns:** `id uuid`; `recipient text`; `sender text`; `cc text`; `bcc text`; `subject text`; `text_body text`; `html_body text`; `created timestamptz default CURRENT_TIMESTAMP` *(note column name is `created`, not `created_at`)*; `status text`; `deliveryresult jsonb`; `deliverysignature jsonb`; `log jsonb`.
**RLS:** explicit-deny policies for INSERT/UPDATE/DELETE/SELECT layered on top of the `default` permit-all — see [§ RLS posture #6](#rls-posture). The deny policies are dead because of how Postgres OR's permissive policies.
**Notes:** **Outbound transactional email queue** — distinct from `social.message` (group chat). Confusing name; the rebuild should pick a clearer one (e.g., `email_outbox`).

### `public.organisation`
**Comment:** *organisation that has multiple MHS users.* (MHS = "My Healthy Self" — old product name, possibly.)
**PK:** `id`. **Columns:** `id`; `created_at`; `name text NOT NULL`; `code text NOT NULL`; `url text`; `active bool NOT NULL default true`; `type organisation_type NOT NULL default 'corporate'` *(enum: `affiliate`, `corporate`)*.
**Referenced by:** `organisation_user.organisation`, `pending_signups.organisation`, `user_data.organisation`, `user_new_corp.organisation`.
**Notes:** B2B / affiliate accounts. A `corporate` org has multiple users licensed under it; an `affiliate` org refers users in for revenue share.

### `public.organisation_user` *(junction)*
PK `id`. Columns: `id`; `created_at`; `organisation bigint`; `user bigint`; `role role` *(enum: `owner`, `admin`, `user`, `viewer`)*. **FKs:** `organisation → organisation.id`; `user → user_data.id`.

### `public.pending_signups`
**Comment:** *New users allocated by external subscription or corporate.* PK `id`. Columns: `id`; `created_at`; `user_data bigint`; `email text`; `source text`; `plan_name plans` *(enum)*; `plan_duration smallint`; `signed_up bool default false`; `first_name text`; `last_name text`; `organisation bigint`; `referrer bigint`. **FKs:** `referrer → user_data.id`; `organisation → organisation.id`; `user_data → user_data.id`. **Notes:** Pre-allocated invitations — a corporate admin or an affiliate referrer adds emails here; rows flip `signed_up = true` once the user actually signs up.

### `public.plan`
**Comment:** *User plan.*
**PK:** `id`.
**Columns:** `id`; `created_at`; `user_data bigint NOT NULL`; `complete bool NOT NULL default false`; `start_date date NOT NULL`; `end_date date`; `reasons text[]`; `barriers text[]` *(both denormalised arrays of `reason` / `barrier` strings — not FKs)*;
*Cardio targets:* `cardio_curr_mins smallint`; `cardio_curr_sess smallint`; `cardio_plan_mins smallint`; `cardio_plan_sess smallint`; `cardio_week_mins smallint`; `cardio_week_sess smallint`; `cardio_pref text[]`;
*Strength targets:* `strength_curr_sess smallint`; `strength_curr_mins smallint`; `strength_plan_sess smallint`; `strength_plan_mins smallint`; `strength_week_mins smallint`; `strength_week_sess smallint`; `strength_pref text[]`.
**FKs:** `user_data → user_data.id`.
**Referenced by:** `day.plan`, `plan_day.plan`, `user_data.current_plan`.
**Notes:** A plan is a user's exercise programme (start_date through end_date). `current_plan` on `user_data` is a denormalised pointer to the active one. The `*_curr_*` vs `*_plan_*` columns track current week's progress against the planned weekly target.

### `public.plan_day`
**Comment:** *Individual day plans for a plan.*
**PK:** `id`. **Columns:** `id`; `created_at`; `plan bigint`; `day_name text`; `day_number smallint`; `total_sessions smallint`; `cardio_sessions smallint`; `strength_sessions smallint`; `total_minutes smallint`; `cardio_minutes smallint`; `strength_minutes smallint`; `summary text`; `update_trigger bool default false`. **FKs:** `plan → plan.id`. **Referenced by:** `plan_day_activity.plan_day`.
**Trigger:** `updatePlanDay` AFTER UPDATE → HTTP fanout to Make.com.
**Notes:** Template for a recurring weekly day (e.g., "Monday", "Tuesday"). Per-day-of-week, not per-calendar-day.

### `public.plan_day_activity`
**Comment:** *Planned activity for a plan_day.* PK `id`. Columns: `id`; `created_at`; `plan_day bigint`; `activity_text text`; `cardio bool`; `strength bool`; `quantity smallint`; `units text`; `summary text`; `done bool default false`; `time_of_day text`; `time_of_day_order smallint`; `plan bigint`; `activity bigint`. **FKs:** `activity → activity.id`; `plan_day → plan_day.id`. **Notes:** Templates that get copied into `day_plan_activity` per actual `day`.

### `public.reason`
**Comment:** *Reasons to exercise.* PK `id`. Columns: `id`; `created_at`; `reason text`; `order smallint`. **Notes:** Onboarding reference data (cf. `barrier`).

### `public.referrals`
**Comment:** *New customer referrals.* PK `id`. Columns: `id`; `created_at`; `referred_by bigint`; `name text`; `email text`; `note text`; `sent bool default false`. **FKs:** `referred_by → user_data.id`. **Notes:** Friend-referral capture.

### `public.revenuecat`
**No comment.** PK `id`. Columns: `id`; `created_at`; `webhook jsonb`; `type text`; `app_user_id text`; `expiry timestamptz`; `presented_offering_id text`. **Triggers:** `revenuecat_c_b` BEFORE INSERT, `revenuecat_c_a` AFTER INSERT (functions named `revenucat_c_b` (sic) and `revenuecat_c_a`). **Notes:** RevenueCat webhook landing pad. New stack: same pattern, but the webhook lands in a Convex HTTP action.

### `public.skip_reason`
**Comment:** *Reasons users skip their planned activity.* PK `id`. Columns: `id`; `created_at`; `order smallint`; `reason text`. **Notes:** Reference list shown when a user marks a day skipped.

### `public.stats_prev_week`
**Comment:** *Weekly stats for a user.* PK `id`. Columns: `id`; `created_at`; `user_data bigint`; `start_date date`; `end_date date`; `a_tot_mins smallint`; `a_tot_sess smallint`; `a_car_mins smallint`; `a_car_sess smallint`; `a_str_mins smallint`; `a_str_sess smallint`. **FKs:** `user_data → user_data.id`. **Notes:** Snapshot of prior-week totals (presumably written by a cron). Used for week-over-week comparisons in the dashboard.

### `public.subscription_events`
PK `id`. Columns: `id`; `created_at`; `user_data bigint`; `event text`. **FKs:** `user_data → user_data.id`. **Notes:** Lightweight event log of subscription lifecycle (`upgraded`, `cancelled`, etc.); RevenueCat is the source.

### `public.test`
**Comment:** *Test Table.* PK `id`. Columns: `id`; `created_at`; `number smallint NOT NULL`; `text text NOT NULL`; `date timestamptz`; `category smallint NOT NULL`. **Notes:** **Dev throwaway. Drop.**

### `public.time_zone`
**No comment.** PK `id`. Columns: `GMT_offset text`; `GMT_offset_num double`; `GMT_offset_seconds bigint`; `zone_names text`; `id`; `search_text text`. **Notes:** Reference data, mixed-case column names. Almost certainly drop-and-replace with library logic in the rebuild (Dart's `timezone` package).

### `public.time_zone_full`
**Comment:** *Time Zones from TimeZoneDB.* PK `id`. Columns: `id`; `created_at`; `zone_name varchar`; `country_code varchar`; `abbreviation varchar`; `time_start bigint`; `gmt_offset bigint`; `dst bigint`. **Notes:** Same — reference data.

### `public.timezone_name`
**Comment:** *List of IANA timezone names.* PK `id`. Columns: `id`; `created_at`; `name text`. **Notes:** Same.

### `public.tip`
**Comment:** *Short tips to be used in messages.* PK `id`. Columns: `id`; `created_at` (no TZ); `tip text`; `tagsjson jsonb`; `tags text[]`. **Notes:** Content tips shown in notifications. Tags are denormalised both as `text[]` and `jsonb` — pick one in the rebuild.

### `public.tip_tag`
**Comment:** *Tags for tips.* PK `id`. Columns: `id`; `created_at` (no TZ); `tag text`. **Notes:** No FK link to `tip` — tags are denormalised on the `tip` row, this table is just the master list.

### `public.user_comm`
**Comment:** *A single notification for one user.*
**PK:** `id`.
**Columns:** `id`; `created_at`; `user_data bigint`; `channel text` *(`email`, `push`, `sms`, etc. — no enum)*; `scheduled timestamptz`; `sent timestamptz`; `delivered timestamptz`; `result_code text`; `title text`; `body text`; `link text`; `image_url text`; `template text`; `user_auth_id text`; `processed bool default false`.
**Trigger:** `user_comm_c_b` BEFORE INSERT.
**Notes:** No FK on `user_data` despite the name (declared as plain bigint). The `user_comm_monitor` view exposes this with a friendly status. 317 rows in the dump. **The Convex rebuild has multiple options for this** — Convex's scheduler is the natural replacement; OneSignal handles push fan-out itself; Postmark handles email delivery state. Most of this table's purpose dissolves into infrastructure features.

### `public.user_data`
**Comment:** *User information.* **The user table.**
**PK:** `id`. **Single row in this dump.**
**Columns (grouped):**
- *Identity:* `id`; `created_at`; `auth_id uuid NOT NULL` *(FK to `auth.users.id` — the Supabase Auth bridge)*; `email text NOT NULL`; `display_name text`; `last_name text`; `mobile text`; `gender text`; `date_of_birth date`; `bio text`; `photo_url text`.
- *Geo:* `time_zone_offset int default 0`; `time_zone text`; `latitude double`; `longitude double`; `country_code text`; `city text`; `default_location bool NOT NULL default true`.
- *Permissions / role:* `admin bool NOT NULL default false`; `tester bool NOT NULL default false`; `org_admin bool NOT NULL default false`; `app_access bool NOT NULL default true`; `app_user bool NOT NULL default false`.
- *Lifecycle:* `active bool NOT NULL default true`; `deleted bool NOT NULL default false`; `onboarding bool NOT NULL default true`.
- *Subscription:* `subscription text`; `subscription_ends timestamptz`; `subscription_status smallint`.
- *Plan pointer:* `current_plan bigint` *(FK to `plan.id`)*.
- *Notification prefs:* `daily_reminder bool NOT NULL default true`; `data_reminder bool NOT NULL default true`; `tips bool NOT NULL default true`; `statistics bool NOT NULL default true`; `system_messages bool NOT NULL default true`; `news bool NOT NULL default true`.
- *Org membership:* `organisation bigint` *(FK)*.
- *Dashboard:* `unread_messages bool NOT NULL default false`; `crm_contact_id text`; `active_last_7 smallint`; `active_last_28 smallint`; `appearance appearance NOT NULL default 'system'`.
**FKs:** `auth_id → auth.users.id`; `organisation → organisation.id`; `current_plan → plan.id`.
**Triggers:** `user_data_cu_b` BEFORE INSERT, `user_data_cu_a` AFTER INSERT, plus three HTTP webhooks (`newUserData` and `newUserZoho` on INSERT, `updateUserData` on UPDATE).
**Referenced by (incoming FKs):** `activity_alias.user_data`, `activity_favorite.user_data`, `day.user_data`, `day_stats.user_data`, `pending_signups.user_data`, `pending_signups.referrer`, `organisation_user.user`, `plan.user_data`, `referrals.referred_by`, `stats_prev_week.user_data`, `subscription_events.user_data`, `user_interest.user_data`, `social.avatar.user`, `social.user.app_user`.
**Notes:** This is the table everything hangs off. **In the Convex+Clerk rebuild**, the `auth_id uuid → auth.users.id` bridge becomes a `clerkUserId: string` field with an index, populated by a Clerk webhook. Most other fields port over more or less unchanged.

### `public.user_interest` *(junction)*
**Comment:** *Interests for a given user.* PK `id`. Columns: `id`; `created_at`; `user_data bigint`; `interest bigint`. **FKs:** `user_data → user_data.id`; `interest → interest.id`. **RLS:** real per-user policies (see [§ RLS posture #2](#rls-posture)) — the only table in the entire schema with genuine row-level enforcement.

### `public.user_new_corp`
**No comment.** PK `id`. Columns: `id`; `created_at`; `email text`; `name text`; `organisation bigint`. **FKs:** `organisation → organisation.id`. **Notes:** Pre-signup placeholder for corporate-org-allocated users; partial overlap with `pending_signups`. May be legacy.

### `public.video_urls`
**No comment.** PK `id`. Columns: `id`; `created_at`; `url text`; `title text`; `description text`. **Notes:** Empty. Probably for instructional videos surfaced in onboarding.

### `public.web_form_submission`
**No comment.** PK `id` (identity ALWAYS). Columns: `id`; `form_type text NOT NULL default 'contact'`; `label text`; `form_data jsonb NOT NULL default '{}'`; `created_at`. **17 rows.** **RLS:** anon can INSERT; authenticated can SELECT. **Trigger:** `on_web_form_submission_insert` AFTER INSERT → `notify_web_form_submission()` (sends an admin email). **Notes:** Marketing-site contact form landing pad. Worth preserving the same shape in the rebuild.

### `public.workout_type`
**Comment:** *For integration with Apple/Google.*
**PK:** `id` (not identity).
**Columns:** `id`; `Cardio text`; `Strength text`; `"Workout Type" text`; `"iOS_Name" text`; `"Android_Name" text`; `iOS bool`; `"Android (Google Fit)" bool`; `"Android (Health Connect)" bool`; `Comments text`. **Quoted-identifier column names with spaces and PascalCase.**
**Notes:** Legacy reference table superseded by `activity` (which collapsed `ios_name`, `android_name`, `cardio`, `strength`, `workout_type` columns into one normalised row). The `copy_workout_to_activity` function was the migration. **Drop in the rebuild.**

---

## `social` schema — tables

The `social` schema was added later as a self-contained subdomain. It has its own `user` table that shadows `public.user_data` 1:1, presumably so the social subsystem could be designed and reasoned about without touching the main user record. **In Convex this encapsulation is unnecessary** — there's no equivalent of cross-schema isolation in Convex; you just have one `users` table with social fields on it (or a sub-collection).

### `social.avatar`
**Comment:** *Avatars for users and groups.*
**PK:** `id`.
**Columns:** `id`; `created_at`; `type avatar_type` *(enum `user`, `group`)*; `user bigint`; `group bigint`; `image_path text`; `updated_at timestamptz`; `member_count bigint`.
**FKs:** `user → public.user_data.id`; `group → social.group.id`.
**Notes:** Polymorphic — `type` discriminates whether it points at a user or a group; the corresponding column is set, the other is null. Cross-schema FK to `public.user_data` (the only such FK from `social`). The `member_count` column is denormalised onto the avatar (presumably to drive a "n members" badge) and is mostly meaningful when `type = 'group'`.

### `social.block`
**Comment:** *One user blocks another.* PK `id`. Columns: `id`; `created_at`; `blocker bigint`; `blocked bigint`. **FKs:** both `→ social.user.id`.

### `social.challenge`
**Comment:** *A time-based chalenge for a group* (sic — typo preserved from prod). PK `id`. Columns: `id`; `created_at`; `group bigint`; `start_date date`; `end_date date`; `name text`; `description text`. **FKs:** `group → social.group.id`. **Referenced by:** `challenge_entry.challenge`.

### `social.challenge_entry`
**Comment:** *An entry for a user on a group challenge.* PK `id`. Columns: `id`; `created_at`; `challenge bigint`; `points int`; `note text`; `date date`; `member bigint`. **FKs:** `challenge → challenge.id`; `member → member.id` *(joins via membership, not user — so a user-not-in-the-group can't enter)*.

### `social.connection_request`
**Comment:** *When a user wants to connect with another user.* PK `id`. Columns: `id`; `created_at`; `requester bigint`; `requested bigint`; `responded timestamptz`; `status connection_status_type` *(`Pending`, `Accepted`, `Rejected`)*. **FKs:** `requester`, `requested → social.user.id`. **Notes:** Friend-request style. Once Accepted, the actual connection is presumably materialised as a private 2-member group (per the `user_connections` view convention).

### `social.event`
**Comment:** *An event for a group.* PK `id`. Columns: `id`; `created_at`; `group bigint`; `name text`; `description text`; `date date`. **FKs:** `group → social.group.id`. **Referenced by:** `event_attendee` (via the very unusual FK described next).

### `social.event_attendee`
**Comment:** *An attendee for an event.* PK `id`. Columns: `id`; `created_at`; `user bigint`; `attend_option event_option_type` *(`Yes`, `No`, `Maybe`, `Cancelled`, `No show`)*. **FKs:** `id → social.event.id` (yes — the **PK column itself** is also a FK back to event); `user → social.user.id`.
**⚠️ Schema bug.** Because `event_attendee.id` is both PK and FK to `event.id`, you can have **at most one attendee row per event** — the PK uniqueness constraint forbids more. This is almost certainly wrong; the FK should be on a separate `event` column, not on `id`. Don't replicate this in the rebuild — model `event_attendee` as a junction with `(event, user)` composite uniqueness.

### `social.group`
**Comment:** *Group of users.*
**PK:** `id`.
**Columns:** `id`; `created_at`; `group_name text`; `private bool default true`; `findable bool default true`; `description text`; `latitude double`; `longitude double`; `last_update timestamptz`; `last_message bigint`; `user_count bigint`; `point geography`; `owner bigint`; `status group_status_type` *(`Active`, `Suspended`, `Archived`)*; `image text`.
**FKs:** `last_message → social.message.id` *(denormalised pointer to the most recent chat message)*; `owner → social.user.id`.
**Referenced by:** `challenge.group`, `event.group`, `member.group`, `message.group`, `avatar.group`.
**Notes:** A *private* 2-member group is how the old system encodes a 1:1 DM (see `social.user_connections` view). `last_message` and `user_count` are denormalised columns the chat list view relies on; in Convex you'd either maintain the same denormalisation or compute it on read.

### `social.member` *(junction)*
**Comment:** *A user who is a member of a group.* PK `id`. Columns: `id`; `created_at`; `group bigint`; `user bigint`; `admin bool`; `status member_status_type` *(`Pending`, `Active`, `Rejected`, `Left`, `Suspended`, `Blocked`, `Removed`)*. **FKs:** `group → social.group.id`; `user → social.user.id`. **Trigger:** `update_group_member_count` AFTER INSERT (calls `social.update_group_member_count()`, which maintains `social.group.user_count`).

### `social.message`
**Comment:** *Group chat message.*
**PK:** `id`.
**Columns:** `id`; `created_at`; `sent timestamptz`; `blocked bool`; `sensitive bool`; `message text`; `unsent bool`; `edited bool`; `group bigint`; `from bigint`; `reply_to_msg bigint`; `edited_at timestamptz`; `deleted_at timestamptz`.
**FKs:** `group → social.group.id`; `from → social.user.id`; `reply_to_msg → social.message.id` *(self-referential — threaded reply support)*.
**Referenced by:** `message_attachment.message`, `message_reaction.message`, `message_read.message`, `moderation.message`, `social.group.last_message`.
**Notes:** Single chat message. `blocked` / `sensitive` are moderation flags; `unsent` / `deleted_at` / `edited_at` are the soft-delete and edit-history flags.

### `social.message_attachment`
**Comment:** *Photos/Videos/Audio/Files attached to messages.* PK `id`. Columns: `id`; `created_at`; `message bigint`; `sensitive bool default false`; `url text`; `type message_file_type` *(`Photo`, `Video`, `Audio`, `File`)*; `blurhash text`. **FKs:** `message → social.message.id`. **Notes:** A message can have multiple attachments. The `url` points at Supabase Storage in the old system; the Convex rebuild puts these in Cloudflare R2.

### `social.message_reaction`
**Comment:** *Emojis for group message.* PK `id`. Columns: `id`; `created_at`; `message bigint`; `like_emoji text`; `user bigint`. **FKs:** `message → social.message.id`; `user → social.user.id`.

### `social.message_read`
**Comment:** *Records when a message has been read by a user.* PK `id`. Columns: `id`; `created_at`; `message bigint`; `read_at timestamptz`; `user bigint`. **FKs:** `message → social.message.id`; `user → social.user.id`. **Notes:** Read-receipt table. With a chat of N users and M messages, this scales as N×M — be careful in the rebuild.

### `social.moderation`
**Comment:** *A user and/or message that needs moderating.* PK `id`. Columns: `id`; `created_at`; `user bigint`; `message bigint`; `reported_by bigint`; `system_generated bool default false`; `report text`; `response text`; `moderator bigint`; `status moderation_status_type` *(`Submitted`, `In Review`, `Accepted`, `Flagged`, `Violation`)*. **FKs:** `user`, `reported_by`, `moderator → social.user.id`; `message → social.message.id`. **Notes:** Combined report-and-action table. `system_generated = true` means an automated content filter raised it; otherwise `reported_by` is the user who flagged it.

### `social.user`
**Comment:** *User for social features. Maps to app user. For encapsulation.*
**PK:** `id`. **Single row in this dump (mirrors the single `public.user_data` row).**
**Columns:** `id`; `created_at`; `display_name text`; `banned bool default false`; `app_user bigint`. **FKs:** `app_user → public.user_data.id`.
**Referenced by:** `social.event_attendee.user`, `social.group.owner`, `social.member.user`, `social.message.from`, `social.message_reaction.user`, `social.message_read.user`, `social.connection_request.requester`, `social.connection_request.requested`, `social.moderation.user`, `social.moderation.reported_by`, `social.moderation.moderator`, `social.block.blocker`, `social.block.blocked`.
**Notes:** **Collapse this into the main user document in the Convex rebuild** — the encapsulation rationale (separate Postgres schema) doesn't apply.

---

## Known oddities and likely-dead tables

Captured here so the rebuild doesn't accidentally faithfully reproduce mistakes:

1. **`social.event_attendee.id` is both PK and FK to `social.event.id`.** This restricts to one attendee row per event — almost certainly a schema bug (see [§ social.event_attendee](#socialevent_attendee)).
2. **`public.messages` has dead deny-policies** layered on top of a permit-all policy. The denies are unreachable (permissive policies OR together). See [§ RLS posture #6](#rls-posture).
3. **`public.activity_type_changed`** is a one-shot migration snapshot. **Drop.**
4. **`public.content_revised`** is a migration scratch table — `tags text[]` reshaped to `jsonb`. **Drop.**
5. **`public.workout_type`** has been superseded by `public.activity` (via `copy_workout_to_activity()`). Quoted PascalCase column names with spaces. **Drop.**
6. **`public.activity_type`** is the older, looser version of `activity`. **Likely drop**; verify nothing in production-only data references it.
7. **`public.coa_*`** (Compendium of Physical Activities + heading + class) is reference data the app doesn't appear to use. **Decide:** drop, or retain as a seed dataset for future MET-based calorie estimation.
8. **`public.test`** is a dev throwaway. **Drop.**
9. **`public.dbg_log`** has 27,389 rows of debug output. **Drop** (Convex has its own observability).
10. **`public.cron_job`** is an audit of `pg_cron` runs — not portable. **Drop.**
11. **`public.time_zone`, `public.time_zone_full`, `public.timezone_name`, `public.country_code`, `public.city`** are reference datasets (GeoNames + TimeZoneDB) — replace with library-driven logic in Dart (`timezone` package, `country_codes` etc.) rather than denormalising into Convex.
12. **`public.location`** is an orphan table with no FKs in or out. **Drop unless you find a use case.**
13. **`public.tip` + `public.tip_tag`** — tags are denormalised both as `text[]` and `jsonb` on `tip` (`tags` and `tagsjson`). Pick one in the rebuild.
14. **Trigger function name `revenucat_c_b`** (sic — missing 'e') is the BEFORE-INSERT function on `revenuecat`. The AFTER-INSERT function is correctly spelled `revenuecat_c_a`. Don't propagate the typo.
15. **HTTP-fanout triggers** (Make.com, Zoho) on `day`, `plan_day`, `user_data` are tightly coupled to external automation that may or may not still exist. Audit the destination URLs / Make scenarios before assuming any of them are still live.
16. **`public.user_comm.user_data`** is declared `bigint` with no FK constraint, despite the name strongly implying one. Same for `user_auth_id`. Soft references like this should become real Convex `v.id("users")` references in the rebuild.
17. **Two `created_at` conventions coexist:** most tables use `timestamptz default now()`, but `content`, `content_tag`, `tip`, `tip_tag` use `timestamp without time zone default now()`. `messages` uses `created` (no underscore, no `_at`). Convex normalises this — use `_creationTime` (built-in) or explicit `createdAt` consistently.
18. **Junction-table naming** is inconsistent: `blog_post_category` and `blog_post_tag` use composite-PK (correct), but `user_interest`, `organisation_user`, `activity_alias`, `activity_favorite` use surrogate `id` PKs even though they're conceptually junction tables. Both styles work in Convex; pick one.

---

## Notes for the Convex rebuild

This section is opinionated guidance, not a schema. The actual Convex `schema.ts` should be derived through a separate design pass — these are the things to think about first.

1. **Auth bridge.** `public.user_data.auth_id (uuid) → auth.users.id` is the single piece of Supabase that touches the app schema. In Convex+Clerk it becomes `users.clerkUserId: v.string()` with `.index("by_clerk_id", ["clerkUserId"])`. Populate via Clerk webhook on `user.created`. Everything else cascades from this.
2. **Collapse `social.user` into `users`.** The Postgres-schema isolation rationale doesn't translate — one user document, with social-relevant fields on it (`displayName`, `banned`, etc.), is correct.
3. **DMs as private 2-member groups vs first-class entity.** The old system uses the former (see `social.user_connections` view). The Convex rebuild should *consciously decide* — first-class DMs simplify queries (`messagesByDm` is a single index lookup) at the cost of a slightly more complex group/dm union type in the chat list. Either way, document the decision.
4. **The `*_package` SQL functions.** `get_day_package`, `get_plan_package`, `read_plan_package`, `save_plan_package` define the JSON shapes the old Flutter UI consumes. Read them before designing the equivalent Convex `query` / `mutation` shapes — they're the closest thing to a contract for what the app actually needs.
5. **HTTP-fanout triggers → Convex actions/scheduler.** Make.com / Zoho integrations on `day`, `plan_day`, `user_data` should be reimplemented as explicit `ctx.scheduler.runAfter(0, internal.webhooks.foo, {...})` calls inside the relevant mutation. Failure handling becomes a first-class concern instead of fire-and-forget.
6. **`pg_cron` jobs → `convex/crons.ts`.** `comms_send_cron`, `cron_run_vacuum`, `day_c_cron` and friends become entries in Convex's cron config. Drop the `cron_job` audit table — Convex shows scheduled-run history natively.
7. **Notifications.** `user_comm` + the dispatch functions (`notification_email`, `notification_push`, `notification_sms`, `mail_send_email`, `send_email_*`) collapse into:
   - **Postmark** for email, called from a Convex action.
   - **OneSignal** for push, called from a Convex action.
   - **No SMS in the new stack** (unless explicitly added).
   You probably don't need the `user_comm` table at all in the rebuild — Postmark/OneSignal hold delivery state. If you want an audit trail, keep a small `notifications_sent` table.
8. **PostGIS → manual lat/lng.** Convex has no native geo type. Store `{lat: v.number(), lng: v.number()}` and either bounding-box-filter in queries or push proper geo search to an external service if/when it becomes a feature.
9. **Aggregate columns on `day` and `social.group`.** The denormalised rollup columns (`p_total_minutes`, `a_total_minutes`, `user_count`, `last_message`, etc.) are write-heavy in Postgres because triggers maintain them. In Convex you have a choice: maintain them in mutation code (faster reads, more code), or compute on read (slower reads if the chat is huge, simpler code). For the chat preview list specifically, denormalising `lastMessage` is almost always the right call.
10. **i18n via `canonical_id` + `language_code`.** The blog tables already use this pattern; if i18n is a v2 goal across the whole app (it is — see `01-architecture-patterns.md`), consider adopting the same pattern uniformly in the Convex schema for content tables.
11. **Don't carry over the trigger-typo, the dead RLS policies, the `event_attendee` PK-as-FK bug, or the columns-with-spaces-in-names from `workout_type`.** This is your chance.
12. **Drop list (proposed):** `public.activity_type`, `activity_type_changed`, `coa_activity`, `coa_class`, `coa_heading`, `content_revised`, `cron_job`, `dbg_log`, `image` (orphan), `location` (orphan), `messages` (replaced by Postmark state), `test`, `time_zone`, `time_zone_full`, `timezone_name`, `country_code`, `city`, `user_new_corp` (overlaps `pending_signups`), `workout_type`. Confirm each one before deleting in any actual data-migration pass.

---

## Methodology — how this dump was produced

All commands were run via the `supabase-twikka` MCP server against the live old DB on **2026-04-18**. To regenerate this document:

1. **Tables (verbose, both schemas):**
   ```
   mcp__supabase-twikka__list_tables(schemas=["public","social"], verbose=true)
   ```
   This returns table comments, columns (name, type, nullability, default, identity, enum values, check constraints), primary keys, foreign-key constraints (source/target — but **not** ON DELETE / ON UPDATE actions), `rls_enabled`, and row counts. **Limitations:** it does *not* return indexes, RLS policy bodies, or unique constraints. The dump for this run was 90,542 characters and is preserved at `…/tool-results/mcp-supabase-twikka-list_tables-1776489195300.txt`.

2. **Custom enums:**
   ```sql
   SELECT n.nspname AS schema, t.typname AS name,
          array_agg(e.enumlabel ORDER BY e.enumsortorder) AS values
     FROM pg_type t
     JOIN pg_enum e ON t.oid = e.enumtypid
     JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname IN ('public','social')
    GROUP BY n.nspname, t.typname
    ORDER BY n.nspname, t.typname;
   ```

3. **Views and materialized views:**
   ```sql
   SELECT n.nspname AS schema, c.relname AS name,
          CASE c.relkind WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized_view' END AS kind,
          pg_get_viewdef(c.oid, true) AS definition
     FROM pg_class c
     JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind IN ('v','m') AND n.nspname IN ('public','social')
    ORDER BY n.nspname, c.relname;
   ```

4. **Stored functions:**
   ```sql
   SELECT n.nspname AS schema, p.proname AS name,
          pg_get_function_identity_arguments(p.oid) AS args,
          t.typname AS return_type, l.lanname AS language,
          p.prosecdef AS security_definer,
          obj_description(p.oid, 'pg_proc') AS comment
     FROM pg_proc p
     JOIN pg_namespace n ON n.oid = p.pronamespace
     JOIN pg_type t ON t.oid = p.prorettype
     JOIN pg_language l ON l.oid = p.prolang
    WHERE n.nspname IN ('public','social') AND l.lanname IN ('plpgsql','sql')
    ORDER BY n.nspname, p.proname;
   ```

5. **Triggers** *(the obvious `information_schema.triggers` query returns empty under the MCP service-role for some reason — go through `pg_trigger` directly)*:
   ```sql
   SELECT n.nspname AS schema, c.relname AS table_name, t.tgname AS trigger_name,
          p.proname AS function_name,
          CASE t.tgtype::int & 2 WHEN 2 THEN 'BEFORE' ELSE 'AFTER' END AS timing,
          CASE WHEN t.tgtype::int & 4  = 4  THEN 'INSERT'
               WHEN t.tgtype::int & 8  = 8  THEN 'DELETE'
               WHEN t.tgtype::int & 16 = 16 THEN 'UPDATE'
               WHEN t.tgtype::int & 32 = 32 THEN 'TRUNCATE'
               ELSE 'OTHER' END AS event
     FROM pg_trigger t
     JOIN pg_class c ON c.oid = t.tgrelid
     JOIN pg_namespace n ON n.oid = c.relnamespace
     JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE NOT t.tgisinternal AND n.nspname IN ('public','social')
    ORDER BY n.nspname, c.relname, t.tgname;
   ```

6. **RLS policies:**
   ```sql
   SELECT schemaname AS schema, tablename AS table, policyname AS policy,
          permissive, roles, cmd, qual, with_check
     FROM pg_policies
    WHERE schemaname IN ('public','social')
    ORDER BY schemaname, tablename, policyname;
   ```

7. **Extensions:**
   ```
   mcp__supabase-twikka__list_extensions()
   ```
   Filter to `installed_version IS NOT NULL` to see only the actually-installed ones.

**Open follow-ups not captured in this document** (run separately if needed for migration):
- **ON DELETE / ON UPDATE actions** on FK constraints — query `information_schema.referential_constraints` joined to `information_schema.key_column_usage`.
- **Indexes** — query `pg_indexes` filtered to the two schemas.
- **Unique constraints** beyond composite PKs — query `pg_constraint` with `contype = 'u'`.
- **`pg_cron` schedule definitions** — query `cron.job` (extension-managed table).
- **Function bodies** — query `pg_get_functiondef(p.oid)` for any function you actually need to port.
