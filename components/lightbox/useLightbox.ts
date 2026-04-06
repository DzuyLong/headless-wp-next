'use client';

import { useMemo, useState } from 'react';

export default function useLightbox() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const api = useMemo(() => {
    return {
      open,
      index,
      openAt: (nextIndex: number) => {
        setIndex(Math.max(0, nextIndex));
        setOpen(true);
      },
      close: () => setOpen(false),
      setSlidesIndex: (nextIndex: number) => setIndex(Math.max(0, nextIndex)),
    };
  }, [open, index]);

  return api;
}

