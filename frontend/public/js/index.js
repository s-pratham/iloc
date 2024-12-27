
ilocLogoTransform()

function redirectToAdmin() {
    window.location.href = "/AdminLogin";  
}

function redirectToAdminHome(){
    window.location.href = "adminHome.html";
}

function redirectToAddProduct(){
    window.location.href = "addProduct.html";
}

function redirectToHome(){
    window.location.href = "/";
}

function redirectToAddStock(){
    window.location.href = "stockSearch.html";
}



function ilocLogoTransform(){
    document.querySelector(".fa-logo").classList.add("fa-bounce");
    document.querySelector(".fa-logo1").classList.add("fa-flip");
    setTimeout(function(){
        document.querySelector(".fa-logo1").classList.remove("fa-bounce");
        document.querySelector(".fa-logo1").classList.remove("fa-flip");
    },2000);
    
}

document.querySelector(".fa-logo").addEventListener("mousemove",function(){
    ilocLogoTransform();
})

document.querySelector(".fa-logo1").addEventListener("mousemove",function(){
    ilocLogoTransform();
})

// document.querySelector(".sug").addEventListener("click", function () {
//     const searchProduct = this.getAttribute('name');

//     fetch('/search', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ searchProduct: searchProduct }), // Send the product name in the body
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data); // Handle the server response
//     })
//     .catch(error => console.error('Error:', error));
// });

function hideloginnotification(){
        const notification=document.querySelector(".notification");
        notification.style.display="none";
}


function loginnotification(){
    setTimeout(function(){
        const notification=document.querySelector(".notification");
        notification.style.display="none";
    },2500);
}
