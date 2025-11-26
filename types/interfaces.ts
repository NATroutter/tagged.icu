//*************************************
//*             Components            *
//*************************************
export interface LinkData {
	id: string;
	name: string;
	icon: string;
	url: string;
}

//*************************************
//*              Page Data            *
//*************************************
export interface Settings {
	id: string;
	profile_picture?: string;
	username: string;
	discord_id: string;
	content: string;
	links: string[];
	audio?: string;
	audio_volume: number;
	background?: string;
	bg_blur: number;
	bg_brightness: number;
	bg_card_css: string;
	content_card_css: string;
	expand: expandLinks;
}

//*************************************
//*             Expansions            *
//*************************************
export interface expandLinks {
	links: LinkData[];
}