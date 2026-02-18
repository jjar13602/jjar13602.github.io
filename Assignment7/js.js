let count = 0;

function tickUp(){
    count++;
    document.getElementById("counter").textContent = count;
}

function tickDown(){
    count--;
    document.getElementById("counter").textContent = count;
}

function runForLoop(){
    let result = "";
    let output = document.getElementById("forLoopResult");

    for(let i = 0; i <= count; i++){
        result += i+ " ";
    }
    output.textContent = result;
}

function showOddNumbers(){
    let result = "";
    let output = document.getElementById("oddNumberResult");

    for (let i = 1; i <= count; i++){
        if(i % 2 !== 0){
            result += i + " ";
        }
    }
        output.textContent = result;
}

function addMultiplesToArray(){
    let multiples = [];

    for (let i = 5; i<= count; i += 5){
        multiples.unshift(i);
    }
    console.log(multiples);
}

function printCarObject(){
    const car = {
        type: document.getElementById("carType").value,
        mpg: document.getElementById("carMPG").value,
        color: document.getElementById("carColor").value
    };
    console.log(car);
}
    
function loadCar(carNumber){
    let car;

    if (carNumber === 1){
        car = carObject1;
    } else if (carNumber === 2){
        car = carObject2;
    } else if (carNumber === 3){
        car = carObject3;
    }
    document.getElementById("carType").value = car.cType;
    document.getElementById("carMPG").value = car.cMPG;
    document.getElementById("carColor").value = car.cColor;
}

function changeColor(colorChoice){
    const paragraph = document.getElementById("styleParagraph");

    if (colorChoice === 1){
        paragraph.style.color = "red";
    } else if (colorChoice === 2){
        paragraph.style.color = "green";
    } else if (colorChoice === 3){
        paragraph.style.color = "blue";
    }   
}