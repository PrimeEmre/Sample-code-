

// Voting age checker
// function vote() {
// let age = document.getElementById("age").value
// if (age < 18){
//     document.getElementById("vote").innerHTML = "You are not old enough to vote"
// }else{
//     document.getElementById("vote").innerHTML = "You are old enough to vote"
// }
// }

//Grade Calculator

// function convert() {
//     let grade = parseInt(document.getElementById("grade").value)
//     let result = ""
//     if (grade >= 95 && grade <= 100) {
//         result = "You got an A+"
//     } else if (grade >= 85 && grade <= 94) {
//         result = "You got an A"
//     } else if (grade >= 80 && grade <= 84) {
//         result = "You got an A-"
//     } else if (grade >= 77 && grade <= 79) {
//         result = "You got a B+"
//     } else if (grade >= 73 && grade <= 76) {
//         result = "You got a B"
//     } else if (grade >= 70 && grade <= 72) {
//         result = "You got a B-"
//     } else if (grade >= 67 && grade <= 69) {
//         result = "You got a C+"
//     } else if (grade >= 63 && grade <= 66) {
//         result = "You got a C"
//     } else if (grade >= 60 && grade <= 62) {
//         result = "You got a C-"
//     } else if (grade >= 57 && grade <= 59) {
//         result = "You got a D+"
//     } else if (grade >= 53 && grade <= 56) {
//         result = "You got a D"
//     } else if (grade >= 50 && grade <= 52) {
//         result = "You got a D-"
//     } else if (grade < 50 && grade >= 0) {
//         result = "You got an R (fail)"
//     } else {
//         result = "Invalid grade entered"
//     }

//     document.getElementById("convert").innerHTML = result
// }

//Random Number
// const randomNumber = Math.floor(Math.random() * 6) + 1
// function round() {
//     const usserNumber = document.getElementById("random-number").value

//     if (usserNumber == randomNumber) {
//         document.getElementById('result').innerHTML = '<p> You have guessed the corecet number!</p>'
//     }
//     else {
//         document.getElementById('result').innerHTML = '<p> The correct number was:' + ' ' + randomNumber + '</p>'
//     }
// }

// Turkish resturant
// function amount() {
//     //Setting the veribles
//     let kebabList = document.getElementById("kebab-type").value;
//     let desertList = document.getElementById("desert-type").value;
//     let spiceLevel = document.getElementById("spice-level").value;
//     let size = document.getElementById("size").value;

//     let kebabPrice = 0;
//     let desertPrice = 0;
//     let spiceLevelExtra = 0;
//     let sizePrice = 0;
//     let resultMessage = "";

//     // Settting the kebab
//     if (kebabList == "Adana Kebab") {
//         kebabPrice = 30.00;
//     } else if (kebabList == "Urfa Kebab") {
//         kebabPrice = 25.00;
//     } else if (kebabList == "Iskender Kebab") {
//         kebabPrice = 27.00;
//     } else if (kebabList == "Doner Kebab") {
//         kebabPrice = 20.00;
//     } else if (kebabList == "Chicken kebabi") {
//         kebabPrice = 18.00;
//     }else if(kebabList == "Cağ kebabı"){
//         kebabPrice = 32.00
//     }

//     //Setting the deserts
//     if (desertList == "Baklava") {
//         desertPrice = 10.00;
//     } else if (desertList == "Künefe") {
//         desertPrice = 14.00;
//     } else if (desertList == "Lokum") {
//         desertPrice = 10.00;
//     } else if (desertList == "Lokma") {
//         desertPrice = 7.00;
//     } else if (desertList == "Maras Icecream") {
//         desertPrice = 10.00;
//     }

//     // Setting the spice level
//     if (spiceLevel == "less-spice") {
//         spiceLevelExtra = 1.00;
//     } else if (spiceLevel == "bit-spice") {
//         spiceLevelExtra = 2.00;
//     } else if (spiceLevel == "medium-spice") {
//         spiceLevelExtra = 2.50;
//     } else if (spiceLevel == "spice") {
//         spiceLevelExtra = 3.50;
//     } else if (spiceLevel == "death-spice") {
//         spiceLevelExtra = 5.50;
//     }
//     //Setting the sizes
//     if (size == "small") {
//         sizePrice = 0.00;
//     } else if (size == "medium") {
//         sizePrice = 3.00;
//     } else if (size == "large") {
//         sizePrice = 5.00;
//     } else if (size == "x-large") {
//         sizePrice = 10.00;
//     } else if (size == "xx-large") {
//         sizePrice = 20.00;
//     }

//     const subtotal = kebabPrice + desertPrice + sizePrice + spiceLevelExtra;
//     const taxRate = 0.13;
//     const tax = subtotal * taxRate;
//     const total = subtotal + tax;

//     resultMessage += "Kebab Price: $" + kebabPrice.toFixed(2) + "<br>";
//     resultMessage += "Dessert Price: $" + desertPrice.toFixed(2) + "<br>";
//     resultMessage += "Size Price: $" + sizePrice.toFixed(2) + "<br>";
//     resultMessage += "Spice Extra: $" + spiceLevelExtra.toFixed(2) + "<br>";
//     resultMessage += "Tax (13%): $" + tax.toFixed(2) + "<br>";
//     resultMessage += "<strong>Total: $" + total.toFixed(2) + "</strong>";

//     document.getElementById("result").innerHTML = resultMessage;
// }

// // Repated Mutiplycation
// function calculate() {
//     // Get numbers from the user
//     let fisrtNum = parseInt(document.getElementById("fisrt-num").value)
//     let secondNum = parseInt(document.getElementById("second-num").value)

//     // setting our veribles
//     let result = 0
//     let count = 0
//     let additionText = ""
//     let negativeResult = false

//     if ((fisrtNum < 0 && secondNum > 0) || (fisrtNum > 0 && secondNum < 0)) {
//         negativeResult = true
//     }
//     // Check if the result should be negative
//     if (fisrtNum < 0) {
//         fisrtNum = 0 - fisrtNum
//     }
//     if (secondNum < 0) {
//         secondNum = 0 - secondNum
//     }
//     // Multiply using repeated addition
//     while (count < secondNum) {
//         result += fisrtNum
//         additionText += fisrtNum

//         if (count < secondNum - 1) {
//             additionText += " + "
//         }

//         count++
//     }

//     // Make result negative if needed
//     if (negativeResult) {
//         result = 0 - result
//     }
//     document.getElementById("result").textContent = additionText + " = " + result
// }

// Sum of n natural numbers
// function calculate() {
//     // setting the veribles
//     let num = parseInt(document.getElementById("num").value)
//     let result = 0
//     let additionText = ""
//     // Setting the loop
//     for (num = num; num > 0; num--) {
//         result = result + num
//         // extending the numbers 
//         // additionText = additionText + num

//         // if (num > 1) {
//         //     additionText = additionText + " + ";
//         // }
//     }
//     document.getElementById("result").textContent = additionText + " = " + result
// }

// Long Division Program
// function calculate() {
//     // setting the veribles
//     firstNum = parseInt(document.getElementById("first-num").value)
//     secondNum = parseInt(document.getElementById("second-num").value)
//     let result = 0
//     let remainder = firstNum
//     // Setting the loop
//     while (true) {
//         if (remainder >= secondNum) {
//             remainder = remainder - secondNum
//             result++
//         }
//         else {
//             break
//         }
//     }
//     document.getElementById("result").innerHTML = "<strong>" + firstNum + "</strong>" + " ÷ " + "<strong>" + secondNum + "</strong>" + " = " + "<strong>" + result + "<storong>" + "<br>" + "<strong>" + " Remainder: " + "</strong>" + remainder
// }

// Intereset clacualtor for our final project
// function calculateBtn() {
//     // Setting the veribles
//     const principal = parseFloat(document.getElementById("principal").value)
//     const rate = parseFloat(document.getElementById("rate").value)
//     const time = parseFloat(document.getElementById("time").value)
//     const frequency = parseFloat(document.getElementById("frequency").value);
//     const totalDisplay = document.getElementById("total-display")
//     const principalDisplay = document.getElementById("principal-display")
//     const interestDisplay = document.getElementById("interest-display")
//     let totalAmount = principal
//     // formaitting currency
//     const currencyFormatter = new Intl.NumberFormat('en-CA', {
//         style: 'currency',
//         currency: 'CAD'
//     })
//     // Calculating rate per period
//     const ratePerPeriod = (rate / 100) / frequency

//     // Setting the looping & claculations 
//     for (let year = 1; year <= time; year++) {
//         totalAmount += totalAmount * ratePerPeriod
//     }
//     const totalInterest = totalAmount - principal

//     // Displaying the results
//     totalDisplay.textContent = currencyFormatter.format(totalAmount)
//     principalDisplay.textContent = currencyFormatter.format(principal)
//     interestDisplay.textContent = '+' + currencyFormatter.format(totalInterest)
// }

// Calculator project
// Setting the clases and the veribles that holds the logics 
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear(); // clearing the calculator
    }

    // This resets the calculator to its default state
    clear() {
        this.currentOperand = '0'
        this.previousOperand = ''
        this.operation = undefined
        this.updateDisplay(); // Added this call to update the screen on clear
    }

    // This adds a number or a decimal to the display
    appendNumber(number) {
        if (number == '.' && this.currentOperand.includes('.')) return
        // If the current number is 0, replace it
        if (this.currentOperand == '0' && number !== '.') {
            this.currentOperand = number
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString()
        }
    }

    // Setting the (+,-,*,/)
    chooseOperation(operation) {
        if (this.currentOperand == '') return
        // If the user enters the first number, it will calculate that number first
        if (this.previousOperand !== '') {
            // FIX: Misspelled "compute"
            this.compute()
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand
        this.currentOperand = '' // clearing the text
    }

    // Setting the calculation
    // FIX: Misspelled "compute"
    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        // Checking the valid numbers
        if (isNaN(prev) || isNaN(current)) return

        // Setting the operators
        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '-':
                computation = prev - current
                break
            case '*':
                computation = prev * current
                break
            case '/':
                computation = prev / current
                break
            default:
                return
        }
        // Storing the result
        this.currentOperand = computation.toString()
        this.operation = undefined
        this.previousOperand = ''
    }

    // Logic for the DELETE button
    delete() {
        // If the string is just "0", do nothing
        if (this.currentOperand =='0') return
        // Use .slice(0, -1) to cut off the last character
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
        // If you've deleted everything, set it back to "0"
        if (this.currentOperand == '') {
            this.currentOperand = '0';
        }
    }

    // Logic for the PERCENT button
    percent() {
        const current = parseFloat(this.currentOperand)
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString()
    }

    // Updating the page
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}

// Setting the Data
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const clearButton = document.querySelector('[data-clear]')
// --- ADDED THIS SELECTION ---
const percentButton = document.querySelector('#percent') // Select the percent button by its ID
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

// Updating the display element
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

// Adding an event for every single number button
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

// Setting the operator buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        // This stops the percent button from running "chooseOperation"
        if (button.id == 'percent') return
        
        calculator.chooseOperation(button.innerText)
        
        // FIX: Added missing ()
        calculator.updateDisplay()
    });
});

// Setting the =
equalsButton.addEventListener('click', () => {
    // FIX: Misspelled "compute"
    calculator.compute()
    calculator.updateDisplay()
});


// Setting the AC button
clearButton.addEventListener('click', () => {
    calculator.clear()
})

// Setting the DEL button
deleteButton.addEventListener('click', () => {
    calculator.delete()
    calculator.updateDisplay()
});

// Setting the % button
percentButton.addEventListener('click', () => {
    calculator.percent()
    calculator.updateDisplay()
})


