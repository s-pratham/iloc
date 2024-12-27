function hideProduct(){
    document.querySelector(".product").classList.toggle("hide");
}

function hidePrice(){
    document.querySelector(".price").classList.toggle("hide");
}

var editstock = 0;
var addstock = 0;

function hideEditStock(){
    document.querySelector(".edit-quantity").classList.toggle("hide");
    if(editstock===0){
        editstock = 1;
    }else{
        editstock = 0;
    }
    if(addstock===1){
        document.querySelector(".add-quantity").classList.toggle("hide");
        addstock = 0;
    }
}

function hideAddStock(){
    document.querySelector(".add-quantity").classList.toggle("hide");
    if(addstock===0){
        addstock = 1;
    }else{
        addstock = 0;
    }
    if(editstock===1){
        document.querySelector(".edit-quantity").classList.toggle("hide");
        editstock = 0;
    }
}

function hideLocation(){
    document.querySelectorAll(".location")[0].classList.toggle("hide");
    document.querySelectorAll(".location")[1].classList.toggle("hide");
    document.querySelectorAll(".location")[2].classList.toggle("hide");
}


// document.addEventListener('.back-btn', function(event) {
//             if (event.key === 'Backspace') {
//                 console.log("hello");
//                 window.location.href = "/adminHome";
//             }
//         });

function hideDataContent(){
    document.querySelector(".product-data").classList.toggle("hide");
}


function notification(){
    let notification=document.querySelector(".notification");
    notification.style.display="none";
}

function hidenotification(){
    setTimeout(function(){
        let notification=document.querySelector(".notification");
        notification.style.display="none";
    },2500);
}

function getOrdinalSuffix(num) {
            const remainder10 = num % 10;
            const remainder100 = num % 100;

            if (remainder10 === 1 && remainder100 !== 11) {
                return `${num}<sup>st</sup>`;
            } else if (remainder10 === 2 && remainder100 !== 12) {
                return `${num}<sup>nd</sup>`;
            } else if (remainder10 === 3 && remainder100 !== 13) {
                return `${num}<sup>rd</sup>`;
            } else {
                return `${num}<sup>th</sup>`;
            }
        }



