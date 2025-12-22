/**
 * Custom Utilities for TTS SDK
 *
 * This module provides custom utilities for text-to-speech operations,
 * including automatic text chunking, audio merging, and phoneme processing.
 */

// Export all constants
export * from "./constants.js";

// Export text utilities
export { chunkText, extractAudioFromNdjson } from "./text_utils.js";

// Export pronunciation utilities
export {
	applyPronunciationDictionary,
	PronunciationDictionaryValidationError,
	type PronunciationDictionaryEntry,
} from "./pronunciation_utils.js";

// Export audio utilities
export {
	mergeWavBinary,
	mergeMp3Binary,
	removeWavHeader,
	removeMp3Header,
	detectAudioFormat,
	extractAudioFromResponse,
	extractAudioFromResponses,
} from "./audio_utils.js";

// Export phoneme utilities
export {
	mergePhonemeData,
	adjustPhonemeTiming,
	createEmptyPhonemeDict,
	type PhonemeData,
} from "./phoneme_utils.js";
