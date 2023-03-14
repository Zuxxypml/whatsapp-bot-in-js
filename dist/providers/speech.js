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
import config from "../config.js";
/**
 * @param text The sentence to be converted to speech
 * @returns Audio buffer
 */
function ttsRequest(text) {
	return __awaiter(this, void 0, void 0, function* () {
		const url = config.speechServerUrl + "/tts";
		// Request options
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				text
			})
		};
		try {
			const response = yield fetch(url, options);
			const audioBuffer = yield response.arrayBuffer();
			return Buffer.from(audioBuffer);
		} catch (error) {
			console.error("An error occured (TTS request)", error);
			return null;
		}
	});
}
/**
 * @param audioBlob The audio blob to be transcribed
 * @returns Response: { text: string, language: string }
 */
function transcribeRequest(audioBlob) {
	return __awaiter(this, void 0, void 0, function* () {
		const url = config.speechServerUrl + "/transcribe";
		// FormData
		const formData = new FormData();
		formData.append("audio", audioBlob);
		// Request options
		const options = {
			method: "POST",
			body: formData
		};
		const response = yield fetch(url, options);
		const transcription = yield response.json();
		return transcription;
	});
}
export { transcribeRequest, ttsRequest };
//# sourceMappingURL=speech.js.map
