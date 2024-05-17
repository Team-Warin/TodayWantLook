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
    .match({ id: user.user.id })
    .single();

  if (dbUser!.roles.includes('newbie')) {
    await supabase
      .schema('next_auth')
      .from('users')
      .update({
        roles: dbUser!.roles.filter((role: string) => role !== 'newbie'),
      })
      .match({ id: user.user.id });
  }

  medias.forEach(async (media: MediaData) => {
    const likeInDb = async () => {
      const { data: inData } = await supabase
        .schema('next_auth')
        .from('users_ratings')
        .select('*')
        .match({ userId: user.user.id, mediaId: media.mediaId })
        .single();

      if (inData === null) {
        await supabase
          .schema('next_auth')
          .from('users_ratings')
          .insert({
            userId: user.user.id,
            mediaId: media.mediaId,
            genre: media.genre,
            checks: {
              view: false,
              like: true,
              rating: false,
            },
          });
        return undefined;
      }
      return inData;
    };

    const data = await likeInDb();

    if (data!.checks.like) {
      data!.checks.like = true;

      await supabase
        .schema('next_auth')
        .from('users_ratings')
        .update(data!)
        .match({ userId: user.user.id, mediaId: media.mediaId });
    }
  });
}
