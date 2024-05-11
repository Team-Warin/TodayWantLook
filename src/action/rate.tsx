'use server';

import { auth } from '@/auth';

import { CreateServerClient } from '@/modules/supabase';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

export async function Rate(mediaId: string, type: 'like' | 'comment') {
  const user = await auth();

  if (!user) throw new Error('Use Not Permissions');

  const supabase = CreateServerClient();

  if (['like', 'comment'].includes(type)) {
    let { data: rate } = await supabase
      .schema('next_auth')
      .from('users_ratings')
      .select('*')
      .match({ mediaId: mediaId, userId: user.user.id })
      .single();

    if (type === 'like') {
      if (rate?.checks.like) rate.rate -= 5;
      if (rate) rate.checks.like = !rate.checks.like;

      if (rate === null) {
        const { data } = await supabase
          .schema('todaywantlook')
          .from('medias')
          .select('*')
          .match({ mediaId: mediaId })
          .single();

        return await supabase
          .schema('next_auth')
          .from('users_ratings')
          .insert({
            userId: user.user.id,
            mediaId: mediaId,
            genre: data?.genre!,
            rate: 5,
            checks: { like: true, view: false, rating: false },
          });
      }

      await supabase.schema('next_auth').from('users_ratings').upsert(rate!);
    }
  }

  revalidateTag('media');
  redirect(`/media/${mediaId}`);
}
