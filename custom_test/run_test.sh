#!/bin/bash
# Run TypeScript SDK Tests

set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root (parent directory of custom_test)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default test type (all, basic, functions, api)
TEST_TYPE="${1:-all}"

echo "🧪 Running Supertone TypeScript SDK Tests"
echo "=========================================="
echo "📂 Project root: $PROJECT_ROOT"
echo "🎯 Test type: $TEST_TYPE"
echo ""

# Change to project root
cd "$PROJECT_ROOT"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if tsx is installed
if ! npm list tsx &> /dev/null; then
    echo "📦 Installing tsx..."
    npm install --save-dev tsx
fi

echo ""
echo "🚀 Running tests..."
echo ""

# Run tests based on type
case "$TEST_TYPE" in
    basic)
        echo "=== Running Basic SDK Tests ==="
        npx tsx custom_test/test_sdk.ts
        ;;
    functions)
        echo "=== Running Dynamic SDK Discovery Tests ==="
        npx tsx custom_test/test_sdk_functions.ts
        ;;
    api)
        echo "=== Running Real API Integration Tests ==="
        echo "⚠️  WARNING: This makes real API calls and consumes credits!"
        npx tsx custom_test/test_real_api.ts
        ;;
    all)
        echo "=== Running Basic SDK Tests ==="
        npx tsx custom_test/test_sdk.ts
        
        echo ""
        echo "=== Running Dynamic SDK Discovery Tests ==="
        npx tsx custom_test/test_sdk_functions.ts
        
        echo ""
        echo "=== Skipping Real API Tests (use 'api' option to run) ==="
        echo "💡 To run API tests: $0 api"
        ;;
    *)
        echo "❌ Invalid test type: $TEST_TYPE"
        echo "Usage: $0 [all|basic|functions|api]"
        echo "  all       - Run all structure tests (default, no API calls)"
        echo "  basic     - Run basic SDK tests only"
        echo "  functions - Run dynamic discovery tests only"
        echo "  api       - Run real API integration tests (⚠️  consumes credits!)"
        cd - > /dev/null
        exit 1
        ;;
esac

echo ""
echo "✅ All selected tests completed!"

# Return to original directory
cd - > /dev/null

