require('dotenv').config();

var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;

const cron = require('node-cron');

const youtube = google.youtube("v3");
const videoId = process.env.VIDEO_ID;

async function main() {
    try {
      const auth = authorize();
      const {resource, title, views, likes} = await getVideoInfo(auth);
      console.log('Retrieved video info: ' + title)
      const newTitle = `This video has ${views} views and ${likes} likes!`;
      if(newTitle === title) console.log('Views & Likes have not changed! No need to update the title!\n');
      else console.log('The new video title is: ' + await updateVideoTitle(resource, auth, newTitle) + '\n');
    }
    catch (e) {
      console.log(e);
    }
}

/**
 * Creates and returns an OAuth2 client with the given credentials
 */
function authorize() {
    const credentials = JSON.parse(process.env.CLIENT_SECRET)
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    oauth2Client.credentials = JSON.parse(process.env.OAUTH_TOKEN);
    return oauth2Client;
}

/**
 * Retrieves video info from youtube API
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const getVideoInfo = auth => {
    return new Promise((resolve, reject) => {
      youtube.videos.list({
          auth: auth,
          part: 'snippet,statistics',
          id: videoId
      },
      (err, response) => {
          if (err) return reject(err);
          resolve({
              resource: response.data.items[0],
              title: response.data.items[0].snippet.title,
              views: response.data.items[0].statistics.viewCount,
              likes: response.data.items[0].statistics.likeCount,
          });
      })
    })
}

/**
 * Updates the video title
 *
 * @param {video} myVideo The video that we are updating, used as the resource.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {String} newTitle The new title for the video
 */
const updateVideoTitle = (myVideo, auth, newTitle) => {
    return new Promise((resolve, reject) => {
      myVideo.snippet.title = newTitle;
      youtube.videos.update({
          auth: auth,
          part: 'snippet, statistics',
          resource: myVideo,
      }, (err, response) => {
          if (err) return reject(err);
          resolve(response.data.snippet.title);
      })
    })
}

const task = cron.schedule('8 17,25,34,42,51,59 * * * *', () => {
    console.log('Running Update: ' + Date());
    main();
}, {
    scheduled: true
});
task.start();
