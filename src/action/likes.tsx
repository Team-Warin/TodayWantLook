'use server';

import type { MediaData } from '@/types/media';

import { CreateServerClient } from '@/modules/supabase';

import { auth } from '@/auth';

export default async function addLikes(medias: MediaData[]) {
  const user = await auth();

  if (!user) throw new Error('Use Not Permissions');
  if (medias.length < 1) throw new Error('Bad Request');

  const supabase = CreateServerClient();
  let { data: dbUser } = await supabase
    .schema('next_auth')
    .from('users')
    .select('*')
    .eq('id', user.user.id);

  if (dbUser) {
    if (dbUser[0].roles.includes('newbie')) {
      await supabase
        .schema('next_auth')
        .from('users')
        .update({
          roles: dbUser[0].roles.filter((role: string) => role !== 'newbie'),
        })
        .eq('id', user.user.id);
    }
  }
  medias.forEach(async (media: MediaData) => {
    const likeInDb = async () => {
      let { data: inData, error } = await supabase
        .schema('next_auth')
        .from('users_ratings')
        .select('*')
        .match({ userId: user.user.id, mediaId: media.mediaId });

      if (inData) {
        if (inData.length < 1) {
          await supabase
            .schema('next_auth')
            .from('users_ratings')
            .insert({
              userId: user.user.id,
              mediaId: media.mediaId,
              genre: media.genre,
              rate: 5,
              checks: {
                view: false,
                like: true,
                rating: false,
              },
            });
        } else {
          return inData[0];
        }
      }
    };

    const data = await likeInDb();
    if (data) {
      if (!data.checks.like) {
        data.checks.like = true;

        await supabase
          .schema('next_auth')
          .from('users_ratings')
          .update(data)
          .match({ userId: user.user.id, mediaId: media.mediaId });
      }
    }
  });
}
