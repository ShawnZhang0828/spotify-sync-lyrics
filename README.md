<div align="center">
    <h3 align="center">Spotify Synchronized Lyrics</h3>
    <img src="/resources/images/app-screenshot.png" width="300" height="90">
</div>

## About The Project
Spotify is a widely adopted music platform that allows users to enjoy music from a wide range of creative artists. It has a build-in lyrics display feature that presents a full-page synchronized lyrics to the user. However, for users that are only interested in a small portion of the lyrics, Spotify does not provide with such a widget that contains only a few line of the lyrics and floats on a corner of the desktop. 

This project is about making a widget mentioned above, but with extra features other than displaying lyrics. The widget is implemented as a web app. It offers a few language-related features, like converting Japanese Kanji to Hiragana and translating foreign languages to Chinese. It also supports play/pause a track and skipping back and forth within a playlist.

## Build With
* React.js
* Express

## Getting Started

### Prerequisites
* npm needs to be installed on your device
`npm install npm@latest`
* Chrome extension "Allow CORS" is required for your Chrome browser
* Clone NeteaseCloudMusicApi from [https://github.com/Binaryify/NeteaseCloudMusicApi.git](https://github.com/Binaryify/NeteaseCloudMusicApi.git)

### Installation
1. Clone the repo
`git clone https://github.com/ShawnZhang0828/spotify-sync-lyrics.git`
2. Install NPM packages
`npm install`
3. Start the NeteaseCloudMusicApi server
`node app.js`
4. Open project's root folder. run the following command
`npm start`
5. Start "Allow CORS" extension
6. Install "Spotify Lyrics" as an app and adjust window size

## Acknowledgments
* [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)