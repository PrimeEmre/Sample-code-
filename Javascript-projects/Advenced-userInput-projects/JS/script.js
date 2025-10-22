
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
    })
    // Showing the result
    document.getElementById("result").innerHTML = '<b> '+ 'Take Home Pay: ' + "</b>" + formattedPrice.format(takeHomePay) + '<br> <b> Taxes: </b>' + formattedPrice.format(taxes)

}
