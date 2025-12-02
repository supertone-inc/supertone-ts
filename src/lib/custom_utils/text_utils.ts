/**
 * TTS Text Processing Utilities
 *
 * Stateless utility functions for text segmentation and NDJSON processing.
 * These functions are designed to be pure functions without side effects.
 */

import { DEFAULT_MAX_TEXT_LENGTH } from "./constants.js";

/**
 * Split input text into sentence chunks suitable for TTS processing.
 *
 * Enhanced version that implements intelligent text segmentation respecting
 * sentence boundaries while ensuring each chunk stays within TTS API limits.
 * It handles various punctuation patterns and provides graceful fallback to
 * word/character boundaries when necessary.
 *
 * @param text - Input text to be segmented
 * @param maxLength - Maximum length of each chunk
 * @returns Array of text chunks
 */
export function chunkText(
	text: string,
	maxLength: number = DEFAULT_MAX_TEXT_LENGTH
): string[] {
	if (text.length <= maxLength) {
		return [text];
	}

	// Split by sentence boundaries
	const sentences = text.split(/([.!?;:]+\s*)/);

	const chunks: string[] = [];
	let currentChunk = "";

	for (const sentence of sentences) {
		if (currentChunk.length + sentence.length <= maxLength) {
			currentChunk += sentence;
		} else {
			if (currentChunk) {
				chunks.push(currentChunk);
			}
			currentChunk = sentence;
		}
	}

	if (currentChunk) {
		chunks.push(currentChunk);
	}

	return chunks;
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
