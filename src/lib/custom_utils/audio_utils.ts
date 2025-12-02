/**
 * TTS Audio Processing Utilities
 *
 * Stateless utility functions for WAV and MP3 audio manipulation.
 * Provides binary-level audio processing without external dependencies.
 */

import {
	WAV_HEADER_SIZE,
	WAV_RIFF_HEADER_SIZE,
	WAV_CHUNK_HEADER_SIZE,
	MP3_ID3V2_HEADER_SIZE,
	MP3_ID3V1_TAG_POS,
} from "./constants.js";

/**
 * Merge binary WAV data chunks into a single WAV file.
 *
 * Extracts audio data from each chunk, combines them, and creates a new
 * WAV header with correct file size information. Preserves audio format
 * parameters (channels, sample rate, etc.) from the first chunk.
 *
 * @param audioChunks - Array of binary WAV data to merge
 * @returns Merged WAV file as binary data
 */
export function mergeWavBinary(audioChunks: Uint8Array[]): Uint8Array {
	if (!audioChunks || audioChunks.length === 0) {
		return new Uint8Array(0);
	}

	const firstAudioData = audioChunks[0];
	if (!firstAudioData || firstAudioData.length < WAV_HEADER_SIZE) {
		throw new Error("Invalid WAV data: first chunk is too small");
	}

	// Parse WAV header from first chunk
	const wavHeader = firstAudioData.slice(0, WAV_HEADER_SIZE);
	const channels = readUint16LE(wavHeader, 22);
	const sampleRate = readUint32LE(wavHeader, 24);
	const byteRate = readUint32LE(wavHeader, 28);
	const blockAlign = readUint16LE(wavHeader, 32);
	const bitsPerSample = readUint16LE(wavHeader, 34);

	// Collect all audio data (skip headers)
	const allAudioData: Uint8Array[] = [];

	for (const audioData of audioChunks) {
		// Skip WAV header and extract only audio data
		if (
			audioData.length >= WAV_HEADER_SIZE &&
			arrayStartsWith(audioData, "RIFF")
		) {
			// Find data chunk
			let pos = WAV_RIFF_HEADER_SIZE;
			while (pos < audioData.length - WAV_CHUNK_HEADER_SIZE) {
				const chunkId = arrayToString(audioData.slice(pos, pos + 4));
				const chunkSize = readUint32LE(audioData, pos + 4);

				if (chunkId === "data") {
					allAudioData.push(audioData.slice(pos + 8, pos + 8 + chunkSize));
					break;
				}
				pos += 8 + chunkSize;
			}
		} else {
			allAudioData.push(audioData);
		}
	}

	// Merge all audio data
	const mergedAudioData = concatUint8Arrays(allAudioData);
	const totalLength = mergedAudioData.length;
	const fileSize = totalLength + WAV_RIFF_HEADER_SIZE;

	// Create new WAV file header
	const mergedWav = new Uint8Array(WAV_HEADER_SIZE + totalLength);
	let offset = 0;

	// RIFF header
	writeString(mergedWav, offset, "RIFF");
	offset += 4;
	writeUint32LE(mergedWav, offset, fileSize);
	offset += 4;
	writeString(mergedWav, offset, "WAVE");
	offset += 4;

	// fmt chunk
	writeString(mergedWav, offset, "fmt ");
	offset += 4;
	writeUint32LE(mergedWav, offset, 16); // fmt chunk size
	offset += 4;
	writeUint16LE(mergedWav, offset, 1); // audio format (PCM)
	offset += 2;
	writeUint16LE(mergedWav, offset, channels);
	offset += 2;
	writeUint32LE(mergedWav, offset, sampleRate);
	offset += 4;
	writeUint32LE(mergedWav, offset, byteRate);
	offset += 4;
	writeUint16LE(mergedWav, offset, blockAlign);
	offset += 2;
	writeUint16LE(mergedWav, offset, bitsPerSample);
	offset += 2;

	// data chunk
	writeString(mergedWav, offset, "data");
	offset += 4;
	writeUint32LE(mergedWav, offset, totalLength);
	offset += 4;

	// Audio data
	mergedWav.set(mergedAudioData, offset);

	return mergedWav;
}

/**
 * Merge MP3 audio chunks using simple concatenation.
 *
 * This is a practical approach for MP3 merging. For more advanced
 * MP3 merging with proper frame handling, consider using external libraries.
 *
 * @param audioChunks - Array of binary MP3 data to merge
 * @returns Concatenated MP3 data
 */
export function mergeMp3Binary(audioChunks: Uint8Array[]): Uint8Array {
	if (!audioChunks || audioChunks.length === 0) {
		return new Uint8Array(0);
	}
	return concatUint8Arrays(audioChunks);
}

/**
 * Remove WAV header from audio data.
 *
 * Used for intermediate chunks when merging multiple WAV files.
 * Finds the "data" chunk and returns only the audio data portion.
 *
 * @param audioData - Binary WAV data with header
 * @returns Binary audio data without header
 */
export function removeWavHeader(audioData: Uint8Array): Uint8Array {
	if (
		audioData.length >= WAV_HEADER_SIZE &&
		arrayStartsWith(audioData, "RIFF")
	) {
		// Find "data" chunk
		const dataPos = findSubarray(audioData, stringToBytes("data"));
		if (dataPos > 0) {
			// Skip "data" + 4-byte size info
			return audioData.slice(dataPos + 8);
		}
	}
	return audioData;
}

/**
 * Remove MP3 ID3 tags (v1 and v2) from audio data.
 *
 * Handles both ID3v2 tags (at the beginning) and ID3v1 tags (at the end).
 * Returns pure MPEG audio data without metadata.
 *
 * @param mp3Data - Binary MP3 data with headers
 * @returns Binary MP3 data without ID3 tags
 */
export function removeMp3Header(mp3Data: Uint8Array): Uint8Array {
	let data = mp3Data;

	// Remove ID3v2 tag (at beginning)
	if (data.length >= MP3_ID3V2_HEADER_SIZE && arrayStartsWith(data, "ID3")) {
		// Safe access with non-null assertions after length check
		const size =
			((data[6]! << 21) | (data[7]! << 14) | (data[8]! << 7) | data[9]!) >>> 0;
		let headerSize = MP3_ID3V2_HEADER_SIZE;
		if (data[5]! & 0x10) {
			// Footer present
			headerSize += MP3_ID3V2_HEADER_SIZE;
		}
		data = data.slice(headerSize + size);
	}

	// Remove ID3v1 tag (at end of file)
	if (
		data.length >= MP3_ID3V1_TAG_POS &&
		arrayToString(data.slice(-MP3_ID3V1_TAG_POS, -MP3_ID3V1_TAG_POS + 3)) ===
			"TAG"
	) {
		data = data.slice(0, -MP3_ID3V1_TAG_POS);
	}

	return data;
}

/**
 * Detect audio format from binary data.
 *
 * Examines the first few bytes to determine if the data is WAV, MP3,
 * or unknown format.
 *
 * @param audioData - Binary audio data
 * @returns Format string: 'wav', 'mp3', or 'unknown'
 */
export function detectAudioFormat(audioData: Uint8Array): string {
	if (audioData.length >= 4 && arrayStartsWith(audioData, "RIFF")) {
		return "wav";
	} else if (audioData.length >= 3 && arrayStartsWith(audioData, "ID3")) {
		return "mp3";
	} else if (
		audioData.length >= 2 &&
		audioData[0]! === 0xff &&
		(audioData[1]! === 0xfb || audioData[1]! === 0xfa)
	) {
		return "mp3";
	}
	return "unknown";
}

/**
 * Extract audio data from response object.
 *
 * Handles ReadableStream and direct content types.
 *
 * @param response - Response object
 * @returns Binary audio data
 */
export async function extractAudioFromResponse(
	response: any
): Promise<Uint8Array> {
	// If response is already binary data
	if (response instanceof Uint8Array) {
		return response;
	}

	// If response is ReadableStream
	if (response instanceof ReadableStream) {
		const reader = response.getReader();
		const chunks: Uint8Array[] = [];

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
		}

		return concatUint8Arrays(chunks);
	}

	// If response is an object with content
	if (response && typeof response === "object") {
		if (response.content instanceof Uint8Array) {
			return response.content;
		}
		if (response.data instanceof Uint8Array) {
			return response.data;
		}
	}

	// Fallback: convert to Uint8Array
	return new Uint8Array(0);
}

/**
 * Extract audio data from multiple responses.
 *
 * @param responses - Array of response objects
 * @returns Array of extracted binary audio data
 */
export async function extractAudioFromResponses(
	responses: any[]
): Promise<Uint8Array[]> {
	const audioChunks: Uint8Array[] = [];
	for (const response of responses) {
		const audioData = await extractAudioFromResponse(response);
		audioChunks.push(audioData);
	}
	return audioChunks;
}

// Helper functions

function readUint16LE(buffer: Uint8Array, offset: number): number {
	if (offset + 1 >= buffer.length) {
		throw new Error(`Buffer overflow: trying to read at offset ${offset}`);
	}
	return buffer[offset]! | (buffer[offset + 1]! << 8);
}

function readUint32LE(buffer: Uint8Array, offset: number): number {
	if (offset + 3 >= buffer.length) {
		throw new Error(`Buffer overflow: trying to read at offset ${offset}`);
	}
	return (
		buffer[offset]! |
		(buffer[offset + 1]! << 8) |
		(buffer[offset + 2]! << 16) |
		(buffer[offset + 3]! << 24)
	);
}

function writeUint16LE(
	buffer: Uint8Array,
	offset: number,
	value: number
): void {
	if (offset + 1 >= buffer.length) {
		throw new Error(`Buffer overflow: trying to write at offset ${offset}`);
	}
	buffer[offset] = value & 0xff;
	buffer[offset + 1] = (value >> 8) & 0xff;
}

function writeUint32LE(
	buffer: Uint8Array,
	offset: number,
	value: number
): void {
	if (offset + 3 >= buffer.length) {
		throw new Error(`Buffer overflow: trying to write at offset ${offset}`);
	}
	buffer[offset] = value & 0xff;
	buffer[offset + 1] = (value >> 8) & 0xff;
	buffer[offset + 2] = (value >> 16) & 0xff;
	buffer[offset + 3] = (value >> 24) & 0xff;
}

function writeString(buffer: Uint8Array, offset: number, str: string): void {
	if (offset + str.length > buffer.length) {
		throw new Error(
			`Buffer overflow: trying to write string at offset ${offset}`
		);
	}
	for (let i = 0; i < str.length; i++) {
		buffer[offset + i] = str.charCodeAt(i);
	}
}

function arrayToString(buffer: Uint8Array): string {
	return String.fromCharCode(...Array.from(buffer));
}

function stringToBytes(str: string): Uint8Array {
	const bytes = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i++) {
		bytes[i] = str.charCodeAt(i);
	}
	return bytes;
}

function arrayStartsWith(buffer: Uint8Array, str: string): boolean {
	if (buffer.length < str.length) return false;
	for (let i = 0; i < str.length; i++) {
		if (buffer[i]! !== str.charCodeAt(i)) return false;
	}
	return true;
}

function findSubarray(haystack: Uint8Array, needle: Uint8Array): number {
	for (let i = 0; i <= haystack.length - needle.length; i++) {
		let found = true;
		for (let j = 0; j < needle.length; j++) {
			if (haystack[i + j]! !== needle[j]!) {
				found = false;
				break;
			}
		}
		if (found) return i;
	}
	return -1;
}

function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
	const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
	const result = new Uint8Array(totalLength);
	let offset = 0;
	for (const arr of arrays) {
		result.set(arr, offset);
		offset += arr.length;
	}
	return result;
}
