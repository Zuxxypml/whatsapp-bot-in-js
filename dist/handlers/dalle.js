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
import pkg from "whatsapp-web.js";
const { MessageMedia } = pkg;

import * as cli from "../cli/ui.js";
import { aiConfig } from "../handlers/ai-config.js";
import { openai } from "../providers/openai.js";
const handleMessageDALLE = (message, prompt) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const start = Date.now();
			cli.print(`[DALL-E] Received prompt from ${message.from}: ${prompt}`);
			// Send the prompt to the API
			const response = yield openai.createImage({
				prompt: prompt,
				n: 1,
				size: aiConfig.dalle.size,
				response_format: "b64_json"
			});
			const end = Date.now() - start;
			const base64 = response.data.data[0].b64_json;
			const image = new MessageMedia("image/jpeg", base64, "image.jpg");
			cli.print(`[DALL-E] Answer to ${message.from} | OpenAI request took ${end}ms`);
			message.reply(image);
		} catch (error) {
			console.error("An error occured", error);
			message.reply("An error occured, please contact the administrator. (" + error.message + ")");
		}
	});
export { handleMessageDALLE };
//# sourceMappingURL=dalle.js.map
