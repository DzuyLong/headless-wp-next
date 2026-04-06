'use client';

import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import 'yet-another-react-lightbox/styles.css';

export type GalleryLightboxSlide = {
  src: string;
  alt?: string;
};

type GalleryLightboxProps = {
  open: boolean;
  index: number;
  slides: GalleryLightboxSlide[];
  onClose: () => void;
};

export default function GalleryLightbox({
  open,
  index,
  slides,
  onClose,
}: GalleryLightboxProps) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Zoom]}
    />
  );
}

