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
import { aiConfigTarget, aiConfigTypes, aiConfigValues } from "../types/ai-config.js";
import { dalleImageSize } from "../types/dalle-config.js";
const aiConfig = {
	dalle: {
		size: dalleImageSize["512x512"]
	}
	// chatgpt: {}
};
const handleMessageAIConfig = (message, prompt) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			console.log("[AI-Config] Received prompt from " + message.from + ": " + prompt);
			const args = prompt.split(" ");
			/*
            !config
            !config help
        */
			if (args.length == 1 || prompt === "help") {
				let helpMessage = "Available commands:\n";
				for (let target in aiConfigTarget) {
					for (let type in aiConfigTypes[target]) {
						helpMessage += `\t!config ${target} ${type} <value> - Set ${target} ${type} to <value>\n`;
					}
				}
				helpMessage += "\nAvailable values:\n";
				for (let target in aiConfigTarget) {
					for (let type in aiConfigTypes[target]) {
						helpMessage += `\t${target} ${type}: ${Object.keys(aiConfigValues[target][type]).join(", ")}\n`;
					}
				}
				message.reply(helpMessage);
				return;
			}
			// !config <target> <type> <value>
			if (args.length !== 3) {
				message.reply(
					"Invalid number of arguments, please use the following format: <target> <type> <value> or type !config help for more information."
				);
				return;
			}
			const target = args[0];
			const type = args[1];
			const value = args[2];
			if (!(target in aiConfigTarget)) {
				message.reply("Invalid target, please use one of the following: " + Object.keys(aiConfigTarget).join(", "));
				return;
			}
			if (!(type in aiConfigTypes[target])) {
				message.reply("Invalid type, please use one of the following: " + Object.keys(aiConfigTypes[target]).join(", "));
				return;
			}
			if (!(value in aiConfigValues[target][type])) {
				message.reply("Invalid value, please use one of the following: " + Object.keys(aiConfigValues[target][type]).join(", "));
				return;
			}
			aiConfig[target][type] = value;
			message.reply("Successfully set " + target + " " + type + " to " + value);
		} catch (error) {
			console.error("An error occured", error);
			message.reply("An error occured, please contact the administrator. (" + error.message + ")");
		}
	});
export { aiConfig, handleMessageAIConfig };
//# sourceMappingURL=ai-config.js.map
