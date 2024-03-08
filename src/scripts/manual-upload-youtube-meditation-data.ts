import { createMeditation, getMeditationsByCreatorId } from '../api/baserow/meditations';


/** ADD DATA BELOW */
const ADMIN_NOTE = 'This was scraped from YouTube manually on ' + (new Date()).toLocaleString() + ' by Cam Pak.';
const MEDITATION_DATA = [
	{
		"Title": "You Shall Prosper! Experience God with Biblical Meditation",
		"Duration": 976,
		"YouTube Video URL": "https://www.youtube.com/watch?v=_N3rzMpURHw&t=68s"
	},
	{
		"Title": "Experience God’s Perfect Peace | Guided Meditation Session",
		"Duration": 950,
		"YouTube Video URL": "https://www.youtube.com/watch?v=5_hGDvvt52M"
	},
	{
		"Title": "Come and Find Rest | A Guided Meditation for Christians",
		"Duration": 787,
		"YouTube Video URL": "https://www.youtube.com/watch?v=RdM5d8JbtFs"
	},
	{
		"Title": "Experience God’s Majesty: A Biblically-Based, Guided Meditation",
		"Duration": 1059,
		"YouTube Video URL": "https://www.youtube.com/watch?v=g9FjS0-uGH8"
	},
	{
		"Title": "Wash Over Me, Holy Spirit: A Guided Meditation for Christians",
		"Duration": 1023,
		"YouTube Video URL": "https://www.youtube.com/watch?v=TgfZECVJEFM&t=272s"
	},
	{
		"Title": "Heavenly Peace - 16 Minute Christian Meditation",
		"Duration": 1022,
		"YouTube Video URL": "https://www.youtube.com/watch?v=i1PMofR9Qio"
	},
	{
		"Title": "16 Minute Christian Meditation - Fill Me Up Holy Spirit!",
		"Duration": 1002,
		"YouTube Video URL": "https://www.youtube.com/watch?v=xD2YL-B0JNU"
	},
	{
		"Title": "Focus on the Eyes of Jesus - 10 Minute Guided Meditation for Christians",
		"Duration": 584,
		"YouTube Video URL": "https://www.youtube.com/watch?v=yAnsLBmbGns"
	},
	{
		"Title": "Come Holy Spirit - A Guided Christian Meditation",
		"Duration": 559,
		"YouTube Video URL": "https://www.youtube.com/watch?v=drsAndPV39E"
	},
	{
		"Title": "May His Peace Rule - 18 Minute Meditation",
		"Duration": 981,
		"YouTube Video URL": "https://www.youtube.com/watch?v=P4qmUtB5WiM"
	},
	{
		"Title": "Deep Meditation with God | 10 Minutes | Christian & Biblical",
		"Duration": 588,
		"YouTube Video URL": "https://www.youtube.com/watch?v=YcnkSwqw8WI"
	},
	{
		"Title": "Meditation & Worship - 16 Minutes",
		"Duration": 956,
		"YouTube Video URL": "https://www.youtube.com/watch?v=YNE8jxBd_Lk"
	},
	{
		"Title": "Seek My Face - 16 Min Christian Meditation",
		"Duration": 1030,
		"YouTube Video URL": "https://www.youtube.com/watch?v=XqDxJ05oVqA"
	},
	{
		"Title": "12 Minute Meditation on Hearing God",
		"Duration": 737,
		"YouTube Video URL": "https://www.youtube.com/watch?v=TQVvv1GjJu8"
	},
	{
		"Title": "Christian Meditation // You Know Me by Name (11 Min)",
		"Duration": 727,
		"YouTube Video URL": "https://www.youtube.com/watch?v=lDX0ysU3HtA"
	},
	{
		"Title": "We Shall Be Like Him - 14 Minute Christian Meditation",
		"Duration": 866,
		"YouTube Video URL": "https://www.youtube.com/watch?v=JQcPmjkA7Kc"
	},
	{
		"Title": "7 Minute Guided Christian Meditation | Freedom",
		"Duration": 408,
		"YouTube Video URL": "https://www.youtube.com/watch?v=6dkNg3yjAe0"
	},
	{
		"Title": "There is Joy in His Presence // Biblical Meditation for Peace & Growth",
		"Duration": 722,
		"YouTube Video URL": "https://www.youtube.com/watch?v=ADu85a85qOU"
	},
	{
		"Title": "Christian Meditation - Knowing God More Deeply",
		"Duration": 804,
		"YouTube Video URL": "https://www.youtube.com/watch?v=-6XiFKR1d6E"
	},
	{
		"Title": "Getting to Know the Holy Spirit // Guided Meditation for Peace & Intimacy",
		"Duration": 771,
		"YouTube Video URL": "https://www.youtube.com/watch?v=DOIVxfqatNU"
	},
	{
		"Title": "13 Minute Meditation // His Peace Will Guard Your Mind",
		"Duration": 838,
		"YouTube Video URL": "https://www.youtube.com/watch?v=jhhUf43Ebv4"
	},
	{
		"Title": "15 Minute Meditation // Be Consumed with the Presence of God",
		"Duration": 975,
		"YouTube Video URL": "https://www.youtube.com/watch?v=PzAfmwYn5IE"
	},
	{
		"Title": "You Were Made for God // 13 Minute Meditation for Christians",
		"Duration": 795,
		"YouTube Video URL": "https://www.youtube.com/watch?v=XlDtgMdnY-0"
	},
	{
		"Title": "Come and Behold the Holy Spirit // Peaceful Meditation for Contemplation",
		"Duration": 828,
		"YouTube Video URL": "https://www.youtube.com/watch?v=7oGO1_VhDdA"
	},
	{
		"Title": "Find Peace in His Presence // 50 Minute Guided Christian Meditation",
		"Duration": 3135,
		"YouTube Video URL": "https://www.youtube.com/watch?v=x76qBvtTN80"
	},
	{
		"Title": "40 Minute Guided Christian Meditation // Words of Life",
		"Duration": 2847,
		"YouTube Video URL": "https://www.youtube.com/watch?v=JEe29BZ8cNs"
	},
	{
		"Title": "40 Minute Guided Christian Meditation // Overflowing with God",
		"Duration": 2978,
		"YouTube Video URL": "https://www.youtube.com/watch?v=xDWq_Jkhu6Q"
	},
	{
		"Title": "10 Minute Guided Christian Meditation // God's Touch",
		"Duration": 608,
		"YouTube Video URL": "https://www.youtube.com/watch?v=w8ad-Leqaho"
	},
	{
		"Title": "10 Minute Guided Meditation on Freedom",
		"Duration": 627,
		"YouTube Video URL": "https://www.youtube.com/watch?v=0XSSIkk3HgM"
	},
	{
		"Title": "Filled with God | 12 Minute Guided Christian Meditation",
		"Duration": 762,
		"YouTube Video URL": "https://www.youtube.com/watch?v=JLTJxGYVE9s"
	}
];

const PODCAST_CREATOR_ID = 4;
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
