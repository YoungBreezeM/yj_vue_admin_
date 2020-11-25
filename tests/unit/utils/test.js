function isAssetTypeAnImage(ext) {
  return [
    'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].
  indexOf(ext.toLowerCase()) !== -1;
}



console.log(isAssetTypeAnImage("image.png"))
