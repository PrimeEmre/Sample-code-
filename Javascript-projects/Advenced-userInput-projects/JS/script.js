
function vote() {
let age = document.getElementById("age").value
if (age < 18){
    document.getElementById("vote").innerHTML = "You are not old enough to vote"
}else{
    document.getElementById("vote").innerHTML = "You are old enough to vote"
}
}