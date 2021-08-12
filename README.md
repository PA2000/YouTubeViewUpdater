# YouTubeViewUpdater
This application changes the title of my video to reflect the current number of views: https://www.youtube.com/watch?v=g6XMCUvhOcE. 
The code that is running on my server is slightly different than what you see here, in that it includes a scheduler that I built to have the video update its title every 10 seconds.
Ideally I would be able to update the title every second, but Youtube has a quota on the number of calls one can make to their API.
