/**
 * TTS Text Processing Utilities
 *
 * Stateless utility functions for text segmentation and NDJSON processing.
 * These functions are designed to be pure functions without side effects.
 */

import { DEFAULT_MAX_TEXT_LENGTH } from "./constants.js";

/**
 * Sentence-ending punctuation pattern for multilingual support.
 *
 * Supported languages: English, Korean, Japanese, Bulgarian, Czech, Danish,
 * Greek, Spanish, Estonian, Finnish, Hungarian, Italian, Dutch, Polish,
 * Portuguese, Romanian, Arabic, German, French, Hindi, Indonesian, Russian,
 * Vietnamese, Chinese, Thai, and more.
 *
 * Punctuation groups:
 * - ASCII basics: . ! ? ; :
 * - Ellipsis: … (U+2026), ‥ (U+2025)
 * - CJK fullwidth: 。！？；：｡、
 * - Arabic/Urdu: ؟ ؛ ۔ ،
 * - Devanagari (Hindi/Sanskrit): । ॥
 * - Greek question mark: ; (U+037E)
 */
const SENTENCE_PUNCTUATION = ".!?;:…‥。！？；：｡、؟؛۔،।॥\u037E";
const SENTENCE_SPLIT_PATTERN = new RegExp(
	`([${SENTENCE_PUNCTUATION}]+\\s*)`,
	"u"
);

/**
 * Check if text contains spaces (to determine if word-based splitting is possible)
 *
 * @param text - Text to check
 * @returns true if text contains spaces
 */
function hasSpaces(text: string): boolean {
	return /\s/.test(text);
}

/**
 * Split text by words, ensuring each chunk is under maxLength.
 * Used for languages with spaces (English, Korean, etc.)
 *
 * @param text - Text to split
 * @param maxLength - Maximum length of each chunk
 * @returns Array of text chunks
 */
function splitByWords(text: string, maxLength: number): string[] {
	const words = text.split(/(\s+)/);
	const chunks: string[] = [];
	let currentChunk = "";

	for (const word of words) {
		if (currentChunk.length + word.length <= maxLength) {
			currentChunk += word;
		} else {
			if (currentChunk.trim()) {
				chunks.push(currentChunk.trim());
			}
			// If a single word exceeds maxLength, split by characters
			if (word.trim().length > maxLength) {
				const charChunks = splitByCharacters(word.trim(), maxLength);
				chunks.push(...charChunks);
				currentChunk = "";
			} else {
				currentChunk = word;
			}
		}
	}

	if (currentChunk.trim()) {
		chunks.push(currentChunk.trim());
	}

	return chunks;
}

/**
 * Split text by characters, ensuring each chunk is under maxLength.
 * Used for languages without spaces (Japanese, Chinese, etc.)
 *
 * @param text - Text to split
 * @param maxLength - Maximum length of each chunk
 * @returns Array of text chunks
 */
function splitByCharacters(text: string, maxLength: number): string[] {
	const chunks: string[] = [];

	for (let i = 0; i < text.length; i += maxLength) {
		chunks.push(text.slice(i, i + maxLength));
	}

	return chunks;
}

/**
 * Split a single chunk that exceeds maxLength into smaller chunks.
 * Uses word-based splitting for texts with spaces, character-based for texts without.
 *
 * @param chunk - Text chunk to split
 * @param maxLength - Maximum length of each chunk
 * @returns Array of text chunks, all under maxLength
 */
function splitOversizedChunk(chunk: string, maxLength: number): string[] {
	if (chunk.length <= maxLength) {
		return [chunk];
	}

	// Check if text has spaces (word-based splitting possible)
	if (hasSpaces(chunk)) {
		return splitByWords(chunk, maxLength);
	}

	// No spaces: use character-based splitting (Japanese, Chinese, etc.)
	return splitByCharacters(chunk, maxLength);
}

/**
 * Split input text into sentence chunks suitable for TTS processing.
 *
 * Enhanced version that implements intelligent text segmentation respecting
 * sentence boundaries while ensuring each chunk stays within TTS API limits.
 * It handles various punctuation patterns and provides graceful fallback to
 * word/character boundaries when necessary.
 *
 * Chunking Strategy:
 * 1. First, split by sentence boundaries (multilingual punctuation)
 * 2. Merge sentences into chunks up to maxLength
 * 3. If a sentence exceeds maxLength:
 *    - For text with spaces: split by words
 *    - For text without spaces (Japanese, etc.): split by characters
 *
 * @param text - Input text to be segmented
 * @param maxLength - Maximum length of each chunk
 * @returns Array of text chunks, each guaranteed to be <= maxLength
 */
export function chunkText(
	text: string,
	maxLength: number = DEFAULT_MAX_TEXT_LENGTH
): string[] {
	if (text.length <= maxLength) {
		return [text];
	}

	// Step 1: Split by sentence boundaries (multilingual punctuation)
	const sentences = text.split(SENTENCE_SPLIT_PATTERN);

	const preliminaryChunks: string[] = [];
	let currentChunk = "";

	// Step 2: Merge sentences into chunks up to maxLength
	for (const sentence of sentences) {
		if (currentChunk.length + sentence.length <= maxLength) {
			currentChunk += sentence;
		} else {
			if (currentChunk) {
				preliminaryChunks.push(currentChunk);
			}
			currentChunk = sentence;
		}
	}

	if (currentChunk) {
		preliminaryChunks.push(currentChunk);
	}

	// Step 3: Handle oversized chunks (split by words or characters)
	const finalChunks: string[] = [];
	for (const chunk of preliminaryChunks) {
		if (chunk.length <= maxLength) {
			finalChunks.push(chunk);
		} else {
			// Chunk exceeds maxLength, need to split further
			const subChunks = splitOversizedChunk(chunk, maxLength);
			finalChunks.push(...subChunks);
		}
	}

	// Filter out empty chunks
	return finalChunks.filter((chunk) => chunk.length > 0);
}

/**
 * Extract audio data from NDJSON response.
 *
 * Handles both single JSON object and NDJSON (multiple lines) formats.
 * Decodes base64-encoded audio data and returns as binary.
 *
 * @param ndjsonStr - NDJSON string containing audio_base64 field
 * @returns Decoded binary audio data
 */
export function extractAudioFromNdjson(ndjsonStr: string): Uint8Array {
	// Check if it's a single JSON object
	try {
		const data = JSON.parse(ndjsonStr);
		if (data.audio_base64) {
			return base64ToUint8Array(data.audio_base64);
		}
	} catch (e) {
		// Not a single JSON object, process as NDJSON
	}

	// Process NDJSON (multiple lines)
	const lines = ndjsonStr.trim().split("\n");
	const audioChunks: Uint8Array[] = [];

	for (const line of lines) {
		if (line.trim()) {
			try {
				const data = JSON.parse(line);
				if (data.audio_base64) {
					audioChunks.push(base64ToUint8Array(data.audio_base64));
				}
			} catch (e) {
				continue;
			}
		}
	}

	// Merge all chunks
	return mergeUint8Arrays(audioChunks);
}

/**
 * Convert base64 string to Uint8Array.
 *
 * @param base64 - Base64 encoded string
 * @returns Decoded Uint8Array
 */
function base64ToUint8Array(base64: string): Uint8Array {
	// Handle both Node.js and browser environments
	if (typeof Buffer !== "undefined") {
		// Node.js
		return new Uint8Array(Buffer.from(base64, "base64"));
	} else {
		// Browser
		const binaryString = atob(base64);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	}
}

/**
 * Merge multiple Uint8Arrays into one.
 *
 * @param arrays - Array of Uint8Arrays to merge
 * @returns Merged Uint8Array
 */
function mergeUint8Arrays(arrays: Uint8Array[]): Uint8Array {
	const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
	const result = new Uint8Array(totalLength);
	let offset = 0;
	for (const arr of arrays) {
		result.set(arr, offset);
		offset += arr.length;
	}
	return result;
}
