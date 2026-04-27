#!/usr/bin/env bash
#
# Deploy to both iOS (TestFlight) and Android (Google Play).
# Usage: ./ci-cd/scripts/deploy-all.sh
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting deployment to all platforms..."
echo

# Bump the build number ONCE so both platforms ship the same +N.
echo "📦 Bumping build number..."
"$SCRIPT_DIR/helpers/version-bump.sh"
source /tmp/twikka_build.env
echo "   Build: ${VERSION_NAME} (${BUILD_NUMBER})"
echo

IOS_SUCCESS=false
ANDROID_SUCCESS=false

export SKIP_VERSION_BUMP=true

echo "═══════════════════════════════════════"
echo "  iOS DEPLOYMENT"
echo "═══════════════════════════════════════"
if "$SCRIPT_DIR/deploy-ios.sh"; then
    IOS_SUCCESS=true
else
    echo "⚠️  iOS deployment failed, continuing with Android..."
fi

echo
echo "═══════════════════════════════════════"
echo "  ANDROID DEPLOYMENT"
echo "═══════════════════════════════════════"
if "$SCRIPT_DIR/deploy-android.sh"; then
    ANDROID_SUCCESS=true
else
    echo "⚠️  Android deployment failed"
fi

echo
echo "═══════════════════════════════════════"
echo "  DEPLOYMENT SUMMARY"
echo "═══════════════════════════════════════"

if $IOS_SUCCESS; then
    echo "✅ iOS: Success"
else
    echo "❌ iOS: Failed"
fi

if $ANDROID_SUCCESS; then
    echo "✅ Android: Success"
else
    echo "❌ Android: Failed"
fi

echo

if $IOS_SUCCESS || $ANDROID_SUCCESS; then
    echo "📝 Stamping pubspec.yaml with final build number..."
    "$SCRIPT_DIR/helpers/update-pubspec-build.sh"
fi

if $IOS_SUCCESS && $ANDROID_SUCCESS; then
    echo "🎉 All platforms deployed successfully!"
    exit 0
else
    echo "⚠️  Some platforms failed to deploy"
    exit 1
fi
