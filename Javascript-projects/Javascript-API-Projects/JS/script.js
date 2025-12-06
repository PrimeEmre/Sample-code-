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

// function genareteImg() {
//     // setting the veribles for the APIS
//     const apiKey = "TYZi0oVILORrouXMNncM9RLpxUGiZAe31n0osVqe"
//     const baseURL = "https://api.nasa.gov/planetary/apod"
//     const apiUrl = `${baseURL}?api_key=${apiKey}`
//     console.log("fetching from", apiUrl)
//     // fetching data from the API
//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data)
//             document.getElementById("space-image").src = data.url
//             document.getElementById("description").innerText = data.explanation
//         })
//         .catch(error => console.log(error))
//     // showing the image from the API

// }


// Weather API
//setting the API
const apikey = '6ed4f81aa0ad45d082c34616250612'

//Setting the function and veribles 
async function getWeather() {
    const cityName = document.getElementById("cityInput").value
    const resultBox = document.getElementById("result") 
    const errorMsg = document.getElementById("errorMsg")

    // Checking if the box is empty 
    if (cityName == "") {
        alert("Please enter a valid city name")
        return;
    }
    //Setting the API url 
    const url = `http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${cityName}&aqi=no`

    // Fetching the API 
    try {
        const response = await fetch(url)
        if (!response.ok) {
            errorMsg.style.display = "block"
            resultBox.style.display = "none"
        } else {
            const data = await response.json()
            // setting the required inforamtion 
            document.getElementById("temp").innerHTML = Math.round(data.current.temp_c) + "°c"
            document.getElementById("desc").innerHTML = data.current.condition.text
            document.getElementById("humidity").innerHTML = data.current.humidity + "%"
            document.getElementById("wind").innerHTML = data.current.wind_kph + " km/h"
            
            document.getElementById("icon").src = "https:" + data.current.condition.icon

            resultBox.style.display = "block"
            errorMsg.style.display = "none"
        }
        // catching the erros 
    } catch (error) {
        console.log("Error fetching weather", error)
    }
}
