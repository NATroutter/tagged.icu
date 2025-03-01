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
export interface HomePage {
	id: string;
	username: string;
	content: string;
	links: string[];
	expand: expandLinks;
}

//*************************************
//*             Expansions            *
//*************************************
export interface expandLinks {
	links: LinkData[];
}