import { createMeditation, getMeditationsByCreatorId } from '../api/baserow/meditations';


/** ADD DATA BELOW */
const ADMIN_NOTE = 'This was scraped from YouTube manually on ' + (new Date()).toLocaleString() + ' by Cam Pak.';
const MEDITATION_DATA: { Duration: number, Title: string, "YouTube Video URL"?: string }[] = [];
const PODCAST_CREATOR_ID = 3;
/** ADD DATA ABOVE */

for (let i = 0; i < MEDITATION_DATA.length; i += 1) {
	const meditationFromYouTube = MEDITATION_DATA[i];
	const doesMeditationExist = await getMeditationsByCreatorId({ id: PODCAST_CREATOR_ID, size: 1, query: meditationFromYouTube.Title });
	console.log('Checking if podcast exists: ' + meditationFromYouTube.Title);
	if (!doesMeditationExist?.count) {
		console.log('----Podcast does not exist. Adding...')
		await createMeditation({
			title: meditationFromYouTube.Title,
			adminNotes: ADMIN_NOTE,
			creatorId: PODCAST_CREATOR_ID,
			durationInSeconds: Number(meditationFromYouTube.Duration),
			youTubeVideoUrl: meditationFromYouTube["YouTube Video URL"] || '',
		});
		console.log('----Added meditation ☑️');
	} else {
		console.log('----Podcast exists. Skipping...')
	}

	// This is to prevent Baserow from thinking I am DDoS'ing them.
	const randomDelay = Math.floor(Math.random() * 500) + 500;
	await new Promise((resolve) => setTimeout(resolve, randomDelay));
}
