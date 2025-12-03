// Technology news API

// async function news() {
//     // fetching data from the API
//     try {
//         //Set the API endpoint URL
//         const url = 'https://newsdata.io/api/1/latest?apikey=pub_c0774b64c35e44e8a862750fbeda4ea8&q=technology'
//         const result = await fetch(url);
//         if (!result != null) {
//         const jsonData = await result.json()
//         // showing the title and description of the news
//         const title = jsonData.results[0].title;
//         const description = jsonData.results[0].description;

//     document.getElementById('result').innerHTML = `<h2>${title}</h2><p>${description}</p>`;
//         }else{
//             console.log('No data found');
//         }
//     } catch (error) {
//     console.log(error)
//     }
// }

// AI image generate API
// function genareteImg() {
//     imagePrompt = document.getElementById('image-generate').value;
//     const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1920&height=1080&model=flux`;
//     const imgElement = document.getElementById('result');
//     console.log(apiUrl);
//     document.getElementById('result').innerHTML = `<img src="${apiUrl}" alt="Generated Image" width="500">`;
// }

function genareteImg() {
    // setting the veribles for the APIS
    const apiKey = "TYZi0oVILORrouXMNncM9RLpxUGiZAe31n0osVqe"
    const baseURL = "https://api.nasa.gov/planetary/apod"
    const apiUrl = `${baseURL}?api_key=${apiKey}`
    console.log("fetching from", apiUrl)
    // fetching data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.getElementById("space-image").src = data.url
            document.getElementById("description").innerText = data.explanation
        })
        .catch(error => console.log(error))
    // showing the image from the API

}