/**
 * TTS Phoneme Processing Utilities
 *
 * Stateless utility functions for phoneme data merging and timing adjustment.
 * These functions handle the synchronization of phoneme timing data across
 * multiple audio chunks.
 */

export interface PhonemeData {
	symbols: string[];
	durations_seconds: number[];
	start_times_seconds: number[];
}

/**
 * Merge multiple phoneme data chunks with automatic time offset adjustment.
 *
 * Handles the merging of phoneme data from multiple TTS chunks, ensuring
 * continuous timing by adjusting start times and maintaining duration
 * offsets. The first chunk's start time is normalized to 0, and
 * subsequent chunks are offset accordingly.
 *
 * @param phonemeChunks - Array of phoneme dictionaries
 * @returns Merged phoneme dictionary with adjusted timing
 */
export function mergePhonemeData(
	phonemeChunks: Partial<PhonemeData>[]
): PhonemeData {
	const merged: PhonemeData = {
		symbols: [],
		durations_seconds: [],
		start_times_seconds: [],
	};

	if (!phonemeChunks || phonemeChunks.length === 0) {
		return merged;
	}

	let firstChunkStartTime: number | null = null;
	let currentTimeOffset = 0.0;

	for (const phonemeData of phonemeChunks) {
		if (!phonemeData) {
			continue;
		}

		// Add symbols
		const symbols = phonemeData.symbols || [];
		merged.symbols.push(...symbols);

		// Add durations
		const durations = phonemeData.durations_seconds || [];
		merged.durations_seconds.push(...durations);

		// Adjust and add start times
		if (
			phonemeData.start_times_seconds &&
			phonemeData.start_times_seconds.length > 0
		) {
			const originalStartTimes = phonemeData.start_times_seconds;

			let adjustedStartTimes: number[];

			if (firstChunkStartTime === null) {
				// First chunk: normalize to start from 0
				// We know originalStartTimes[0] exists because length > 0
				const firstTime = originalStartTimes[0];
				if (firstTime === undefined) {
					continue; // Skip this chunk if start time is undefined
				}
				firstChunkStartTime = firstTime;
				adjustedStartTimes = originalStartTimes.map(
					(t) => t - firstChunkStartTime!
				);
			} else {
				// Subsequent chunks: apply accumulated offset
				adjustedStartTimes = originalStartTimes.map(
					(t) => t - firstChunkStartTime! + currentTimeOffset
				);
			}

			merged.start_times_seconds.push(...adjustedStartTimes);

			// Update offset for next chunk
			if (durations.length > 0) {
				currentTimeOffset += durations.reduce((sum, d) => sum + d, 0);
			}
		}
	}

	return merged;
}

/**
 * Apply time offset to phoneme start times.
 *
 * Creates a new phoneme dictionary with start times shifted by the
 * specified offset. Useful for sequential streaming scenarios.
 *
 * @param phonemeData - Phoneme dictionary with timing data
 * @param offset - Time offset in seconds to add to all start times
 * @returns New phoneme dictionary with adjusted start times
 */
export function adjustPhonemeTiming(
	phonemeData: Partial<PhonemeData>,
	offset: number
): PhonemeData {
	const adjusted: PhonemeData = {
		symbols: phonemeData.symbols || [],
		durations_seconds: phonemeData.durations_seconds || [],
		start_times_seconds: phonemeData.start_times_seconds || [],
	};

	if (adjusted.start_times_seconds && adjusted.start_times_seconds.length > 0) {
		adjusted.start_times_seconds = adjusted.start_times_seconds.map(
			(t) => t + offset
		);
	}

	return adjusted;
}

/**
 * Create an empty phoneme dictionary with standard structure.
 *
 * @returns Empty phoneme dictionary
 */
export function createEmptyPhonemeDict(): PhonemeData {
	return {
		symbols: [],
		durations_seconds: [],
		start_times_seconds: [],
	};
}
