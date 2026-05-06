#!/usr/bin/env bash
# Upload the six coach starter avatars to R2, then register them as
# coach_avatar media rows + wire each persona to its row.
#
# Prerequisites:
#   1. wrangler installed and authenticated against the Cloudflare
#      account that owns the `twikka` bucket (`wrangler login`).
#   2. The Convex local code deployed to the target deployment
#      (`npx convex dev --once` or `npm run convex:deploy`).
#   3. Six webp files in $SOURCE_DIR named after the persona slugs:
#        priya.webp fiona.webp margaret.webp ben.webp rob.webp tom.webp
#      (or rename — the script lowercases the filename to match.)
#
# Usage:
#   ./scripts/upload-coach-avatars.sh /path/to/avatars
#
# Re-running is safe: wrangler put overwrites the same key,
# registerAvatarMedia is idempotent on (slug, r2Key).

set -euo pipefail

SOURCE_DIR="${1:-}"
if [[ -z "$SOURCE_DIR" || ! -d "$SOURCE_DIR" ]]; then
  echo "Usage: $0 <dir-with-{slug}.webp>" >&2
  exit 1
fi

BUCKET="twikka"
KEY_PREFIX="coaches/v1"
SLUGS=(priya fiona margaret ben rob tom)

for slug in "${SLUGS[@]}"; do
  # Accept either lowercase or capitalised filenames.
  src=""
  for candidate in "$SOURCE_DIR/${slug}.webp" "$SOURCE_DIR/${slug^}.webp"; do
    if [[ -f "$candidate" ]]; then
      src="$candidate"
      break
    fi
  done
  if [[ -z "$src" ]]; then
    echo "Missing source file for $slug — looked for ${slug}.webp / ${slug^}.webp in $SOURCE_DIR" >&2
    exit 1
  fi

  key="${KEY_PREFIX}/${slug}.webp"
  size=$(wc -c < "$src" | tr -d ' ')

  echo "→ uploading $src to ${BUCKET}/${key} (${size} bytes)"
  wrangler r2 object put "${BUCKET}/${key}" \
    --file="$src" \
    --content-type="image/webp" \
    --remote

  echo "→ registering media row for ${slug}"
  npx convex run coachPersonas:registerAvatarMedia \
    "{\"slug\":\"${slug}\",\"r2Key\":\"${key}\",\"mimeType\":\"image/webp\",\"sizeBytes\":${size}}"
done

echo
echo "Done. Six coach avatars uploaded + registered."
