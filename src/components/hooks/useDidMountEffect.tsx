'use client';

import { useEffect, useRef } from 'react';

export default function useDidMountEffect(callback: () => void, state: any) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) callback();
    else didMount.current = true;
  }, state);
}
