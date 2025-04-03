import { Image } from 'image-js';

export const preprocessor = (image, imageType, mode = "chessboard", args = {}) => {
  if (mode === "chessboard") {
    return chessboardPreprocessor(image);
  } else if (mode === "direct") {
    return directPreprocessor(image, imageType, args);
  }
}

const chessboardPreprocessor = (image) => {
  return image.grey().rgba8();
}

const directPreprocessor = (image, imageType, args) => {
  const defaultArgs = {
    enableColor: false,
    clipRange: [0, 255],
    threshold: 0.5,
  };
  args = { ...defaultArgs, ...args };
  const { enableColor, clipRange, threshold } = args;

  if (!enableColor) {
    image = image.grey().rgba8();
  } else {
    image = image.clone().rgba8();
  }

  for (let i = 0; i < image.data.length; i++) {
    if (i % 4 === 3) {
      continue; // skip alpha channel
    }
    let value = image.data[i];
    value = Math.max(clipRange[0], Math.min(clipRange[1], value));
    value = (value - clipRange[0]) / (clipRange[1] - clipRange[0]);
    image.data[i] = value * 255;
  }

  if (imageType === "outer") {
    image.multiply(threshold);
    image.add(255 * (1 - threshold));
  } else if (imageType === "inner") {
    image.multiply(1 - threshold);
  }

  return image;
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