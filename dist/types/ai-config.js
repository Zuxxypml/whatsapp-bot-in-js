import { dalleConfigType, dalleImageSize } from "./dalle-config.js";
export var aiConfigTarget;
(function (aiConfigTarget) {
	aiConfigTarget["dalle"] = "dalle";
	// chatgpt = "chatgpt"
})(aiConfigTarget || (aiConfigTarget = {}));
export const aiConfigTypes = {
	dalle: dalleConfigType
};
export const aiConfigValues = {
	dalle: {
		size: dalleImageSize
	}
};
//# sourceMappingURL=ai-config.js.map
