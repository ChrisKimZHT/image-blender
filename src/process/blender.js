import { Image } from 'image-js';

export const preprocessor = (image, imageType, enableColor = false, mode = "chessboard") => {
  if (mode === "chessboard") {
    return chessboardPreprocessor(image);
  } else if (mode === "direct") {
    return directPreprocessor(image, imageType, enableColor);
  }
}

const chessboardPreprocessor = (image) => {
  return image.clone().grey().rgba8();
}

const directPreprocessor = (image, imageType, enableColor) => {
  image = image.clone();
  if (!enableColor) {
    image = image.grey().rgba8();
  }
  if (imageType === "outer") {
    return image.divide(2).add(128);
  } else if (imageType === "inner") {
    return image.divide(2);
  }
}

export const blender = (outerImage, innerImage, mode = "chessboard") => {
  if (mode === "chessboard") {
    return chessboardBlender(outerImage, innerImage);
  } else if (mode === "direct") {
    return directBlender(outerImage, innerImage);
  }
}

const chessboardBlender = (outerImage, innerImage) => {
  const width = outerImage.width, height = outerImage.height;

  const result = new Image(width, height);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if ((i + j) % 2 === 0) {
        result.setPixelXY(j, i, [0, 0, 0, 255 - outerImage.getPixelXY(j, i)[0]]); // outer
      } else {
        result.setPixelXY(j, i, [255, 255, 255, innerImage.getPixelXY(j, i)[0]]); // inner
      }
    }
  }

  return result;
}

const directBlender = (outerImage, innerImage) => {
  const width = outerImage.width, height = outerImage.height;
  const outerGrey = outerImage.grey(), innerGrey = innerImage.grey();

  const result = new Image(width, height);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const [or, og, ob] = outerImage.getPixelXY(j, i);
      const [ir, ig, ib] = innerImage.getPixelXY(j, i);
      const a = (255 - outerGrey.getPixelXY(j, i)[0] + innerGrey.getPixelXY(j, i)[0]);
      const r = 255 * ir / (255 - or + ir);
      const g = 255 * ig / (255 - og + ig);
      const b = 255 * ib / (255 - ob + ib);
      result.setPixelXY(j, i, [r, g, b, a]);
    }
  }

  return result;
}