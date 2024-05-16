import type { Dispatch, SetStateAction } from 'react';

import { d, a } from 'hangul-js';

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function typing(
  text: string,
  setState?: Dispatch<SetStateAction<string>>,
  delay: number = 100
) {
  const sliceText = d(text, true); // 한글 분리

  let letter = '';

  for (let ctx of sliceText) {
    let temp: string = '';

    for (let i in ctx) {
      temp = a(ctx.slice(0, parseInt(i) + 1));

      if (setState) setState(letter + temp);

      await wait(delay);
    }
    letter += temp;
  }

  return letter;
}
