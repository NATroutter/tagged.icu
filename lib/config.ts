export const config = {
	POCKETBASE: {
		SERVER: getEnv("PB_SERVER"),
		PUBLIC: getEnv("PB_PUBLIC_ADDRESS"),
	},
	DISCORD: {
		TOKEN: getEnv("DISCORD_BOT_TOKEN")
	}
};

export function getEnv(varName: string): string | undefined {
	return process.env[varName];
}
