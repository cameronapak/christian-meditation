// For now, just copy and paste this script into the console.
const youTubeVideoEls = document.querySelectorAll('ytd-rich-item-renderer');

const videoMeditationData = Array.from(youTubeVideoEls).map((el) => {
    const videoDataObj = {};
    const timeMMSS = el.querySelector('#time-status #text').innerText;
    const timeRegex = timeMMSS.match(/(?<hours>\d+:)?(?<mins>\d+):(?<secs>\d\d)/)
    let durationInSeconds = 0;
    
    const { hours, mins, secs } = timeRegex.groups;
    if (hours) {
        const hoursAsNum = Number(hours);
        durationInSeconds += (hours * 60 * 60);
    }
    if (mins) {
        const minsAsNum = Number(mins);
        durationInSeconds += (mins * 60);
    }
    if (secs) {
        const secsAsNum = Number(secs);
        durationInSeconds += secsAsNum;
    }
    
    const videoTitleLinkEl = el.querySelector('a#video-title-link');
    
    const link = window.location.origin + videoTitleLinkEl.getAttribute('href');
    const title = videoTitleLinkEl.getAttribute('title');

    videoDataObj.Title = title;
    videoDataObj.Duration = durationInSeconds;
    videoDataObj['YouTube Video URL'] = link;

    return videoDataObj;
})

console.log(videoMeditationData);
