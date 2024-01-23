export function uid() {
	const letters = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const allowedChars = "0123456789" + letters;
	const NUMBER_OF_CODEPOINTS = allowedChars.length;
	const CODESIZE = 11;
	let uid;
	uid = letters.charAt(Math.random() * letters.length);
	for (let i = 1; i < CODESIZE; ++i) {
		uid += allowedChars.charAt(Math.random() * NUMBER_OF_CODEPOINTS);
	}
	return uid;
}

export function getTextColorFromBackgroundColor(background: string): string {
	if (background.startsWith("#")) {
		background = background.slice(1);
	}
	const r = parseInt(background.substr(0, 2), 16);
	const g = parseInt(background.substr(2, 2), 16);
	const b = parseInt(background.substr(4, 2), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	if (luminance > 0.5) {
		return "black"; // bright background, use dark text
	} else {
		return "white"; // dark background, use bright text
	}
}
