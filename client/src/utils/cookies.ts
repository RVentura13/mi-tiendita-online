export const setCookie = (name: string, value: string, days: number = 1): void => {
	const expires = new Date();
	expires.setDate(expires.getDate() + days);
	document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Strict; Secure`;
};

export const getCookie = (name: string): string | null => {
	const cookies = document.cookie.split('; ');
	for (const cookie of cookies) {
		const [key, value] = cookie.split('=');
		if (key === name) {
			return value;
		}
	}
	return null;
};

export const deleteCookie = (name: string): void => {
	document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict; Secure`;
};
