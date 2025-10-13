
//Addition Calculator
// function calcualte() {
//     let num1 = document.getElementById("num-1").value
//     let num2 =  document.getElementById("num-1").value
//     let result =  parseInt(num1) + parseInt(num2)
//     document.getElementById("result").innerHTML = "The result is " + result
// }

//Area Of Triangle Calculator 
function calcualte() {
    let baseOfTriangle = document.getElementById("base-of-triangle").value
    let heightOfTriangle = document.getElementById("height-of-triangle").value
    let result = parseInt(baseOfTriangle) * parseInt(heightOfTriangle) / 2
    document.getElementById("result").innerHTML = "The result is " + result +" cm²"
}