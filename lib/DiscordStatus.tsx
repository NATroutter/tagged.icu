'use server'

//******************************************
//*           TYPES / INTERFACES           *
//******************************************

import {config} from "@/lib/config";

export type BadgeType = |
	"DISCORD_EMPLOYEE" | "PARTNERED_SERVER_OWNER" | "HYPESQUAD_EVENTS" |
	"BUG_HUNTER_LEVEL_1" | "HOUSE_BRAVERY" | "HOUSE_BRILLIANCE" | "HOUSE_BALANCE" |
	"EARLY_SUPPORTER" | "BUG_HUNTER_LEVEL_2" |"VERIFIED_DEVELOPER"| "CERTIFIED_MODERATOR" | "ACTIVE_DEVELOPER";
export interface DiscordUser {
	username: string;
	avatar: string;
	badges: Badge[];
	profile: string;
}
export interface Badge {
	id: number;
	name: string;
	url: string;
}

//******************************************
//*               VARIABLES                *
//******************************************
const DiscordBadges: Record<BadgeType, Badge> = {
	DISCORD_EMPLOYEE: {
		id: 1,
		name: "Discord Staff",
		url: "/images/discord/badges/staff.svg"
	},
	PARTNERED_SERVER_OWNER:  {
		id: 2,
		name: "Partnered Server Owner",
		url: "/images/discord/badges/partner.svg"
	},
	HYPESQUAD_EVENTS:  {
		id: 4,
		name: "HypeSquad Events",
		url: "/images/discord/badges/hypesquad_events.svg"
	},
	BUG_HUNTER_LEVEL_1:  {
		id: 8,
		name: "Discord Bug Hunter (Tier 1)",
		url: "/images/discord/badges/bug_hunter1.svg"
	},
	HOUSE_BRAVERY:  {
		id: 64,
		name: "HypeSquad Bravery",
		url: "/images/discord/badges/hypesquad_bravery.svg"
	},
	HOUSE_BRILLIANCE:  {
		id: 128,
		name: "HypeSquad Brilliance",
		url: "/images/discord/badges/hypesquad_brilliance.svg"
	},
	HOUSE_BALANCE:  {
		id: 256,
		name: "HypeSquad Balance",
		url: "/images/discord/badges/hypesquad_balance.svg"
	},
	EARLY_SUPPORTER:  {
		id: 512,
		name: "Early Supporter",
		url: "/images/discord/badges/early_supporter.svg"
	},
	BUG_HUNTER_LEVEL_2: {
		id: 16384,
		name: "Discord Bug Hunter (Tier 2)",
		url: "/images/discord/badges/bug_hunter2.svg"
	},
	VERIFIED_DEVELOPER: {
		id: 131072,
		name: "Early Verified Bot Developer",
		url: "/images/discord/badges/verified_bot_dev.svg"
	},
	CERTIFIED_MODERATOR: {
		id: 262144,
		name: "Moderator Programs Alumni",
		url: "/images/discord/badges/mod.svg"
	},
	ACTIVE_DEVELOPER: {
		id: 4194304,
		name: "Active Developer",
		url: "/images/discord/badges/active_developer.svg"
	}
};

//******************************************
//*               FUNCTIONS                *
//******************************************
export async function getDiscord(userID: string) : Promise<DiscordUser|undefined> {
	const request = await fetch(`https://discord.com/api/v10/users/${userID}`, {
		headers: {
			"Authorization": `Bot ${config.DISCORD.TOKEN}`,
			"Content-Type": "application/json"
		}
	})
	if (!request.ok){
		try {
			const resp = await request.json();
			console.log("[Error] Failed to fetch data ("+request.status+"): ["+resp.code+"] " + resp.message)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			console.log("[Error] Failed to fetch data ("+request.status+"): " + request.statusText)
		}
		return undefined;
	}
	const data = await request.json();
	if (!data) return undefined;

	const badges = decodeBadge(data.public_flags);

	if (data.avatar) {
		data.avatar = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}${data.avatar.startsWith("_a") ? ".gif" : ".png"}`
	} else {
		data.avatar = "https://cdn.discordapp.com/embed/avatars/0.png";
	}

	return {
		username: data.username,
		avatar: data.avatar,
		badges: badges,
		profile: `https://discord.com/users/${data.id}`
	};
}

//******************************************
//*               UTILITIES                *
//******************************************

function decodeBadge(flag: number): Badge[] {
	const userBadges: Badge[] = [];
	for (const key in DiscordBadges) {
		const badge = DiscordBadges[key as BadgeType];
		if ((flag & badge.id) === badge.id) {
			userBadges.push(badge);
		}
	}
	return userBadges;
}