# YouTubeViewUpdater
## Update
This code is still functional as described, but my video is now being updated using a Google Apps Script that I created which can be found here: https://gist.github.com/PA2000/97c535b2bfcf6d52144bd70f038ee823
## Description
This application changes the title of my video to reflect the current number of views and likes: https://www.youtube.com/watch?v=g6XMCUvhOcE. \
The program reads in the credentials to make sure all operations are authorized, then makes a call to the YouTube API to get the current video information. That information is then used to update the title assuming the amount of views or likes has changed. This process happens in alternating intervals of 8-9 minutes.\
Ideally this process would be able to occur more frequently, but Youtube has a quota on the number of calls one can make to their API.
## Credentials
Note that this code is programmed to work with my credentials and OAuth token which are stored locally as environment variables. For obvious security reasons, I am not uploading the enviornment variables file that contains said information to Github. That means that you may be able to use this code as a template but you will need to generate your own credentials.
## How this program is run
Run with: 'node update.js' or 'node update.js > update.log 2>&1' for logging
