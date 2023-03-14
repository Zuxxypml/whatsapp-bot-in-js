var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
import { startsWithIgnoreCase } from "../utils.js";
// Config & Constants
import config from "../config.js";
// CLI
import * as cli from "../cli/ui.js";
// ChatGPT & DALLE
import { handleMessageAIConfig } from "../handlers/ai-config.js";
import { handleMessageDALLE } from "../handlers/dalle.js";
import { handleDeleteConversation, handleMessageGPT } from "../handlers/gpt.js";
// Speech API & Whisper
import { transcribeRequest } from "../providers/speech.js";
import { transcribeAudioLocal } from "../providers/whisper-local.js";
import { TranscriptionMode } from "../types/transcription-mode.js";
// For deciding to ignore old messages
import { botReadyTimestamp } from "../index.js";
// Handles message
function handleIncomingMessage(message) {
	return __awaiter(this, void 0, void 0, function* () {
		let messageString = message.body;
		// Prevent handling old messages
		if (message.timestamp != null) {
			const messageTimestamp = new Date(message.timestamp * 1000);
			// If startTimestamp is null, the bot is not ready yet
			if (botReadyTimestamp == null) {
				cli.print("Ignoring message because bot is not ready yet: " + messageString);
				return;
			}
			// Ignore messages that are sent before the bot is started
			if (messageTimestamp < botReadyTimestamp) {
				cli.print("Ignoring old message: " + messageString);
				return;
			}
		}
		// Transcribe audio
		if (message.hasMedia) {
			const media = yield message.downloadMedia();
			// Ignore non-audio media
			if (!media.mimetype.startsWith("audio/")) return;
			// Check if transcription is enabled (Default: false)
			if (!config.transcriptionEnabled) {
				cli.print("[Transcription] Received voice messsage but voice transcription is disabled.");
				return;
			}
			// Convert media to base64 string
			const mediaBuffer = Buffer.from(media.data, "base64");
			let transcribedText, transcribedLanguage;
			// Transcribe locally or with Speech API
			cli.print(`[Transcription] Transcribing audio with "${config.transcriptionMode}" mode...`);
			if (config.transcriptionMode == TranscriptionMode.Local) {
				const { text, language } = yield transcribeAudioLocal(mediaBuffer);
				transcribedText = text;
				transcribedLanguage = language;
			} else if (config.transcriptionMode == TranscriptionMode.SpeechAPI) {
				const { text, language } = yield transcribeRequest(new Blob([mediaBuffer]));
				transcribedText = text;
				transcribedLanguage = language;
			}
			// Check transcription is null (error)
			if (transcribedText == null) {
				message.reply("I couldn't understand what you said.");
				return;
			}
			// Check transcription is empty (silent voice message)
			if (transcribedText.length == 0) {
				message.reply("I couldn't understand what you said.");
				return;
			}
			// Log transcription
			cli.print(`[Transcription] Transcription response: ${transcribedText} (language: ${transcribedLanguage})`);
			// Reply with transcription
			message.reply("You said: " + transcribedText + " (language: " + transcribedLanguage + ")");
			// Handle message GPT
			yield handleMessageGPT(message, transcribedText);
			return;
		}
		// Clear conversation context (!clear)
		if (startsWithIgnoreCase(messageString, config.resetPrefix)) {
			yield handleDeleteConversation(message);
		}
		// AiConfig (!config <args>)
		if (startsWithIgnoreCase(messageString, config.aiConfigPrefix)) {
			const prompt = messageString.substring(config.aiConfigPrefix.length + 1);
			yield handleMessageAIConfig(message, prompt);
			return;
		}
		// GPT (only <prompt>)
		if (!config.prefixEnabled) {
			yield handleMessageGPT(message, messageString);
			return;
		}
		// GPT (!gpt <prompt>)
		if (startsWithIgnoreCase(messageString, config.gptPrefix)) {
			const prompt = messageString.substring(config.gptPrefix.length + 1);
			yield handleMessageGPT(message, prompt);
			return;
		}
		// DALLE (!dalle <prompt>)
		if (startsWithIgnoreCase(messageString, config.dallePrefix)) {
			const prompt = messageString.substring(config.dallePrefix.length + 1);
			yield handleMessageDALLE(message, prompt);
			return;
		}
	});
}
export { handleIncomingMessage };
//# sourceMappingURL=message.js.map
