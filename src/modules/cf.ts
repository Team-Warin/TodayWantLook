import type { MediaData } from '@/types/media';

import { CreateClient } from './supabase';

const { CF } = require('nodeml');

export default async function CF_Media(
  maxRelatedItem: number,
  maxRelatedUser: number,
  userId: string,
  medias: MediaData[]
): Promise<MediaData[] | null> {
  const cf = new CF();
  const supabase = CreateClient();
  const { data } = await supabase
    .schema('next_auth')
    .from('users_ratings')
    .select('*');

  cf.maxRelatedItem = maxRelatedItem;
  cf.maxRelatedUser = maxRelatedUser;

  cf.train(data, 'userId', 'mediaId', 'rate');

  const recommendResult = cf.recommendToUser(userId, medias);

  let mediaList: MediaData[] = [];

  for (let item of recommendResult) {
    const { data: media } = await supabase
      .schema('todaywantlook')
      .from('medias')
      .select('*')
      .match({ mediaId: item.itemId })
      .single();

    if (media !== null) mediaList.push(media);
  }

  return mediaList;
}
