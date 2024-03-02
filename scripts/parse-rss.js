// TODO - WORK IN PROGRESS
// This is where I will parse an RSS feed to extract the 
// following from the feed:
// - Title
// - Link
// - Description
// - Date
// - Author
// - Image 
// - Duration
// - Tags
// - Category

// const getPodcastFromFeed = require("podparse")
import getPodcastFromFeed from "podparse"

// Get podcast feed xml file from URL.
const podcastFeedXML = await fetch('https://rushpodcast.libsyn.com/rss')
const podcastFeedXMLText = await podcastFeedXML.text()
const podcast = getPodcastFromFeed(podcastFeedXMLText)

console.log(podcast.meta.title)
// "My Podcast"

podcast.episodes.forEach( (episode, index) => {
	console.log(episode.title)
	console.log('-----' + episode.link)	
	console.log('-----' + episode.pubDate)
	console.log('-----' + episode.author)
	console.log('-----' + episode.image)
	console.log('-----' + episode.duration)
	console.log('-----' + episode.tags)
	console.log('-----' + episode.category)
})
