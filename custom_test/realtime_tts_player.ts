#!/usr/bin/env node
/**
 * Real-time Streaming TTS Audio Player
 */

import { spawn, ChildProcess } from "child_process";
import { Supertone } from "../src/index.js";
import * as models from "../src/models/index.js";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const API_KEY = process.env.SUPERTONE_API_KEY || "";

interface PlaybackStats {
	streamingStartTime: number;
	apiCallStartTime: number;
	apiCallEndTime: number;
	firstChunkTime: number;
	playbackStartTime: number;
	totalBytes: number;
	totalChunks: number;
	estimatedDuration: number;
	sampleRate?: number;
	channels?: number;
}

class SimpleMpvPlayer {
	private mpvProcess: ChildProcess | null = null;
	private isPlaying = false;
	private isPlaybackActive = false;
	private initialBuffer = new Uint8Array(0);
	private bufferThreshold = 16384; // 16KB
	private stats: PlaybackStats = {
		streamingStartTime: 0,
		apiCallStartTime: 0,
		apiCallEndTime: 0,
		firstChunkTime: 0,
		playbackStartTime: 0,
		totalBytes: 0,
		totalChunks: 0,
		estimatedDuration: 0,
	};

	/**
	 * Start mpv player
	 */
	async startPlayer(): Promise<void> {
		this.mpvProcess = spawn("mpv", ["--no-video", "fd://0"], {
			stdio: ["pipe", "pipe", "ignore"],
		});

		// Monitor playback status
		this.mpvProcess.stdout?.on("data", (data) => {
			const output = data.toString();

			if (
				(output.includes("AO:") || output.includes("Playing")) &&
				!this.isPlaybackActive
			) {
				this.isPlaybackActive = true;
				this.stats.playbackStartTime = Date.now();
				console.log("🎵 Playback started");
			}

			if (output.includes("Exiting") || output.includes("EOF")) {
				this.isPlaybackActive = false;
			}
		});

		this.mpvProcess.on("exit", () => {
			this.isPlaybackActive = false;
		});

		this.mpvProcess.on("error", () => {
			this.isPlaybackActive = false;
		});

		await new Promise((resolve) => setTimeout(resolve, 300));
		this.isPlaying = true;
	}

	/**
	 * Mark streaming start time
	 */
	startStreaming(): void {
		this.stats.streamingStartTime = Date.now();
	}

	/**
	 * Mark API call start time
	 */
	markApiCallStart(): void {
		this.stats.apiCallStartTime = Date.now();
	}

	/**
	 * Mark API call end time
	 */
	markApiCallEnd(): void {
		this.stats.apiCallEndTime = Date.now();
	}

	/**
	 * Add audio chunk to playback buffer
	 */
	addAudioChunk(chunkData: Uint8Array): void {
		if (!this.isPlaying || !this.mpvProcess?.stdin) return;

		// Record first chunk time
		if (this.stats.totalChunks === 0) {
			this.stats.firstChunkTime = Date.now();
			this.parseWavHeader(chunkData);
		}

		this.stats.totalChunks++;
		this.stats.totalBytes += chunkData.length;

		// Initial buffering
		if (this.initialBuffer.length < this.bufferThreshold) {
			const newBuffer = new Uint8Array(
				this.initialBuffer.length + chunkData.length
			);
			newBuffer.set(this.initialBuffer);
			newBuffer.set(chunkData, this.initialBuffer.length);
			this.initialBuffer = newBuffer;

			if (this.initialBuffer.length >= this.bufferThreshold) {
				this.writeToMpv(this.initialBuffer);
				this.initialBuffer = new Uint8Array(0);
			}
			return;
		}

		this.writeToMpv(chunkData);
	}

	/**
	 * Extract audio information from WAV header
	 */
	private parseWavHeader(chunkData: Uint8Array): void {
		try {
			if (chunkData.length >= 44) {
				const riff = new TextDecoder().decode(chunkData.slice(0, 4));
				const wave = new TextDecoder().decode(chunkData.slice(8, 12));

				if (riff === "RIFF" && wave === "WAVE") {
					const sampleRate = new DataView(
						chunkData.buffer,
						chunkData.byteOffset + 24,
						4
					).getUint32(0, true);
					const channels = new DataView(
						chunkData.buffer,
						chunkData.byteOffset + 22,
						2
					).getUint16(0, true);

					this.stats.sampleRate = sampleRate;
					this.stats.channels = channels;
				}
			}
		} catch (error) {
			// Ignore parsing errors
		}
	}

	/**
	 * Write data to mpv safely
	 */
	private writeToMpv(data: Uint8Array): void {
		try {
			if (this.mpvProcess?.stdin?.writable) {
				this.mpvProcess.stdin.write(Buffer.from(data));
			}
		} catch (error) {
			// Ignore errors
		}
	}

	/**
	 * Finish streaming and flush remaining buffers
	 */
	finishStreaming(): void {
		// Calculate estimated playback duration
		if (this.stats.sampleRate && this.stats.channels) {
			const bytesPerSecond = this.stats.sampleRate * this.stats.channels * 2; // 16bit
			this.stats.estimatedDuration = this.stats.totalBytes / bytesPerSecond;
		}

		if (this.initialBuffer.length > 0) {
			this.writeToMpv(this.initialBuffer);
			this.initialBuffer = new Uint8Array(0);
		}

		try {
			this.mpvProcess?.stdin?.end();
		} catch (error) {
			// Ignore errors
		}
	}

	/**
	 * Wait for playback completion (improved version)
	 */
	async waitForPlaybackComplete(): Promise<void> {
		// Wait for playback to start
		let waitCount = 0;
		while (!this.isPlaybackActive && waitCount < 50) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			waitCount++;
		}

		if (!this.isPlaybackActive) {
			console.log("⚠️ Playback did not start");
			return;
		}

		// Ensure minimum wait based on estimated playback duration
		const minimumWaitTime = Math.max(
			this.stats.estimatedDuration * 1000, // Estimated playback duration
			5000 // Minimum 5 seconds
		);

		console.log(
			`⏳ Waiting minimum ${(minimumWaitTime / 1000).toFixed(
				1
			)}s (based on estimated duration)`
		);

		// Step 1: Wait for estimated playback duration
		await new Promise((resolve) => setTimeout(resolve, minimumWaitTime));

		// Step 2: Wait for completion signal (additional max 10s)
		console.log("⏳ Waiting for completion signal...");
		waitCount = 0;
		while (this.isPlaybackActive && waitCount < 100) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			waitCount++;
		}

		console.log("✅ Playback wait completed");
	}

	/**
	 * Stop the player
	 */
	async stopPlayer(): Promise<void> {
		this.isPlaying = false;

		if (this.mpvProcess) {
			setTimeout(() => {
				if (this.mpvProcess && !this.mpvProcess.killed) {
					this.mpvProcess.kill();
				}
			}, 1000);
		}
	}

	/**
	 * Get playback statistics
	 */
	getStats(): PlaybackStats {
		return this.stats;
	}
}

/**
 * Streaming TTS + Playback
 */
async function simpleStreamingTts(
	voiceId: string,
	text: string,
	language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage = models
		.APIConvertTextToSpeechUsingCharacterRequestLanguage.Ko
): Promise<boolean> {
	console.log(`📝 "${text.slice(0, 50)}${text.length > 50 ? "..." : ""}"`);
	console.log(`📏 Text length: ${text.length} characters`);
	console.log(`🌐 Language: ${language}`);

	const player = new SimpleMpvPlayer();

	try {
		await player.startPlayer();
		player.startStreaming();

		const client = new Supertone({ apiKey: API_KEY });

		// Mark API call start
		player.markApiCallStart();
		console.log("   ⏱️  API call started...");

		const response = await client.textToSpeech.streamSpeech({
			voiceId: voiceId,
			apiConvertTextToSpeechUsingCharacterRequest: {
				text: text,
				language: language,
				outputFormat:
					models.APIConvertTextToSpeechUsingCharacterRequestOutputFormat.Wav,
				style: "neutral",
				model: "sona_speech_1",
			},
		});

		// Mark API call end (response received)
		player.markApiCallEnd();
		const apiCallTime = Date.now() - player.getStats().apiCallStartTime;
		console.log(`   ⏱️  API response received: ${apiCallTime}ms`);

		if (response?.result) {
			// Check if result is a ReadableStream
			if (
				typeof response.result === "object" &&
				"getReader" in response.result
			) {
				const reader = (
					response.result as ReadableStream<Uint8Array>
				).getReader();

				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						if (value) {
							player.addAudioChunk(value);
							await new Promise((resolve) => setTimeout(resolve, 10));
						}
					}
				} finally {
					reader.releaseLock();
				}
			} else {
				console.log("❌ Response is not a ReadableStream");
				return false;
			}

			player.finishStreaming();
			await player.waitForPlaybackComplete();

			// Print statistics
			const stats = player.getStats();
			const totalTime = Date.now() - stats.streamingStartTime;
			const apiResponseTime = stats.apiCallEndTime - stats.apiCallStartTime;
			const timeToFirstChunk = stats.firstChunkTime - stats.streamingStartTime;
			const firstChunkAfterResponse =
				stats.firstChunkTime - stats.apiCallEndTime;
			const timeToPlayback = stats.playbackStartTime - stats.streamingStartTime;

			console.log("📊 Playback Statistics:");
			console.log(
				`   🎤 Total audio duration: ${stats.estimatedDuration.toFixed(1)}s`
			);
			console.log(
				`   📡 API response time: ${apiResponseTime}ms (HTTP round-trip + init)`
			);
			console.log(
				`   📦 Time to first chunk: ${timeToFirstChunk}ms (total), ${firstChunkAfterResponse}ms (after response)`
			);
			console.log(`   🎵 Time to playback: ${timeToPlayback}ms`);
			console.log(
				`   📊 Total data: ${(stats.totalBytes / 1024).toFixed(1)}KB (${
					stats.totalChunks
				} chunks)`
			);

			return true;
		} else {
			console.log("❌ No response");
			return false;
		}
	} catch (error) {
		console.error("❌ Error:", error);
		return false;
	} finally {
		await player.stopPlayer();
	}
}

/**
 * Demo scenarios with various text lengths
 */
async function simpleDemo(): Promise<void> {
	const voiceId = "91992bbd4758bdcf9c9b01";
	const scenarios: string[] = [];
	/*[
		"안녕하세요! 심플한 테스트입니다.",

		"실시간 텍스트 음성 변환 기술은 정말 놀랍습니다. 이 기술을 통해 긴 텍스트도 즉시 음성으로 들을 수 있게 되었습니다.",

		"머신 러닝과 딥 러닝의 발전은 인공지능 분야에 혁신적인 변화를 가져왔습니다. 특히 자연어 처리 기술의 발달로 인해 텍스트 음성 변환 품질이 비약적으로 향상되었습니다. 최신 신경망 기반 TTS 모델들은 인간의 발음과 억양을 거의 구분할 수 없을 정도로 자연스럽게 모방할 수 있게 되었습니다.",

		// Scenario 300+ characters (~380 chars)
		"현대 사회에서 인공지능 기술은 우리 일상생활의 모든 영역에 스며들고 있습니다. 특히 음성 합성 기술은 시각 장애인을 위한 접근성 도구에서부터 엔터테인먼트 산업의 콘텐츠 제작까지 광범위하게 활용되고 있습니다. 실시간 스트리밍 기술과 결합된 텍스트 음성 변환 시스템은 사용자 경험을 혁신적으로 개선합니다. 사용자는 전체 텍스트의 음성 변환이 완료되기를 기다릴 필요 없이, 첫 번째 청크가 처리되는 즉시 오디오를 들을 수 있습니다. 자동 청킹 알고리즘은 텍스트를 문맥과 문장 구조를 고려하여 적절한 크기로 분할하며, 각 청크는 병렬로 처리되어 전체 응답 시간을 대폭 단축시킵니다.",

		// Scenario 500+ characters (~580 chars)
		"클라우드 컴퓨팅 환경에서의 마이크로서비스 아키텍처는 현대 소프트웨어 개발의 핵심 패러다임으로 자리잡았습니다. 모놀리식 아키텍처와 달리 마이크로서비스는 각각의 독립적인 서비스가 특정 비즈니스 기능을 담당하며, 이들이 네트워크를 통해 통신하면서 전체 애플리케이션을 구성합니다. 이러한 아키텍처의 가장 큰 장점은 확장성과 유연성입니다. 각 서비스는 독립적으로 배포되고 확장될 수 있으며, 하나의 서비스에 문제가 발생해도 전체 시스템에 미치는 영향을 최소화할 수 있습니다. 또한 서로 다른 기술 스택을 사용할 수 있어 각 서비스의 요구사항에 가장 적합한 기술을 선택할 수 있습니다. 컨테이너 기술의 발전, 특히 도커와 쿠버네티스의 등장은 마이크로서비스 배포와 관리를 더욱 효율적으로 만들었습니다. 서비스 메시와 API 게이트웨이 같은 기술들은 마이크로서비스 간의 통신을 더욱 안전하고 효율적으로 만들어줍니다.",

		// Scenario 800+ characters (~850 chars)
		"옛날 한 작은 마을에 천재적인 재능을 가진 젊은 개발자가 살고 있었습니다. 그의 이름은 민준이였고, 어릴 때부터 컴퓨터와 프로그래밍에 남다른 관심을 보였습니다. 대학에서 컴퓨터 과학을 전공한 민준은 졸업 후 스타트업에 입사했습니다. 그곳에서 그는 인공지능과 음성 기술에 대한 깊은 지식을 쌓게 되었습니다. 어느 날, 민준은 시각 장애가 있는 친구 서연을 만났습니다. 서연은 인터넷의 수많은 정보를 텍스트로만 접할 수 있어 많은 불편함을 겪고 있었습니다. 당시의 음성 합성 기술은 로봇 같은 목소리를 내며, 긴 텍스트를 읽어주려면 모든 처리가 끝날 때까지 기다려야 했습니다. 이를 본 민준은 더 자연스럽고 빠른 음성 합성 기술을 만들기로 결심했습니다. 밤낮없이 연구에 매진한 민준은 혁신적인 아이디어를 떠올렸습니다. 긴 텍스트를 작은 단위로 나누어 실시간으로 처리하고, 첫 번째 부분이 완성되는 즉시 재생을 시작하는 스트리밍 방식이었습니다. 이 기술을 구현하기 위해 그는 최신 딥러닝 모델과 신경망 아키텍처를 연구했습니다. 수많은 시행착오를 거쳐 마침내 자연스러운 음성을 실시간으로 생성할 수 있는 시스템을 완성했습니다. 그의 기술은 문장의 문맥과 감정까지 이해하여 적절한 억양과 속도로 읽어주었습니다.",
	];*/

	// Additional test scenarios for word-based and character-based chunking
	const additionalScenarios = [
		{
			// Korean text WITHOUT punctuation to test word-based chunking
			// Text length: ~450 characters (exceeds 300 char limit)
			text: "이것은 구두점 없이 매우 긴 문장을 테스트하는 것으로 삼백 글자를 초과하는 텍스트에서 단어 기반 분할이 올바르게 작동하는지 확인하기 위한 것입니다 이러한 경우 SDK는 문장 경계 대신 단어 경계를 사용하여 텍스트를 적절한 크기로 나누어야 하며 이는 사용자가 생성한 콘텐츠에서 흔히 발생할 수 있는 상황입니다 예를 들어 채팅 메시지나 비공식적인 텍스트 입력에서는 올바른 문법과 구두점이 항상 보장되지 않기 때문입니다 또한 실시간 스트리밍 환경에서는 사용자가 빠르게 입력하는 경우가 많아서 구두점을 생략하는 경우가 빈번하게 발생합니다 이러한 상황에서도 SDK는 안정적으로 텍스트를 처리하고 자연스러운 음성을 생성해야 합니다 따라서 단어 기반 분할 기능은 매우 중요한 역할을 담당합니다",
			label:
				"Long sentence without punctuation (Word-based chunking, 450+ chars)",
			category: "Word-based Chunking Test",
			language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.Ko,
		},
		{
			// Japanese text WITHOUT punctuation marks (。！？etc) to test pure character-based chunking
			// Text length: ~450 characters (exceeds 300 char limit)
			text: "日本語のテキストは通常スペースを含まないため特別な処理が必要ですこのテストは三百文字を超える長い日本語テキストが正しく処理されることを確認します自然言語処理技術の発展により音声合成の品質は大幅に向上しました特にディープラーニングを活用した最新のテキスト音声変換システムは人間の発話に非常に近い自然な音声を生成できますスペースがない言語では文字単位での分割が必要でありこのSDKはそのような状況を自動的に検出して適切に処理しますこれにより日本語中国語韓国語などのアジア言語でも問題なく長いテキストを音声に変換することができます音声合成技術は視覚障害者のためのアクセシビリティツールから対話型AIアシスタントまで幅広い用途で活用されていますさらにリアルタイムストリーミング技術と組み合わせることで待ち時間を大幅に短縮し優れたユーザー体験を提供することができます最新の音声合成技術は感情や抑揚も自然に表現できるようになりました",
			label:
				"Japanese text without spaces AND punctuation (Character-based chunking, 450+ chars)",
			category: "Character-based Chunking Test",
			language: models.APIConvertTextToSpeechUsingCharacterRequestLanguage.Ja,
		},
	];

	for (let i = 0; i < scenarios.length; i++) {
		console.log(`\n🔥 Scenario ${i + 1}/${scenarios.length}`);

		// Display category based on text length
		const textLength = scenarios[i].length;
		let category = "";
		if (textLength < 100) category = "Short Text";
		else if (textLength < 300) category = "Medium Text";
		else if (textLength < 500) category = "Long Text (300+ chars)";
		else if (textLength < 800) category = "Very Long Text (500+ chars)";
		else category = "Extra Long Text (800+ chars)";

		console.log(`📂 Category: ${category}`);
		console.log("─".repeat(50));

		const success = await simpleStreamingTts(voiceId, scenarios[i]);

		if (!success) {
			console.log(`❌ Scenario ${i + 1} failed`);
			break;
		}

		if (i < scenarios.length - 1) {
			console.log("\n⏳ Waiting...");
			await new Promise((resolve) => setTimeout(resolve, 2000));
		}
	}

	// Run additional scenarios for chunking tests
	console.log("\n" + "=".repeat(60));
	console.log("🔧 Additional Chunking Test Scenarios");
	console.log("=".repeat(60));

	for (let i = 0; i < additionalScenarios.length; i++) {
		const scenario = additionalScenarios[i];
		console.log(
			`\n🔬 Additional Scenario ${i + 1}/${additionalScenarios.length}`
		);
		console.log(`📂 Category: ${scenario.category}`);
		console.log(`📝 ${scenario.label}`);
		console.log("─".repeat(50));

		const success = await simpleStreamingTts(
			voiceId,
			scenario.text,
			scenario.language
		);

		if (!success) {
			console.log(`❌ Additional scenario ${i + 1} failed`);
		}

		if (i < additionalScenarios.length - 1) {
			console.log("\n⏳ Waiting...");
			await new Promise((resolve) => setTimeout(resolve, 2000));
		}
	}

	console.log("\n🎉 Demo completed!");
	console.log("\n📊 Tested text length ranges:");
	console.log("   • Short text: ~100 chars");
	console.log("   • Medium text: 100~300 chars");
	console.log("   • Long text: 300~500 chars");
	console.log("   • Very long text: 500~800 chars");
	console.log("   • Extra long text: 800+ chars");
	console.log("\n🔧 Chunking strategy tests:");
	console.log("   • Word-based chunking: Long sentences without punctuation");
	console.log(
		"   • Character-based chunking: Japanese/Chinese text without spaces"
	);
}

/**
 * Check if mpv is installed
 */
async function checkMpv(): Promise<boolean> {
	try {
		const test = spawn("mpv", ["--version"], { stdio: "ignore" });
		return new Promise((resolve) => {
			test.on("exit", (code) => resolve(code === 0));
			test.on("error", () => resolve(false));
		});
	} catch {
		return false;
	}
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
	console.log("🎵 Real-time TTS Player");
	console.log("=".repeat(30));

	// Check API key
	if (!API_KEY) {
		console.error("❌ API key is not configured.");
		console.error("   Please set SUPERTONE_API_KEY in the .env file.");
		process.exit(1);
	}

	if (!(await checkMpv())) {
		console.error("❌ mpv is required: brew install mpv");
		process.exit(1);
	}

	console.log("✅ Ready");

	try {
		await simpleDemo();
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

// Execute
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch(console.error);
}

export { SimpleMpvPlayer, simpleStreamingTts };
