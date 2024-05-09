import { videoInfo } from 'youtube-ext';

const youtubesearchapi = require('youtube-search-api');

interface SearchResult {
  id: string;
  type: string;
  title: string;
}

export async function getYouTube(title: string, servie: string) {
  const converKR: { [key: string]: string } = {
    naver: '네이버',
    kakao: '카카오',
  };

  const urls: string[] = [];

  const videos: SearchResult[] = (
    await youtubesearchapi.GetListByKeyword(
      `${converKR[servie]} ${title} 웹툰 리뷰`,
      true
    )
  ).items;

  const regex = new RegExp([...title.replaceAll(' ', '')].join('.*'));
  for (const video of videos) {
    const info = await videoInfo(`https://www.youtube.com/watch?v=${video.id}`);

    if (urls.length >= 4) break;
    if (!info.embed?.iframeUrl) continue;

    if (regex.test(video.title)) {
      if (video.type === 'video')
        urls.push(`https://www.youtube.com/embed/` + video.id);
      else
        urls.push(
          `https://www.youtube.com/embed/?listType=playlist&list=` + video.id
        );
    }
  }

  return urls;
}
