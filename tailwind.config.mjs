/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			container: {
				center: true,
				padding: '24px',
				maxWidth: '1000px',
			},
		},
	},
	// https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
	// For dark mode to work now, you must apply the .dark class to a parent
	// HTML element. All children classes will be dark mode.
	darkMode: 'selector',
	// Change your theme at https://daisyui.com/docs/themes/.
	daisyui: {
		themes: ["retro"]
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("daisyui")
	],
}
