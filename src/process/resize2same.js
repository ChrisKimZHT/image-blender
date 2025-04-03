import { Image } from 'image-js';

export const resize2same = (imageA, imageB) => {
  let imgA = imageA.clone(), imgB = imageB.clone();
  let width = imgA.width, height = imgA.height;
  let resizeType = 0; // no resize

  if (imgA.width * imgB.height !== imgB.width * imgA.height) {
    resizeType = 1; // not same aspect ratio
    width = Math.max(imgA.width, imgB.width);
    imgA = imgA.resize({ width });
    imgB = imgB.resize({ width });
    if (imgB.height < imgA.height) {
      height = imgA.height;
      let result = new Image(width, height, Uint8Array.from({ length: width * height * 4 }, () => 255));
      let offsetY = Math.round((height - imgB.height) / 2);
      imgB = result.insert(imgB.rgba8(), { x: 0, y: offsetY });
    } else {
      height = imgB.height;
      let result = new Image(width, height, Uint8Array.from({ length: width * height * 4 }, () => 255));
      let offsetY = Math.round((height - imgA.height) / 2);
      imgA = result.insert(imgA.rgba8(), { x: 0, y: offsetY });
    }
  } else if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
    resizeType = 2; // same aspect ratio but different size
    width = Math.max(imgA.width, imgB.width);
    height = Math.max(imgA.height, imgB.height);
    imgA = imgA.resize({ width, height });
    imgB = imgB.resize({ width, height });
  }

  return [imgA, imgB, resizeType];
}
