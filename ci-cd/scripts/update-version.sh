#!/usr/bin/env bash
#
# Marketing version (X.Y.Z) management for Twikka.
# Usage:
#   ./ci-cd/scripts/update-version.sh 1.2.0    # Update version
#   ./ci-cd/scripts/update-version.sh --check  # Show current version info
#
# pubspec.yaml is the single source of truth for both X.Y.Z and +N. This
# script only edits the marketing version and preserves the current build
# number; the build number is auto-incremented by version-bump.sh on every
# deploy.
#

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../" && pwd)"
PUBSPEC_FILE="$PROJECT_ROOT/pubspec.yaml"

show_current_version() {
    if [ ! -f "$PUBSPEC_FILE" ]; then
        echo "❌ pubspec.yaml not found at $PUBSPEC_FILE"
        exit 1
    fi
    local version_line=$(grep "^version:" "$PUBSPEC_FILE")
    local version_name=$(echo "$version_line" | sed 's/version: //; s/+.*//')
    local build_number=$(echo "$version_line" | sed 's/.*+//')
    local next_build=$((build_number + 1))

    echo "📱 Twikka version info:"
    echo "   Version: $version_name"
    echo "   Current Build: $build_number"
    echo "   Next Build: $next_build"
    echo
    echo "Files:"
    echo "   pubspec.yaml: $version_name+$build_number"
}

if [ $# -eq 1 ] && [ "$1" = "--check" ]; then
    show_current_version
    exit 0
fi

if [ $# -ne 1 ]; then
    echo "Usage: $0 <version|--check>"
    echo "Examples:"
    echo "  $0 1.2.0     # Update to version 1.2.0"
    echo "  $0 --check   # Show current version info"
    exit 1
fi

NEW_VERSION="$1"

if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "❌ Invalid version format. Use semantic versioning (e.g., 1.2.0)"
    exit 1
fi

echo "🔄 Updating version to $NEW_VERSION..."

if [ ! -f "$PUBSPEC_FILE" ]; then
    echo "❌ pubspec.yaml not found at $PUBSPEC_FILE"
    exit 1
fi

CURRENT_BUILD=$(grep "^version:" "$PUBSPEC_FILE" | sed 's/.*+//')
sed -i '' "s/^version:.*/version: $NEW_VERSION+$CURRENT_BUILD/" "$PUBSPEC_FILE"
echo "✅ Updated $PUBSPEC_FILE: $NEW_VERSION+$CURRENT_BUILD"

echo
echo "🎉 Version updated."
echo "   Version: $NEW_VERSION"
echo "   Build: $CURRENT_BUILD (will auto-increment on next deployment)"
echo
echo "Next steps:"
echo "  1. Review changes: git diff pubspec.yaml"
echo "  2. Deploy: ./ci-cd/scripts/deploy-all.sh"
