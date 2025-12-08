// intro to variables and data types
// let carList = ["Mercedes", "BMW", "Rolls Royce ", "Ford"]
// const cloriList = ["Chips:" +" "+ 300 + " ", "Penuts" + " " + 280 + " " + " " , "Chocolate" + " "+ 500 + " ", "Candy" +" " + 150 + " " ]
// let fruitList = [" Apple", "Banana", "Orange", "Grapes"]
// let decimalList = [1.2, 2.3, 3.4, 4.5]
// let age = 20

// movie rating system
// if (age > 17) {
//     document.getElementById("movie-rating").innerHTML = "You are allowed to watch R-rated movies."
// } else if (age > 13) {
//     document.getElementById("movie-rating").innerHTML = "You are allowed to watch PG-13 rated movies."
// } else if (age > 0) {
//     document.getElementById("movie-rating").innerHTML = "You are allowed to watch G and PG-rated movies."
// } else {
//     document.getElementById("movie-rating").innerHTML = "  You are not allowed to watch any movies."
// }

// divition calculator project
function helloWorld() {
        //creating variables
        let firstNum = 20
        let secondNum = 20
        let result = 0
        let remainder = firstNum
        //   // While loop to do repeated subtraction 
        while (true) {
            if (remainder >= secondNum) {
                remainder = remainder - secondNum
                result++
            } else {
                break
            }
        }
        document.getElementById("find-answer").innerHTML = "The result is " + result + " and the remainder is " + remainder
    }


//intro for functions & printing variables to HTML
// function helloWorld() {
// alert(cloriList )
// }

// console.log(carList)
// console.log(cloriList)
// console.log(fruitList)
// console.log(decimalList)

// document.getElementById("all-about-me").innerHTML = "My name is James smith and I am 30 years  old programer form Istanbul "

