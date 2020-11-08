async function makePlaylist(playlist) {
  playlist = new playlistModel({
    url: playlist.url,
    playlist_title: playlist.playlist_title,
    description: playlist.description,
    total_items: playlist.total_items,
  });

  return playlist;
}

function makeSections(sections) {
  return sections.map(section => {
    {
      const newVideos = section.videos.map(makeVideos);
      // console.log('__videos__', newVideos);
      section.section_title;
      return new sectionModel({ section_title: section.section_title, videos: newVideos });
    }
  });
}

function makeVideos(video) {
  return new videoModel({
    url_simple: video.url_simple,
    title: video.title,
    thumbnail: video.thumbnail,
    duration: video.duration,
    video_id: video.video_id,
  });
}

function makeAuthor(author) {
  return new authorModel({
    name: author.name,
    channel_url: author.channel_url,
  });
}
