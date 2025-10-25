

// Voting age checker
// function vote() {
// let age = document.getElementById("age").value
// if (age < 18){
//     document.getElementById("vote").innerHTML = "You are not old enough to vote"
// }else{
//     document.getElementById("vote").innerHTML = "You are old enough to vote"
// }
// }

function convert() {
    let grade = parseInt(document.getElementById("grade").value)
    if (grade <= 100 && grade >= 95) {
        document.getElementById("convert").innerHTML = "You got an A+"
    } else {
        document.getElementById("convert").innerHTML = "You got an A"
    }
    if (grade <= 94 && grade >= 84) {
        document.getElementById("convert").innerHTML = "You got an A"
    } else {
        document.getElementById("convert").innerHTML = "You got an A-"
    }
    if (grade <= 86 && grade >= 80) {
        document.getElementById("convert").innerHTML = "You got an A-"
    } else {
        document.getElementById("convert").innerHTML = "You got an B+"
    }
    if (grade <= 79 && grade >= 77) {
        document.getElementById("convert").innerHTML = "You got an B+"
    } else {
        document.getElementById("convert").innerHTML = "You got an B"
    }
    if (grade <= 76 && grade >= 73) {
        document.getElementById("convert").innerHTML = "You got an B"
    } else {
        document.getElementById("convert").innerHTML = "You got an B-"
    }
    if (grade <= 72 && grade >= 70) {
        document.getElementById("convert").innerHTML = "You got an B-"
    } else {
        document.getElementById("convert").innerHTML = "You got an C+"
    }
    if (grade <= 69 && grade >= 67) {
        document.getElementById("convert").innerHTML = "You got an C+"
    } else {
        document.getElementById("convert").innerHTML = "You got an C"
    }
    if (grade <= 66 && grade >= 63) {
        document.getElementById("convert").innerHTML = "You got an C"
    } else {
        document.getElementById("convert").innerHTML = "You got an C-"
    }
    if (grade <= 62 && grade >= 60) {
        document.getElementById("convert").innerHTML = "You got an C-"
    } else {
        document.getElementById("convert").innerHTML = "You got an D+"
    }
    if (grade <= 59 && grade >= 57) {
        document.getElementById("convert").innerHTML = "You got an D+"
    } else {
        document.getElementById("convert").innerHTML = "You got an D+"
    }
    if (grade <= 53 && grade >= 52) {
        document.getElementById("convert").innerHTML = "You got an D"
    } else {
        document.getElementById("convert").innerHTML = "You got an D-"
    }
    if (grade <= 52 && grade >= 50) {
        document.getElementById("convert").innerHTML = "You got an D-"
    } else {
        document.getElementById("convert").innerHTML = "You got an R"
    }

}
