import { Image } from 'image-js';

export const preprocessor = (image, imageType, enableColor = false, mode = "chessboard") => {
  if (mode === "chessboard") {
    return chessboardPreprocessor(image);
  }
}

const chessboardPreprocessor = (image) => {
  return image.grey();
}

export const blender = (outerImage, innerImage, outerColorMode, innerColorMode, mode = "chessboard") => {
  if (mode === "chessboard") {
    return chessboardBlender(outerImage, innerImage);
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
