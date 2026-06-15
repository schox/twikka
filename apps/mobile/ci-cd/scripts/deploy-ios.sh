#!/usr/bin/env bash
#
# Deploy iOS app to TestFlight.
# Usage: ./ci-cd/scripts/deploy-ios.sh
#
# Notes from couple-tools experience:
# - Homebrew fastlane wrapper has previously hung after Ruby upgrades;
#   prefer Bundler-managed fastlane (`bundle exec fastlane`). Recommend
#   rbenv Ruby >= 3.2 with `bundle install` from this repo's Gemfile.
# - FASTLANE_SKIP_UPDATE_CHECK=1 avoids the occasional update-check stall.
#

set -euo pipefail

export FASTLANE_SKIP_UPDATE_CHECK=1
export FASTLANE_DISABLE_COLORS=0
export CI=${CI:-false}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOGS_DIR="$PROJECT_ROOT/ci-cd/logs"

mkdir -p "$LOGS_DIR"
LOG_FILE="$LOGS_DIR/ios_$(date +%Y-%m-%d_%H%M%S).log"

echo "🍎 Starting iOS deployment to TestFlight..."
echo "📝 Logging to: $LOG_FILE"

export PROJECT_ROOT

CREDENTIALS_FILE="$PROJECT_ROOT/ci-cd/secrets/ios-credentials.env"
if [ -f "$CREDENTIALS_FILE" ]; then
    echo "✅ Loading credentials from $CREDENTIALS_FILE"
    source "$CREDENTIALS_FILE"
else
    echo "⚠️  Credentials file not found: $CREDENTIALS_FILE"
    echo "   Copy ios-credentials.env.example and fill in your values."
    exit 1
fi

if [ "${SKIP_VERSION_BUMP:-false}" != "true" ]; then
    echo "📦 Bumping build number..."
    bash "$PROJECT_ROOT/ci-cd/scripts/helpers/version-bump.sh"
fi

if [ -f "/tmp/twikka_build.env" ]; then
    source /tmp/twikka_build.env
    echo "   Build: $VERSION_NAME ($BUILD_NUMBER)"
fi

if [ -f "$PROJECT_ROOT/Gemfile" ] && command -v bundle >/dev/null 2>&1; then
  FASTLANE_CMD="bundle exec fastlane"
else
  FASTLANE_CMD="fastlane"
fi

cd "$PROJECT_ROOT/ci-cd/fastlane"

echo
echo "🚀 Running $FASTLANE_CMD ios beta..."
echo

if eval "$FASTLANE_CMD ios beta" 2>&1 | tee "$LOG_FILE"; then
    echo
    echo "✅ iOS deployment complete!"
    echo "📱 Build $BUILD_NUMBER uploaded to TestFlight"
    echo "🔗 https://appstoreconnect.apple.com"

    if [ "${SKIP_VERSION_BUMP:-false}" != "true" ]; then
        echo "📝 Stamping pubspec.yaml with final build number..."
        "$SCRIPT_DIR/helpers/update-pubspec-build.sh"
    fi

    echo
    exit 0
else
    echo
    echo "❌ iOS deployment failed!"
    echo "📝 Log: $LOG_FILE"
    echo
    exit 1
fi
