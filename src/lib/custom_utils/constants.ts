/**
 * TTS Custom Constants
 *
 * Audio format and text processing constants used across TTS operations.
 * These constants are part of the custom implementation for automatic
 * text chunking and audio merging functionality.
 */

// Audio format constants
export const WAV_HEADER_SIZE = 44;
export const WAV_RIFF_HEADER_SIZE = 36;
export const WAV_CHUNK_HEADER_SIZE = 8;
export const MP3_ID3V2_HEADER_SIZE = 10;
export const MP3_ID3V1_TAG_POS = 128; // Position from end of file
export const DEFAULT_STREAM_CHUNK_SIZE = 8192;

// Text chunking constants
export const DEFAULT_MAX_TEXT_LENGTH = 300;

// Parallel processing constants
export const MAX_PARALLEL_WORKERS = 3; // Number of workers for parallel processing
