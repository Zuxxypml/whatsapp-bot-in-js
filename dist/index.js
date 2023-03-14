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
import qrcode from "qrcode-terminal";

import pkg from "whatsapp-web.js";
const { Client, Events, LocalAuth } = pkg;

// Constants
import { constants } from "./constants.js";
// CLI
import * as cli from "./cli/ui.js";
import { handleIncomingMessage } from "./handlers/message.js";
// Ready timestamp of the bot
let botReadyTimestamp = null;
// Entrypoint
const start = () =>
	__awaiter(void 0, void 0, void 0, function* () {
		cli.printIntro();
		// WhatsApp Client
		const client = new Client({
			puppeteer: {
				args: ["--no-sandbox"]
			},
			authStrategy: new LocalAuth({
				clientId: undefined,
				dataPath: constants.sessionPath
			})
		});
		// WhatsApp auth
		client.on(Events.QR_RECEIVED, (qr) => {
			qrcode.generate(qr, { small: true }, (qrcode) => {
				cli.printQRCode(qrcode);
			});
		});
		// WhatsApp loading
		client.on(Events.LOADING_SCREEN, (percent) => {
			if (percent == "0") {
				cli.printLoading();
			}
		});
		// WhatsApp authenticated
		client.on(Events.AUTHENTICATED, () => {
			cli.printAuthenticated();
		});
		// WhatsApp authentication failure
		client.on(Events.AUTHENTICATION_FAILURE, () => {
			cli.printAuthenticationFailure();
		});
		// WhatsApp ready
		client.on(Events.READY, () => {
			// Print outro
			cli.printOutro();
			// Set bot ready timestamp
			botReadyTimestamp = new Date();
		});
		// WhatsApp message
		client.on(Events.MESSAGE_RECEIVED, (message) =>
			__awaiter(void 0, void 0, void 0, function* () {
				// Ignore if message is from status broadcast
				if (message.from == constants.statusBroadcast) return;
				// Ignore if it's a quoted message, (e.g. Bot reply)
				if (message.hasQuotedMsg) return;
				yield handleIncomingMessage(message);
			})
		);
		// Reply to own message
		client.on(Events.MESSAGE_CREATE, (message) =>
			__awaiter(void 0, void 0, void 0, function* () {
				// Ignore if message is from status broadcast
				if (message.from == constants.statusBroadcast) return;
				// Ignore if it's a quoted message, (e.g. Bot reply)
				if (message.hasQuotedMsg) return;
				// Ignore if it's not from me
				if (!message.fromMe) return;
				yield handleIncomingMessage(message);
			})
		);
		// WhatsApp initialization
		client.initialize();
	});
start();
export { botReadyTimestamp };
//# sourceMappingURL=index.js.map
