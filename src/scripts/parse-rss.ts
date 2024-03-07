import fs from 'fs'
import getPodcastFromFeed from "podparse"
import { getDoesThisCreatorExist, createRssPodcastCreator } from "../api/baserow/creators";
import { createMeditation, getMeditationsByCreatorId } from '../api/baserow/meditations';

const podcastFeedXML = fs.readFileSync('./src/scripts/example.xml', 'utf-8');
const podcastFeedXMLText = await podcastFeedXML;
const podcast = getPodcastFromFeed(podcastFeedXMLText);
const adminNote = `From RSS feed on ${(new Date()).toLocaleString()} - contact is ${podcast.meta.owner.name} at ${podcast.meta.owner.email} or ${podcast.meta.managingEditor}.`;

// TODO - make this match the Baserow way to do durations.
function getEstimateDuration(minutes: number) {
	if (!minutes) {
		return null;
	} else if (minutes < 7) {
		return '~5 mins';
	} else if (minutes > 7 && minutes < 12) {
		return '~10 mins';
	} else if (minutes > 12 && minutes < 17) {
		return '~15 mins';
	} else if (minutes > 17 && minutes < 25) {
		return '~20 mins';
	} else {
		return '30+ mins';
	}
}

function getPodcastCreator() {
	return {
		Name: podcast.meta.title,
		Avatar: podcast.meta.image.url,
		"Short Description": podcast.meta.summary,
		"Admin Notes": adminNote,
		Website: podcast.meta.link,
		Approved: true,
		"RSS Feed": podcast.meta.links.find((link) => link.rel === 'self')?.href || '',
	};
}

function getPodcasts() {
	return podcast.episodes.map((episode, index) => {
		const episodeMeditation = {
			Title: episode.title,
			Duration: episode.duration,
			"Audio File URL": episode.link,
			"Admin Notes": adminNote,
		};
		return episodeMeditation;
	})
}

const podcastCreator = getPodcastCreator();
let creator = await getDoesThisCreatorExist(podcastCreator.Name);
console.log('Checking if podcast creator exists: ' + podcastCreator.Name);
if (!creator) {
	console.log('----Podcast creator does not exist. Adding...')
	creator = await createRssPodcastCreator({
		name: podcastCreator.Name,
		adminNotes: podcastCreator["Admin Notes"],
		avatarImageUrl: podcastCreator.Avatar,
		shortDescription: podcastCreator["Short Description"],
		website: podcastCreator.Website,
		rssFeedUrl: podcastCreator["RSS Feed"],
	});
	console.log('----Added podcast creator ☑️');
} else {
	console.log('----Podcast creator exists. Skipping...')
}

const podcasts = getPodcasts();

for (let i = 0; i < podcasts.length; i += 1) {
	const podcast = podcasts[i];
	const doesMeditationExist = await getMeditationsByCreatorId({ id: creator?.id || -1, size: 1, query: podcast.Title });
	console.log('Checking if podcast exists: ' + podcast.Title);
	if (!doesMeditationExist?.count) {
		console.log('----Podcast does not exist. Adding...')
		await createMeditation({
			title: podcast.Title,
			adminNotes: podcastCreator["Admin Notes"],
			creatorId: creator?.id || -1,
			durationInSeconds: Number(podcast.Duration),
			audioFileUrl: podcast["Audio File URL"] || '',
		});
		console.log('----Added meditation ☑️');
	} else {
		console.log('----Podcast exists. Skipping...')
	}

	// This is to prevent Baserow from thinking I am DDoS'ing them.
	const randomDelay = Math.floor(Math.random() * 500) + 500;
	await new Promise((resolve) => setTimeout(resolve, randomDelay));
}
