'use strict';
const { google } = require('googleapis');
const extractTime = require('../utilities.js/translate_duration_from_api.js');
const url = require('url');
const querystring = require('querystring');

class YoutubeVideoFetcher {
  constructor() {
    this.api = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });
    this.playlist = {};
    this.author = {};
    this.items = [];
  }
  async fetchList(playlistUrl) {
    const query = url.parse(playlistUrl).query;
    const { list: id } = querystring.parse(query);
    const playListItems = await this.api.playlistItems
      .list({
        part: 'contentDetails',
        maxResults: 1000,
        playlistId: id,
      })
      .catch(err => {
        console.log('[error] Something bad happened.');
        console.log('[error-info]', err);
        throw { code: -1, msg: 'Something bad happened.' };
      });
    // extract videos ids
    const videos = playListItems.data.items.map(item => item.contentDetails.videoId).join(',');
    const extracedVideos = await this.api.videos
      .list({
        part: ['contentDetails', 'snippet'],
        id: videos,
      })
      .catch(err => {
        console.log('[error] Something bad happened.');
        console.log('[error-info]', err);
        throw { code: -1, msg: 'Something bad happened.' };
      });

    const playlists = await this.api.playlists
      .list({
        part: ['snippet'],
        id,
      })
      .catch(err => {
        console.log('[error] Something bad happened.');
        console.log('[error-info]', err);
        throw { code: -1, msg: 'Something bad happened.' };
      });

    this.playlist = {
      url: playlistUrl,
      playlist_title: playlists.data.items[0].snippet.title,
      description: playlists.data.items[0].snippet.description,
      thumbnail: playlists.data.items[0].snippet.thumbnails.medium.url,
    };
    this.author = {
      name: playlists.data.items[0].snippet.channelTitle,
      channel_url: `https://www.youtube.com/channel/${playlists.data.items[0].id}`,
    };
    // console.log(this.playlist);
    // console.log(this.author);
    this.items = extracedVideos.data.items.map(item => {
      return {
        url_simple: `https://www.youtube.com/watch?v=${item.id}`,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        video_id: item.id,
        duration: extractTime(item.contentDetails.duration),
      };
    });
    return {
      playlist: this.playlist,
      author: this.author,
      items: this.items,
    };
  }
}

module.exports = YoutubeVideoFetcher;
