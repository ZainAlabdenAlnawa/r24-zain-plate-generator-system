
import { Plate } from './types';

export const MOTIF_IMAGE_URL = 'https://rueckwand24.com/cdn/shop/files/Kuechenrueckwand-Kuechenrueckwand-Gruene-frische-Kraeuter-KR-000018-HB.jpg?v=1695288356&width=1200';
export const MOTIF_BASE_WIDTH = 300; // cm

export const MIN_PLATES = 1;
export const MAX_PLATES = 10;

export const WIDTH_MIN = 20;
export const WIDTH_MAX = 300;
export const HEIGHT_MIN = 30;
export const HEIGHT_MAX = 128;

export const INCH_TO_CM = 2.54;

export const DEFAULT_PLATE: Omit<Plate, 'id'> = {
  width: 100,
  height: 60,
};
