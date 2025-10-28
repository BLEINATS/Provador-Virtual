/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface BackgroundOption {
  id: string;
  name: string;
  thumbnailUrl: string;
  prompt?: string;
  imageUrl?: string;
}

// Default background options for the background variation feature
export const defaultBackgrounds: BackgroundOption[] = [
  {
    id: 'studio-dramatic',
    name: 'Estúdio Dramático',
    thumbnailUrl: 'https://storage.googleapis.com/gemini-95-icons/background-thumbs/studio-dramatic.png',
    prompt: 'fundo de estúdio com iluminação dramática, fundo cinza escuro',
  },
  {
    id: 'sunny-day-park',
    name: 'Parque Ensolarado',
    thumbnailUrl: 'https://storage.googleapis.com/gemini-95-icons/background-thumbs/sunny-day-park.png',
    prompt: 'fundo externo em um parque da cidade em um dia ensolarado e brilhante com árvores verdes',
  },
  {
    id: 'rooftop-sunset',
    name: 'Pôr do Sol no Terraço',
    thumbnailUrl: 'https://storage.googleapis.com/gemini-95-icons/background-thumbs/rooftop-sunset.png',
    prompt: 'em um terraço de um prédio com vista para a cidade ao pôr do sol, céu laranja e rosa',
  },
  {
    id: 'studio-backdrop-1',
    name: 'Fundo de Estúdio 1',
    thumbnailUrl: 'https://storage.googleapis.com/gemini-95-icons/background-thumbs/studio-1.png',
    imageUrl: 'https://storage.googleapis.com/gemini-95-icons/backgrounds/studio-backdrop-1.jpg',
  },
  {
    id: 'beach-background',
    name: 'Fundo de Praia',
    thumbnailUrl: 'https://storage.googleapis.com/gemini-95-icons/background-thumbs/beach.png',
    imageUrl: 'https://storage.googleapis.com/gemini-95-icons/backgrounds/beach-1.jpg',
  },
  {
    id: 'city-street',
    name: 'Rua da Cidade',
    thumbnailUrl: 'https://storage.googleapis.com/gemini-95-icons/background-thumbs/city.png',
    imageUrl: 'https://storage.googleapis.com/gemini-95-icons/backgrounds/city-street-1.jpg',
  },
];
