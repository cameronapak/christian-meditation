import fs from 'fs'
import getPodcastFromFeed from "podparse"

const podcastFeedXML = fs.readFileSync('./src/scripts/example.xml', 'utf-8');
const podcastFeedXMLText = await podcastFeedXML;
const podcast = getPodcastFromFeed(podcastFeedXMLText);
const adminNote = `From RSS feed on ${(new Date()).toLocaleString()} - contact is ${podcast.meta.owner.name} at ${podcast.meta.owner.email} or ${podcast.meta.managingEditor}.`;

// TODO - make this match the Baserow way to do durations.
function getEstimateDuration(minutes) {
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
		"RSS Feed": podcast.meta.links.find((link) => link.rel === 'self').href,
	};
}

function getPodcasts() {
	return podcast.episodes.map((episode, index) => {
		const episodeMeditation = {
			Title: episode.title,
			Duration: getEstimateDuration(Math.floor(episode.duration / 60)),
			"Audio File URL": episode.link,
			"Admin Notes": adminNote,
		};
		return episodeMeditation;
	})
}

// TODO
//
// Check if Creator exists in Baserow.
// - if not, add them.
//   - then, keep the Baserow id.
// - if they do, great, keep the Baserow id for them.
//
// // Instead of trying to store date of when I last parsed the 
// // episodes, instead just wipe and replace all.
// 
// Get all episodes from that Creator's Baserow data.
// Map over every single episode from the RSS feed
// and see if there are any episodes that match in title
// or episode audio listen URL.
// - if episode matches existing one, skip it.
// - if not, then add the new episode!
