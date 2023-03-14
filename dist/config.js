import process from "process";
import { TranscriptionMode } from "./types/transcription-mode.js";
// Environment variables
import dotenv from "dotenv";
dotenv.config();
// Config
const config = {
	openAIAPIKey: process.env.OPENAI_API_KEY || "",
	maxModelTokens: getEnvMaxModelTokens(),
	prePrompt: process.env.PRE_PROMPT,
	// Prefix
	prefixEnabled: getEnvBooleanWithDefault("PREFIX_ENABLED", true),
	gptPrefix: process.env.GPT_PREFIX || "!gpt",
	dallePrefix: process.env.DALLE_PREFIX || "!dalle",
	resetPrefix: process.env.RESET_PREFIX || "!reset",
	aiConfigPrefix: process.env.AI_CONFIG_PREFIX || "!config",
	// Speech API, Default: https://speech-service.verlekar.com
	speechServerUrl: process.env.SPEECH_API_URL || "https://speech-service.verlekar.com",
	// Text-to-Speech
	ttsEnabled: getEnvBooleanWithDefault("TTS_ENABLED", false),
	// Transcription
	transcriptionEnabled: getEnvBooleanWithDefault("TRANSCRIPTION_ENABLED", false),
	transcriptionMode: getEnvTranscriptionMode() // Default: local
};
/**
 * Get the max model tokens from the environment variable
 * @returns The max model tokens from the environment variable or 4096
 */
function getEnvMaxModelTokens() {
	const envValue = process.env.MAX_MODEL_TOKENS;
	if (envValue == undefined || envValue == "") {
		return 4096;
	}
	return parseInt(envValue);
}
/**
 * Get an environment variable as a boolean with a default value
 * @param key The environment variable key
 * @param defaultValue The default value
 * @returns The value of the environment variable or the default value
 */
function getEnvBooleanWithDefault(key, defaultValue) {
	var _a;
	const envValue = (_a = process.env[key]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
	if (envValue == undefined || envValue == "") {
		return defaultValue;
	}
	return envValue == "true";
}
/**
 * Get the transcription mode from the environment variable
 * @returns The transcription mode
 */
function getEnvTranscriptionMode() {
	var _a;
	const envValue = (_a = process.env.TRANSCRIPTION_MODE) === null || _a === void 0 ? void 0 : _a.toLowerCase();
	if (envValue == undefined || envValue == "") {
		return TranscriptionMode.Local;
	}
	return envValue;
}
export default config;
//# sourceMappingURL=config.js.map
