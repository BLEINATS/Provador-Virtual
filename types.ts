/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface WardrobeItem {
  id: string;
  name: string;
  url: string;
}

export interface OutfitLayer {
  garments: WardrobeItem[]; // Array vazio representa a camada do modelo base
  poseImages: Record<string, string>; // Mapeia a instrução da pose para a URL da imagem
}

export interface SavedOutfit {
  id: string;
  imageUrl: string;
  layers: OutfitLayer[];
}
