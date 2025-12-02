# Supertone TypeScript SDK Tests

This directory contains test scripts for the Supertone TypeScript SDK.

## Files

- **test_sdk.ts** - TypeScript version of SDK basic functionality tests
- **test_sdk_functions.ts** - TypeScript version of dynamic SDK discovery tests
- **test_real_api.ts** - TypeScript version of real API integration tests
- **realtime_tts_player.ts** - Real-time TTS streaming player with audio playback (TypeScript)
- **run_test.sh** - Shell script to run TypeScript tests
- **test_sdk.py** - Python version of SDK tests (reference)
- **test_sdk_functions.py** - Python version of dynamic discovery tests (reference)
- **test_real_async_api.py** - Python version of real API tests (reference, 2951 lines)
- **realtime_tts_player.py** - Real-time TTS player example (Python, reference)

## Quick Start

```bash
# Run all tests with one command (structure tests only, no API calls)
./custom_test/run_test.sh

# Or run specific tests
./custom_test/run_test.sh basic      # Quick structure check
./custom_test/run_test.sh functions  # Deep analysis
./custom_test/run_test.sh api        # Real API integration (⚠️ consumes credits!)

# Demo: Real-time TTS streaming with audio playback (⚠️ consumes credits!)
npm run demo:player
```

## Running Tests

### TypeScript Tests

#### Option 1: Using npm script (recommended)

```bash
# Basic SDK tests
npm run test:sdk

# Dynamic discovery tests
npm run test:functions

# Real API integration tests (⚠️ consumes credits!)
npm run test:api
```

#### Option 2: Using shell script (works from any directory)

```bash
# Run all tests (default)
./custom_test/run_test.sh

# Run only basic tests
./custom_test/run_test.sh basic

# Run only dynamic discovery tests
./custom_test/run_test.sh functions

# Run only real API integration tests (⚠️ consumes credits!)
./custom_test/run_test.sh api

# From custom_test directory
cd custom_test
./run_test.sh [all|basic|functions|api]

# First time: make it executable
chmod +x custom_test/run_test.sh
```

**Available options:**

- `all` (default) - Run all structure tests (no API calls)
- `basic` - Run only basic SDK structure tests
- `functions` - Run only dynamic SDK discovery tests
- `api` - Run real API integration tests (⚠️ **consumes credits!**)

**Note:** The shell script now:

- ✅ Automatically finds and changes to project root
- ✅ Shows all logs and output
- ✅ Returns to your original directory after completion
- ✅ Supports selecting which tests to run

#### Option 3: Direct execution with tsx

```bash
# Must be run from project root
npx tsx custom_test/test_sdk.ts
```

#### Option 4: After building the SDK

```bash
npm run build
node custom_test/test_sdk.js  # If compiled
```

### Dynamic SDK Discovery Tests

#### Using npm script

```bash
npm run test:functions
```

#### Direct execution

```bash
npx tsx custom_test/test_sdk_functions.ts
```

This advanced test automatically discovers and validates:

- ✅ All SDK client methods dynamically
- ✅ Method signatures and parameters
- ✅ Async/sync method detection
- ✅ Model and enum classes
- ✅ Complete SDK structure analysis

**Expected output:**

```
🧪 SDK Dynamic Analysis Test Start
============================================================
💡 Excluding only specific internal methods
   All other SDK features are automatically detected!
============================================================

🧪 Comprehensive Functionality Test Start

==================================================
🔍 SDK Structure Dynamic Discovery Test Start
  📋 Detecting available clients:
    🔍 Analyzing TTS (textToSpeech) client...
      ✅ 3 methods successful
        📂 Methods: createSpeech, streamSpeech, predictDuration
    🔍 Analyzing Voices (voices) client...
      ✅ 2 methods successful
        📂 Methods: listVoices, getVoice
    ...

  📊 Overall Detection Results:
    🎯 Total methods: 15
    ✅ Analysis successful: 15
    ❌ Analysis failed: 0

==================================================
📝 Method Signature Validation Test Start
  📋 TTS Method Signature Validation:
    ✅ createSpeech:
      📥 Required parameters (1): request
      📤 Optional parameters (1): options
    ...

  📊 Signature Validation Final Results:
    🎯 Total methods: 15
    ✅ Valid signatures: 15
    ❌ Invalid signatures: 0
    ⚡ Async methods: 15
    📈 Overall success rate: 100.0%

==================================================
📦 Models Dynamic Discovery Test Start
  📊 Models Detection Results:
    📋 Model classes: 0
    🔢 Enum classes: 25
    📦 Other objects: 50

🎉 All dynamic analysis tests complete!
```

### Python Tests (for comparison)

```bash
# Basic tests
python custom_test/test_sdk.py

# Dynamic discovery tests
python custom_test/test_sdk_functions.py
```

## Test Coverage

The TypeScript test suite includes:

1. **SDK Import Test** - Verifies that the SDK can be imported
2. **SDK Initialization Test** - Checks SDK instance creation
3. **SDK Structure Test** - Validates all client instances (textToSpeech, voices, customVoices, usage)
4. **Models Test** - Ensures model classes are available
5. **SDK Methods Test** - Confirms all methods exist and are callable
6. **Custom Utilities Test** - Validates custom utility functions

## Environment Variables

Set your API key before running tests:

```bash
export SUPERTONE_API_KEY="your-api-key-here"
```

If not set, the tests will use a placeholder key for structure validation only.

## Expected Output

Successful test run:

```
🧪 SDK Basic Test Start
==================================================

🔍 Testing SDK Import...
✅ SDK import successful

🔍 Testing SDK Initialization...
✅ SDK initialization successful

🔍 Testing SDK Structure...
📋 SDK structure check:
  ✅ textToSpeech client: createSpeech, streamSpeech, predictDuration
  ✅ voices client: listVoices, getVoice
  ✅ customVoices client: createClonedVoice, listCustomVoices
  ✅ usage client: getUsage

🔍 Testing Models...
📋 Models check:
  ✅ Available models: 50+ items

🔍 Testing SDK Methods...
✅ SDK instance creation successful
  ✅ createSpeech method exists (with auto-chunking)
  ✅ streamSpeech method exists (with auto-chunking)
  ✅ listVoices method exists

🔍 Testing Custom Utilities...
📋 Custom utilities check:
  ✅ chunkText utility exists
  ✅ mergeWavBinary utility exists
  ✅ mergeMp3Binary utility exists
  ✅ detectAudioFormat utility exists
  ✅ mergePhonemeData utility exists

==================================================
🧪 Test Results Summary:
  SDK Import: ✅ PASS
  SDK Initialization: ✅ PASS
  SDK Structure: ✅ PASS
  Models: ✅ PASS
  SDK Methods: ✅ PASS
  Custom Utilities: ✅ PASS

Total 6/6 tests passed
🎉 All tests passed! SDK is working correctly.
```

## Test Types

### 1. Basic SDK Test (`test_sdk.ts`)

- **Purpose**: Quick validation of SDK structure and basic functionality
- **Coverage**: Import, initialization, structure, models, methods
- **Use case**: Fast smoke tests, CI/CD pipelines
- **Runtime**: ~1-2 seconds

### 2. Dynamic Discovery Test (`test_sdk_functions.ts`)

- **Purpose**: Comprehensive analysis of all SDK capabilities
- **Coverage**:
  - Dynamic method discovery
  - Parameter signature analysis
  - Async/sync detection
  - Model and enum introspection
  - Complete SDK structure mapping
- **Use case**: Deep SDK validation, documentation generation
- **Runtime**: ~2-5 seconds

### 3. Real API Integration Test (`test_real_api.ts`)

- **Purpose**: Comprehensive test of actual API functionality with real server calls
- **Coverage**:
  - Usage & Credit APIs: `getCreditBalance`, `getUsage`, `getVoiceUsage`
  - Voice APIs: `listVoices`, `searchVoices`, `getVoice`
  - Custom Voice APIs: `listCustomVoices`, `searchCustomVoices`, `getCustomVoice`
  - Custom Voice Management: `createClonedVoice`, `editCustomVoice`, `deleteCustomVoice`
  - Text-to-Speech Basic: `predictDuration`, `createSpeech`, `streamSpeech`
  - TTS Long Text: `createSpeechLongText`, `streamSpeechLongText`
  - TTS with Voice Settings: `createSpeechWithVoiceSettings`, `predictDurationWithVoiceSettings`, `streamSpeechWithVoiceSettings`
  - TTS with Phonemes: `createSpeechWithPhonemes`, `streamSpeechWithPhonemes`
  - MP3 Format: `createSpeechMp3`, `createSpeechLongTextMp3`, `streamSpeechMp3`, `streamSpeechLongTextMp3`
  - Custom Features: Auto-chunking in `createSpeech` and `streamSpeech`
- **Test count**: 28+ comprehensive tests
- **Use case**: Complete end-to-end integration testing, pre-deployment validation, regression testing
- **Runtime**: ~5-10 minutes (depends on API response time and credit availability)
- **API Calls**: ⚠️ **YES - Consumes real credits!**
- **Requirements**:
  - Valid API key with sufficient credits
  - Set `SUPERTONE_API_KEY` environment variable
  - Network connectivity to Supertone API servers
  - Optional: `voice_sample.wav` file for custom voice creation tests

**Note**: This is a comprehensive TypeScript version of the Python test suite (test_real_async_api.py, 2951 lines).
The TypeScript version includes **all API tests** from the Python version **except parallel processing tests** (test_concurrent_api_calls, test_parallel_tts_conversion, test_parallel_multiple_voices, test_mixed_parallel_operations).
All other functionality including WAV/MP3 formats, voice settings, phonemes, and custom voice management are fully tested.

## Differences from Python Version

### Python Version

- Uses sync/async versions of methods
- Context manager support (`with` statement)
- Blocking I/O by default
- Rich reflection with `inspect` module

### TypeScript Version

- All methods are async (Promise-based)
- No context manager (use try/finally if needed)
- Non-blocking I/O by default
- Uses ESM imports
- Additional test for custom utilities (text chunking, audio merging)
- Limited runtime type introspection

## Troubleshooting

### Import Errors

If you get import errors, ensure the SDK is built:

```bash
npm run build
```

### Module Not Found

Check that you have all dependencies installed:

```bash
npm install
```

### TypeScript Errors

Make sure TypeScript is installed:

```bash
npm install --save-dev typescript tsx
```

### API Key Issues

If you get 401 Unauthorized errors:

1. Make sure `.env` file exists in `custom_test/` directory
2. Format should be: `SUPERTONE_API_KEY=your-actual-api-key` (no quotes)
3. Or export directly: `export SUPERTONE_API_KEY="your-key"`

### Debug Mode

For detailed error logging including stack traces:

```bash
DEBUG=1 npm run test:api
```

Or with shell script:

```bash
DEBUG=1 ./custom_test/run_test.sh api
```

This will show:

- Full stack traces
- Detailed validation errors
- Response structure inspection
- Request/response debugging info

### Response Validation Errors

Some tests may show "Response validation failed" warnings. This occurs when:

- API response structure differs from SDK schema (e.g., `voice_id` vs `voiceId`)
- This is a known SDK schema issue, not a test failure
- Tests continue running and are marked as successful with warnings
- Will be fixed in future SDK regeneration with updated OpenAPI spec

**Known Issues:**

- `getCustomVoice`: Returns undefined `voiceId` field (API uses `voice_id`)
- These validation errors don't affect actual API functionality

## Custom Utilities Test

The TypeScript version includes an additional test for custom utilities that enable:

- **Automatic Text Chunking**: Splits long text into processable chunks
- **Audio Merging**: Combines WAV/MP3 chunks into single file
- **Phoneme Processing**: Merges phoneme timing data
- **Format Detection**: Automatically detects audio format

These utilities are unique to the TypeScript SDK and enable advanced features like automatic text chunking in `createSpeech()` and `streamSpeech()`.

## Real-time TTS Streaming Player Demo

A demonstration of real-time text-to-speech streaming with audio playback using `mpv`.

### Prerequisites

1. **Install mpv player** (macOS):

   ```bash
   brew install mpv
   ```

2. **Set up environment variables**:
   - Create `.env` file in `custom_test/` directory
   - Add: `SUPERTONE_API_KEY=your-api-key`

### Running the Demo

```bash
npm run demo:player
```

### Features

- **Real-time Streaming**: Audio starts playing immediately as data arrives
- **Auto-chunking**: Automatically handles long texts (300+ characters)
- **Performance Metrics**: Shows timing statistics:
  - Time to first audio chunk
  - Time to playback start
  - Total data transferred
  - Estimated audio duration
- **Multiple Test Scenarios**: Demonstrates various text lengths:
  - Short text (~100 chars)
  - Medium text (100-300 chars)
  - Long text (300-500 chars)
  - Very long text (500-800 chars)
  - Extra long text (800+ chars)

### Demo Output

```
🎵 실시간 TTS 플레이어
==============================
✅ 준비 완료

🔥 시나리오 1/5
📂 카테고리: 짧은 텍스트
──────────────────────────────────────────────────
📝 "안녕하세요! 심플한 테스트입니다."
📏 텍스트 길이: 18자
🎵 재생 시작
✅ 재생 완료 대기 종료
📊 재생 통계:
   🎤 총 음성 길이: 1.2초
   📡 첫 청크까지: 245ms
   🎵 재생 시작까지: 512ms
   📊 총 데이터: 42.3KB (8개 청크)
```

### How It Works

1. **Stream Setup**: Initializes mpv player with stdin pipe
2. **API Call**: Requests streaming TTS from Supertone API
3. **Buffer Management**: Accumulates initial 16KB before playback
4. **Progressive Playback**: Streams remaining chunks in real-time
5. **Statistics**: Tracks timing and data metrics

### Use Cases

- **Interactive Applications**: Instant audio feedback for user input
- **Long-form Content**: Efficient processing of articles, stories
- **Accessibility Tools**: Real-time text-to-speech for visually impaired users
- **Content Creation**: Preview TTS output during editing

### Notes

- **Credit Usage**: Each run consumes API credits (5 scenarios per demo)
- **Network Dependency**: Requires stable internet connection
- **Audio Format**: Uses WAV format for optimal streaming quality
- **Language**: Demo uses Korean text, easily adaptable to other languages
