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
import { randomUUID } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

import * as cli from "../cli/ui.js";
import config from "../config.js";
import { chatgpt } from "../providers/openai.js";
import { ttsRequest } from "../providers/speech.js";
// Mapping from number to last conversation id
const conversations = {};
const handleMessageGPT = (message, prompt) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			// Get last conversation
			const lastConversationId = conversations[message.from];
			cli.print(`[GPT] Received prompt from ${message.from}: ${prompt}`);
			const start = Date.now();
			// Check if we have a conversation with the user
			let response;
			if (lastConversationId) {
				// Handle message with previous conversation
				response = yield chatgpt.ask(prompt, lastConversationId);
			} else {
				// Create new conversation
				const convId = randomUUID();
				const conv = chatgpt.addConversation(convId);
				// Set conversation
				conversations[message.from] = conv.id;
				cli.print(`[GPT] New conversation for ${message.from} (ID: ${conv.id})`);
				// Pre prompt
				if (config.prePrompt != null) {
					cli.print(`[GPT] Pre prompt: ${config.prePrompt}`);
					const prePromptResponse = yield chatgpt.ask(config.prePrompt, conv.id);
					cli.print("[GPT] Pre prompt response: " + prePromptResponse);
				}
				// Handle message with new conversation
				response = yield chatgpt.ask(prompt, conv.id);
			}
			const end = Date.now() - start;
			cli.print(`[GPT] Answer to ${message.from}: ${response}  | OpenAI request took ${end}ms)`);
			// TTS reply (Default: disabled)
			if (config.ttsEnabled) {
				sendVoiceMessageReply(message, response);
				return;
			}
			// Default: Text reply
			message.reply(response);
		} catch (error) {
			console.error("An error occured", error);
			message.reply("An error occured, please contact the administrator. (" + error.message + ")");
		}
	});
const handleDeleteConversation = (message) =>
	__awaiter(void 0, void 0, void 0, function* () {
		// Delete conversation
		delete conversations[message.from];
		// Reply
		message.reply("Conversation context was resetted!");
	});
function sendVoiceMessageReply(message, gptTextResponse) {
	return __awaiter(this, void 0, void 0, function* () {
		// Get audio buffer
		cli.print(`[Speech API] Generating audio from GPT response "${gptTextResponse}"...`);
		const audioBuffer = yield ttsRequest(gptTextResponse);
		cli.print("[Speech API] Audio generated!");
		// Check if audio buffer is valid
		if (audioBuffer == null || audioBuffer.length == 0) {
			message.reply("Speech API couldn't generate audio, please contact the administrator.");
			return;
		}
		// Get temp folder and file path
		const tempFolder = os.tmpdir();
		const tempFilePath = path.join(tempFolder, randomUUID() + ".opus");
		// Save buffer to temp file
		fs.writeFileSync(tempFilePath, audioBuffer);
		// Send audio
		const messageMedia = new MessageMedia("audio/ogg; codecs=opus", audioBuffer.toString("base64"));
		message.reply(messageMedia);
		// Delete temp file
		fs.unlinkSync(tempFilePath);
	});
}
export { handleDeleteConversation, handleMessageGPT };
//# sourceMappingURL=gpt.js.map
