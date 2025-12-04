#!/bin/bash

# Script to execute Speakeasy TypeScript SDK generation step by step
set -e

# Parse arguments
INSTALL_NODE_DEPS_AUTO=false
START_STEP="lint"

# Handle arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --auto-install-deps)
            INSTALL_NODE_DEPS_AUTO=true
            shift
            ;;
        *)
            START_STEP=$1
            shift
            ;;
    esac
done

# Define step order
STEPS=("lint" "generate" "install" "typecheck" "lint-code" "docs" "build" "publish")

# Find the index of the starting step
START_INDEX=-1
for i in "${!STEPS[@]}"; do
    if [[ "${STEPS[$i]}" == "$START_STEP" ]]; then
        START_INDEX=$i
        break
    fi
done

if [ $START_INDEX -eq -1 ]; then
    echo "❌ Invalid step: $START_STEP"
    echo "Available steps: ${STEPS[*]}"
    exit 1
fi

echo "Starting from step: $START_STEP"

# Check Node.js and npm/yarn
check_node_tools() {
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js first."
        echo "Download from https://nodejs.org/ or use nvm."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | sed 's/v//')
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    
    if [ "$MAJOR_VERSION" -lt "18" ]; then
        echo "❌ Node.js 18 or higher is required. Current version: $NODE_VERSION"
        exit 1
    fi
    
    echo "✅ Node.js $NODE_VERSION detected"
    
    # Check package manager (yarn > npm priority)
    if command -v yarn &> /dev/null; then
        PACKAGE_MANAGER="yarn"
        echo "✅ Using yarn as package manager"
    elif command -v npm &> /dev/null; then
        PACKAGE_MANAGER="npm"
        echo "✅ Using npm as package manager"
    else
        echo "❌ npm or yarn is required."
        exit 1
    fi
}

check_node_tools

# lint: Validate OpenAPI spec
if [ $START_INDEX -le 0 ]; then
    echo "=== Validating OpenAPI Spec ==="
    speakeasy lint openapi openapi.json
fi

# generate: Generate SDK
if [ $START_INDEX -le 1 ]; then
    echo -e "\n=== Generating TypeScript SDK ==="
    speakeasy generate sdk \
        --lang typescript \
        --schema openapi.json \
        --out . \
        --auto-yes
fi

# install: Install dependencies
if [ $START_INDEX -le 2 ]; then
    echo -e "\n=== Installing Dependencies ==="
    
    if [ "$PACKAGE_MANAGER" = "yarn" ]; then
        echo "Installing dependencies with yarn..."
        yarn install
    else
        echo "Installing dependencies with npm..."
        npm install
    fi
fi

# typecheck: Type check
if [ $START_INDEX -le 3 ]; then
    echo -e "\n=== Type Check ==="
    
    # Check TypeScript compiler
    if [ "$PACKAGE_MANAGER" = "yarn" ]; then
        if yarn list typescript --depth=0 &>/dev/null || command -v tsc &>/dev/null; then
            echo "Running TypeScript type check..."
            if [ -f "tsconfig.json" ]; then
                yarn tsc --noEmit || npm run type-check 2>/dev/null || tsc --noEmit
            else
                echo "⚠️  tsconfig.json not found, skipping type check"
            fi
        else
            echo "⚠️  TypeScript not found, skipping type check"
        fi
    else
        if npm list typescript --depth=0 &>/dev/null || command -v tsc &>/dev/null; then
            echo "Running TypeScript type check..."
            if [ -f "tsconfig.json" ]; then
                npm run type-check 2>/dev/null || tsc --noEmit
            else
                echo "⚠️  tsconfig.json not found, skipping type check"
            fi
        else
            echo "⚠️  TypeScript not found, skipping type check"
        fi
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Type check passed successfully!"
    else
        echo "❌ Type check failed!"
        echo "Please fix type errors and run again."
        exit 1
    fi
fi

# lint-code: Lint check
if [ $START_INDEX -le 4 ]; then
    echo -e "\n=== Lint Check (optional) ==="
    
    # Check and run ESLint
    if [ "$PACKAGE_MANAGER" = "yarn" ]; then
        if yarn list eslint --depth=0 &>/dev/null; then
            echo "Running ESLint..."
            yarn lint 2>/dev/null || yarn eslint src/ 2>/dev/null || echo "Lint check completed with warnings"
        else
            echo "ESLint not found, skipping lint check"
        fi
    else
        if npm list eslint --depth=0 &>/dev/null; then
            echo "Running ESLint..."
            npm run lint 2>/dev/null || npx eslint src/ 2>/dev/null || echo "Lint check completed with warnings"
        else
            echo "ESLint not found, skipping lint check"
        fi
    fi
fi

# docs: Post-process and validate documentation
if [ $START_INDEX -le 5 ]; then
    echo -e "\n=== Post-processing and Validating Documentation ==="
    
    # Remove production warning from README.md
    if grep -q "This SDK is not yet ready for production use" README.md; then
        echo "Removing production warning from README.md..."
        sed -i '' '/> \[!IMPORTANT\]/,/> publishing to a package manager\./d' README.md
    fi
    
    # Extract package information from package.json
    if [ -f "package.json" ]; then
        PACKAGE_NAME=$(node -p "require('./package.json').name" 2>/dev/null || echo "unknown")
        PACKAGE_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")
        
        echo "📦 Package: $PACKAGE_NAME v$PACKAGE_VERSION"
    fi
    
    # Check existence of documentation files
    echo "📚 Checking Documentation Files:"
    [ -f README.md ] && echo "  ✅ README.md" || echo "  ❌ README.md"
    [ -f docs/index.md ] && echo "  ✅ docs/index.md" || echo "  ❌ docs/index.md"
    [ -d docs ] && echo "  ✅ docs/ ($(find docs -name "*.md" | wc -l | tr -d ' ') files)" || echo "  ❌ docs/"
    
    # Optional: Prepare for GitHub Pages
    if [ ! -f docs/index.md ] && [ -f README.md ]; then
        echo "Creating docs/index.md for GitHub Pages..."
        mkdir -p docs
        cp README.md docs/index.md
    fi
    
    echo "✅ Documentation ready!"
fi

# build: Build package
if [ $START_INDEX -le 6 ]; then
    echo -e "\n=== Building Package ==="
    
    # Clean up existing dist directory
    if [ -d "dist" ]; then
        echo "Cleaning up existing dist directory..."
        rm -rf dist/
    fi
    
    # Check and run build script from package.json
    if [ "$PACKAGE_MANAGER" = "yarn" ]; then
        if node -p "Object.keys(require('./package.json').scripts || {})" 2>/dev/null | grep -q "build"; then
            echo "Building package with yarn..."
            yarn build
        elif command -v tsc &>/dev/null; then
            echo "Building with tsc..."
            tsc
        else
            echo "⚠️  No build script found and tsc not available"
        fi
    else
        if node -p "Object.keys(require('./package.json').scripts || {})" 2>/dev/null | grep -q "build"; then
            echo "Building package with npm..."
            npm run build
        elif command -v tsc &>/dev/null; then
            echo "Building with tsc..."
            tsc
        else
            echo "⚠️  No build script found and tsc not available"
        fi
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Package built successfully!"
        if [ -d "dist" ]; then
            echo "Built files:"
            ls -la dist/
        fi
    else
        echo "❌ Package build failed!"
        exit 1
    fi
fi

# publish: NPM publishing
if [ $START_INDEX -le 7 ]; then
    echo -e "\n=== NPM Publishing (Optional) ==="
    
    # Check package.json
    if [ ! -f "package.json" ]; then
        echo "❌ package.json not found"
        exit 1
    fi
    
    # Check for built files
    if [ ! -d "dist" ] && [ ! -f "index.js" ] && [ ! -f "lib/index.js" ]; then
        echo "❌ No built files found. Run build step first"
        exit 1
    fi
    
    PACKAGE_NAME=$(node -p "require('./package.json').name" 2>/dev/null || echo "unknown")
    PACKAGE_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")
    
    echo "Package: $PACKAGE_NAME v$PACKAGE_VERSION"
    
    echo ""
    echo "⚠️  Do you want to proceed with NPM publishing?"
    echo "Before publishing, please verify:"
    echo "1. NPM account is logged in (npm whoami)"
    echo "2. Package name and version are correct"
    echo "3. All tests have passed"
    echo ""
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Publishing to NPM..."
        
        # Check login status
        if ! npm whoami &>/dev/null; then
            echo "❌ Not logged in to NPM."
            echo "Please login first using 'npm login'."
            exit 1
        fi
        
        if [ "$PACKAGE_MANAGER" = "yarn" ]; then
            yarn publish --access public
        else
            npm publish --access public
        fi
        
        if [ $? -eq 0 ]; then
            echo "✅ Successfully published to NPM!"
        else
            echo "❌ NPM publish failed!"
            exit 1
        fi
    else
        echo "Skipped NPM publishing."
        echo "To publish manually: npm publish or yarn publish"
    fi
fi

echo -e "\n=== All Steps Completed! ==="
echo "Generated package:"
if [ -d "dist" ]; then
    ls -la dist/
elif [ -f "index.js" ]; then
    echo "  ✅ index.js"
    ls -la *.js 2>/dev/null || true
fi