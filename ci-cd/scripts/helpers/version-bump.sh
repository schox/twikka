#!/usr/bin/env bash
#
# Version bump for Twikka.
#
# - Reads marketing version (X.Y.Z) and build number (N) from pubspec.yaml's
#   `version: X.Y.Z+N` line — pubspec is the single source of truth.
# - Increments ONLY the build number, writes it back, and exports
#   VERSION_NAME / BUILD_NUMBER to /tmp/twikka_build.env for downstream use.
#
# Use update-version.sh to change the marketing version (X.Y.Z); this script
# only ratchets the build number on every deploy.
#

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PUBSPEC_FILE="$PROJECT_ROOT/pubspec.yaml"
BUILD_FILE="$PROJECT_ROOT/ci-cd/build_number.txt"

if [ ! -f "$PUBSPEC_FILE" ]; then
  echo "❌ pubspec.yaml not found at $PUBSPEC_FILE" >&2
  exit 1
fi

VERSION_LINE=$(grep -E "^version:\s*[0-9]+\.[0-9]+\.[0-9]+\+[0-9]+" "$PUBSPEC_FILE" || true)
if [ -z "$VERSION_LINE" ]; then
  echo "❌ Could not find a valid version line in pubspec.yaml (expected 'version: X.Y.Z+N')." >&2
  exit 1
fi

VERSION_NAME=${VERSION_LINE#version: }
VERSION_NAME=${VERSION_NAME%%+*}
CURRENT_BUILD=${VERSION_LINE##*+}

NEXT_BUILD=$((CURRENT_BUILD + 1))

sed -i '' -e "s/^version:.*/version: ${VERSION_NAME}+${NEXT_BUILD}/" "$PUBSPEC_FILE"

mkdir -p "$(dirname "$BUILD_FILE")"
echo "$NEXT_BUILD" > "$BUILD_FILE"

{
  echo "export VERSION_NAME=${VERSION_NAME}"
  echo "export BUILD_NUMBER=${NEXT_BUILD}"
} > /tmp/twikka_build.env

echo "📝 Updated pubspec.yaml: ${VERSION_NAME}+${NEXT_BUILD}"
echo "✅ Build number: ${CURRENT_BUILD} → ${NEXT_BUILD} (version: ${VERSION_NAME})"
