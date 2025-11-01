/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface BackgroundOption {
  id: string;
  thumbnailUrl: string;
  prompt?: string;
  imageUrl?: string;
}

// Default background options for the background variation feature
// Names are now stored in translations.ts and looked up by id.
export const defaultBackgrounds: BackgroundOption[] = [
  {
    id: 'studio_dramatic',
    thumbnailUrl: 'https://storage.googleapis.com/vto-demo-assets/background-thumbs/studio-dramatic.png',
    prompt: 'fundo de estúdio com iluminação dramática, fundo cinza escuro',
  },
  {
    id: 'sunny_day_park',
    thumbnailUrl: 'https://storage.googleapis.com/vto-demo-assets/background-thumbs/sunny-day-park.png',
    prompt: 'fundo externo em um parque da cidade em um dia ensolarado e brilhante com árvores verdes',
  },
  {
    id: 'rooftop_sunset',
    thumbnailUrl: 'https://storage.googleapis.com/vto-demo-assets/background-thumbs/rooftop-sunset.png',
    prompt: 'em um terraço de um prédio com vista para a cidade ao pôr do sol, céu laranja e rosa',
  },
  {
    id: 'studio_backdrop_1',
    thumbnailUrl: 'https://storage.googleapis.com/vto-demo-assets/background-thumbs/studio-1.png',
    imageUrl: 'https://storage.googleapis.com/vto-demo-assets/backgrounds/studio-backdrop-1.jpg',
  },
  {
    id: 'beach_background',
    thumbnailUrl: 'https://storage.googleapis.com/vto-demo-assets/background-thumbs/beach.png',
    imageUrl: 'https://storage.googleapis.com/vto-demo-assets/backgrounds/beach-1.jpg',
  },
  {
    id: 'city_street',
    thumbnailUrl: 'https://storage.googleapis.com/vto-demo-assets/background-thumbs/city.png',
    imageUrl: 'https://storage.googleapis.com/vto-demo-assets/backgrounds/city-street-1.jpg',
  },
];
