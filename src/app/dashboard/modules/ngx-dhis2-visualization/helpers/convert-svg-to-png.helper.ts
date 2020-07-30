export function svgToPng(svg) {
  const url = getSvgUrl(svg);
  return new Promise((resolve, reject) => {
    svgUrlToPng(url, (imgData) => {
      URL.revokeObjectURL(url);
      resolve(imgData);
    });
  });
}
function getSvgUrl(svg) {
  return URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
}
function svgUrlToPng(svgUrl, callback) {
  const svgImage = document.createElement('img');
  svgImage.setAttribute('id', 'test-image');
  document.body.appendChild(svgImage);
  svgImage.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = svgImage.clientWidth;
    canvas.height = svgImage.clientHeight;

    const canvasCtx = canvas.getContext('2d');
    canvasCtx.drawImage(svgImage, 0, 0);
    const imgData = canvas.toDataURL('image/png');
    callback(imgData);
    document.body.removeChild(svgImage);
  };
  svgImage.src = svgUrl;
}
