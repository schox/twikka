#!/usr/bin/env bash
#
# Stamp pubspec.yaml with the final BUILD_NUMBER used by the deploy.
# Called by deploy-{ios,android,all}.sh after a successful upload so the
# committed version line reflects the build that actually shipped.
#

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PUBSPEC_FILE="$PROJECT_ROOT/pubspec.yaml"

if [ ! -f "$PUBSPEC_FILE" ]; then
  echo "❌ pubspec.yaml not found at $PUBSPEC_FILE" >&2
  exit 1
fi

if [ ! -f "/tmp/twikka_build.env" ]; then
  echo "❌ Build environment not found at /tmp/twikka_build.env" >&2
  echo "   This script should only be called after version-bump.sh" >&2
  exit 1
fi

source /tmp/twikka_build.env

sed -i '' -e "s/^version:.*/version: ${VERSION_NAME}+${BUILD_NUMBER}/" "$PUBSPEC_FILE"

echo "📝 Updated pubspec.yaml with final build: ${VERSION_NAME}+${BUILD_NUMBER}"
