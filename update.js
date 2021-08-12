var fs = require('fs');
var readline = require('readline');
var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];
var TOKEN_PATH = 'credentials.json';

const youtube = google.youtube("v3");
const videoId = 'g6XMCUvhOcE';


// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content), getVideoInfo);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) throw err;
        console.log('Token stored to ' + TOKEN_PATH);
    });
}

/**
 * Retrieves video info from youtube API
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const getVideoInfo = auth => {
    youtube.videos.list({
        auth: auth,
        part: 'snippet,statistics',
        id: videoId
    },
    (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        if (response.data.items[0]) {
            console.log('Video retrieved, now commencing title update');
            updateVideoTitle(response.data.items[0], auth);
        }
    });
}

/**
 * Updates the video title
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const updateVideoTitle = (myVideo, auth) => {
  let views = myVideo.statistics.viewCount;
  let likes = myVideo.statistics.likeCount;
  let newTitle = `This video has ${views} views and ${likes} likes!`;
  console.log('The old video title is: ' + myVideo.snippet.title);
  myVideo.snippet.title = newTitle;
  console.log('The new video title is: ' + myVideo.snippet.title);
  youtube.videos.update(
    {
      auth: auth,
      part: 'snippet,statistics',
      resource: myVideo,
    },
    (err, response) => {
        if (err) {
            console.log('Error updating video title: \n' + err);
            return;
        }
        console.log('Completed Update!\n');
    });
}
