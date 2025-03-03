import type { Config } from "tailwindcss";

import tailwindcssMotion from "tailwindcss-motion";

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: '#2a2a2a',
				text: 'white',
				theme: '#02abec',
				card: 'rgb(20 20 23 / 31%)',
				border: 'rgb(120 114 109 / 13%)',
				scroll_bar: '#20252a',
				scroll_bg: '#272d33'
			},
			boxShadow: {
				card: '0 0 25px rgb(9 9 9 / 31%)',
				button: 'hsl(355 81% 46% / 1) 0 0 20px 2px'
			},
			dropShadow: {
				theme: '0 0 2px #ffffff'
			},
		}
	},
	plugins: [tailwindcssMotion],
} satisfies Config;