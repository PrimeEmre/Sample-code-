
//Addition Calculator
// function calcualte() {
//     let num1 = document.getElementById("num-1").value
//     let num2 =  document.getElementById("num-1").value
//     let result =  parseInt(num1) + parseInt(num2)
//     document.getElementById("result").innerHTML = "The result is " + result
// }

//Area Of Triangle Calculator 
// function calcualte() {
//     let baseOfTriangle = document.getElementById("base-of-triangle").value
//     let heightOfTriangle = document.getElementById("height-of-triangle").value
//     let result = parseInt(baseOfTriangle) * parseInt(heightOfTriangle) / 2
//     document.getElementById("result").innerHTML = "The result is " + result +" cm²"
// }

//Fahrenheit to Celsius Converter
// function convert() {
//     // Setting up the variables
//     let fahrenheitValue =  parseFloat (document.getElementById("Fahrenheit").value)
//     let celsiusInput  = document.getElementById("Celsius")
//     let celsiusValue  = (fahrenheitValue - 32) * 5/9

//     // calculating the celsius value
//     celsiusInput.value = celsiusValue.toFixed(2)
//     document.getElementById("formula").innerHTML = "Formula: (" + fahrenheitValue + " - " + 32 + ") X 5/9"
// }

function convert() {
    // Setting up the variables
    const taxAmount = 0.18
    let hourlyWorked = parseFloat(document.getElementById("hourly-worked").value)
    let hourlyWage = parseFloat(document.getElementById("hourly-wage").value)
    let takeHomePay = hourlyWorked * hourlyWage * (1 - taxAmount)
    let taxes = (hourlyWorked * hourlyWage) * taxAmount

    // Correct currency formatting
    let formattedPrice = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    });
    document.getElementById("result").innerHTML = 'Take Home Pay: ' + formattedPrice.format(takeHomePay) + '<br> Taxes: ' + formattedPrice.format(taxes)



}
