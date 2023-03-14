import { ChatGPT } from "chatgpt-official";
import { Configuration, OpenAIApi } from "openai";
import config from "../config.js";
let options = {
	temperature: 0.7,
	max_tokens: config.maxModelTokens,
	top_p: 0.9,
	frequency_penalty: 0,
	presence_penalty: 0,
	// instructions: ``,
	model: "gpt-3.5-turbo" // OpenAI parameter  `gpt-3.5-turbo` is PAID
};
export const chatgpt = new ChatGPT(config.openAIAPIKey, options); // Note: options is optional
// OpenAI Client (DALL-E)
export const openai = new OpenAIApi(
	new Configuration({
		apiKey: config.openAIAPIKey
	})
);
//# sourceMappingURL=openai.js.map
