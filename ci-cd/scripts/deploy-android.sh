#!/usr/bin/env bash
#
# Deploy Android app to Google Play.
# Usage: ./ci-cd/scripts/deploy-android.sh
# Override the track: ANDROID_TRACK=beta ./ci-cd/scripts/deploy-android.sh
#

set -euo pipefail

export FASTLANE_SKIP_UPDATE_CHECK=1
export FASTLANE_DISABLE_COLORS=0
export CI=${CI:-false}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOGS_DIR="$PROJECT_ROOT/ci-cd/logs"

mkdir -p "$LOGS_DIR"
LOG_FILE="$LOGS_DIR/android_$(date +%Y-%m-%d_%H%M%S).log"

echo "🤖 Starting Android deployment to Google Play..."
echo "📝 Logging to: $LOG_FILE"

export PROJECT_ROOT

CREDENTIALS_FILE="$PROJECT_ROOT/ci-cd/secrets/android-credentials.env"
if [ -f "$CREDENTIALS_FILE" ]; then
    echo "✅ Loading credentials from $CREDENTIALS_FILE"
    source "$CREDENTIALS_FILE"
else
    echo "⚠️  Credentials file not found: $CREDENTIALS_FILE"
    echo "   Copy android-credentials.env.example and fill in your values."
    exit 1
fi

if [ "${SKIP_VERSION_BUMP:-false}" != "true" ]; then
    echo "📦 Bumping build number..."
    bash "$PROJECT_ROOT/ci-cd/scripts/helpers/version-bump.sh"
fi

if [ -f "/tmp/twikka_build.env" ]; then
    source /tmp/twikka_build.env
    echo "   Build: $VERSION_NAME ($BUILD_NUMBER)"
    echo "   Track: ${ANDROID_TRACK:-internal}"
fi

if [ -f "$PROJECT_ROOT/Gemfile" ] && command -v bundle >/dev/null 2>&1; then
  FASTLANE_CMD="bundle exec fastlane"
else
  FASTLANE_CMD="fastlane"
fi

cd "$PROJECT_ROOT/ci-cd/fastlane"

echo
echo "🚀 Running $FASTLANE_CMD android beta..."
echo

if eval "$FASTLANE_CMD android beta" 2>&1 | tee "$LOG_FILE"; then
    echo
    echo "✅ Android deployment complete!"
    echo "📱 Build $BUILD_NUMBER uploaded to ${ANDROID_TRACK:-internal} track"
    echo "🔗 https://play.google.com/console"

    if [ "${SKIP_VERSION_BUMP:-false}" != "true" ]; then
        echo "📝 Stamping pubspec.yaml with final build number..."
        "$SCRIPT_DIR/helpers/update-pubspec-build.sh"
    fi

    echo
    exit 0
else
    echo
    echo "❌ Android deployment failed!"
    echo "📝 Log: $LOG_FILE"
    echo
    exit 1
fi
