export interface PathImage {
  src: string;
  alt: string;
}

export interface PathCard {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: PathImage;
  destination: string;
  targetAudience?: string;
  order?: number;
}
