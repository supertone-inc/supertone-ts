# Custom Utilities for Supertone TTS SDK

This module provides custom utilities for text-to-speech operations, enabling automatic text chunking, audio merging, and phoneme processing.

## Features

- **Automatic Text Chunking**: Splits long text into optimal chunks for TTS processing
- **Audio Merging**: Merges WAV and MP3 audio files with proper header handling
- **Phoneme Processing**: Merges and adjusts phoneme timing data across chunks
- **Parallel Processing**: Processes multiple chunks in parallel for better performance

## Usage

### Basic Usage with Auto-Chunking

```typescript
import { Supertone } from "supertone";

const client = new Supertone({
	apiKey: process.env.SUPERTONE_API_KEY,
});

// For long text (>300 characters), use createSpeechWithChunking
const longText = "Your very long text here...".repeat(100);

const response = await client.textToSpeech.createSpeechWithChunking({
	voiceId: "your-voice-id",
	apiConvertTextToSpeechUsingCharacterRequest: {
		text: longText,
		language: "ko-KR",
		outputFormat: "wav",
	},
});

// The response contains merged audio from all chunks
```

### Custom Max Length

```typescript
const response = await client.textToSpeech.createSpeechWithChunking(
	{
		voiceId: "your-voice-id",
		apiConvertTextToSpeechUsingCharacterRequest: {
			text: longText,
			language: "ko-KR",
			outputFormat: "wav",
		},
	},
	{
		maxTextLength: 500, // Custom chunk size
	}
);
```

### Using Utilities Directly

```typescript
import {
	chunkText,
	mergeWavBinary,
	detectAudioFormat,
} from "supertone/lib/custom_utils";

// Chunk text
const chunks = chunkText("Your long text here", 300);
console.log(chunks); // ["chunk1", "chunk2", ...]

// Merge WAV files
const audioChunks = [chunk1, chunk2, chunk3]; // Uint8Array[]
const mergedAudio = mergeWavBinary(audioChunks);

// Detect audio format
const format = detectAudioFormat(audioData);
console.log(format); // "wav" or "mp3"
```

## Module Structure

```
custom_utils/
├── constants.ts       # Constants for audio and text processing
├── text_utils.ts      # Text chunking and NDJSON processing
├── audio_utils.ts     # WAV/MP3 audio manipulation
├── phoneme_utils.ts   # Phoneme data merging and timing
└── index.ts          # Main exports
```

## API Reference

### Text Utilities

#### `chunkText(text: string, maxLength?: number): string[]`

Splits text into chunks suitable for TTS processing.

- `text`: Input text to segment
- `maxLength`: Maximum length per chunk (default: 300)
- Returns: Array of text chunks

### Audio Utilities

#### `mergeWavBinary(audioChunks: Uint8Array[]): Uint8Array`

Merges multiple WAV audio files into one.

#### `mergeMp3Binary(audioChunks: Uint8Array[]): Uint8Array`

Merges multiple MP3 audio files into one.

#### `detectAudioFormat(audioData: Uint8Array): string`

Detects audio format from binary data.

- Returns: `"wav"`, `"mp3"`, or `"unknown"`

#### `removeWavHeader(audioData: Uint8Array): Uint8Array`

Removes WAV header from audio data.

#### `removeMp3Header(mp3Data: Uint8Array): Uint8Array`

Removes MP3 ID3 tags from audio data.

### Phoneme Utilities

#### `mergePhonemeData(phonemeChunks: Partial<PhonemeData>[]): PhonemeData`

Merges phoneme data with automatic time offset adjustment.

#### `adjustPhonemeTiming(phonemeData: Partial<PhonemeData>, offset: number): PhonemeData`

Applies time offset to phoneme start times.

## Constants

```typescript
export const WAV_HEADER_SIZE = 44;
export const DEFAULT_MAX_TEXT_LENGTH = 300;
export const MAX_PARALLEL_WORKERS = 3;
```

## How It Works

### Automatic Text Chunking

1. **Text Analysis**: Checks if text exceeds maximum length
2. **Intelligent Splitting**: Splits at sentence boundaries (`.`, `!`, `?`, `;`, `:`)
3. **Parallel Processing**: Processes chunks concurrently
4. **Audio Merging**: Combines results with proper header handling

### Audio Merging Process

For WAV files:

1. Extracts header information from first chunk
2. Removes headers from subsequent chunks
3. Concatenates audio data
4. Creates new WAV header with correct file size

For MP3 files:

1. Simple concatenation (MP3 is stream-based)

## Performance Considerations

- **Parallel Processing**: Uses `Promise.all()` for concurrent chunk processing
- **Memory Efficient**: Streams audio data when possible
- **Format Detection**: Automatic format detection for optimal merging

## Error Handling

All utilities throw descriptive errors:

```typescript
try {
	const response = await client.textToSpeech.createSpeechWithChunking({
		// ...
	});
} catch (error) {
	console.error("Failed to create speech:", error);
}
```

## Notes

- Maximum recommended text length per API call: 300 characters
- Automatic chunking activates for texts longer than the threshold
- WAV files are merged with proper header reconstruction
- Phoneme timing data is automatically adjusted across chunks
