if ('serviceWorker' in navigator) {
  // FIXED: Point directly to the file using "./"
  // We removed the 'scope' part because the default is usually perfect.
  navigator.serviceWorker.register('./sw.js')
    .then(function(registration) {
      console.log('Service Worker Registered!');
    })
    .catch(function(error) {
      console.log('Service Worker Registration Failed:', error);
    });
}



// AI image generate API
function generateImg() {
    imagePrompt = document.getElementById('image-generate').value;
    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1920&height=1080&model=flux`;
    const imgElement = document.getElementById('result');
    console.log(apiUrl);
    document.getElementById('result').innerHTML = `<img src="${apiUrl}" alt="Generated Image" width="500">`;
}