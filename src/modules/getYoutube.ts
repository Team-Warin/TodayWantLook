import axios from 'axios';

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
      true,
      40
    )
  ).items;

  const regex = new RegExp([...title.replaceAll(' ', '')].join('.*'));
  const promise = videos.map(async (video) => {
    if (urls.length >= 4) return;

    const embed = (
      await axios.get(`https://cheetube.netlify.app/api/watch/${video.id}`)
    ).data.player.embed;

    if (!embed) return;

    if (regex.test(video.title)) {
      if (video.type === 'video')
        urls.push(`https://www.youtube.com/embed/` + video.id);
      else
        urls.push(
          `https://www.youtube.com/embed/?listType=playlist&list=` + video.id
        );
    }
  });

  await Promise.all(promise);

  return urls;
}
