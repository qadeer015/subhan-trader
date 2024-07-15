document.addEventListener('DOMContentLoaded', () => {
    const contactLink = document.getElementById('contact-link');
    const popupContact = document.getElementById('contact-popup');
    const popupProduct = document.getElementById('product-popup');
    const closeBtns = document.querySelectorAll('.close');
    const viewProductBtns = document.querySelectorAll('.view-product');



    contactLink.addEventListener('click', (event) => {
        event.preventDefault();
        popupContact.style.display = 'block';
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            popupContact.style.display = 'none';
            popupProduct.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === popupContact) {
            popupContact.style.display = 'none';
        }
        if (event.target === popupProduct) {
            popupProduct.style.display = 'none';
        }
    });

    viewProductBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const productId = event.target.parentElement.getAttribute('data-id');
            displayProductPopup(productId);
        });
    });


    function displayProductPopup(productId) {
        //  product data for demonstration purposes
        const products = {
            1: {
                title: 'IBC Tank 1000L',
                video: 'path/to/video1.mp4',  // Replace with actual video path
                description: 'High-quality IBC tank with a capacity of 1000 liters.',
            },
            2: {
                title: 'Plastic Drum 500L',
                video: 'path/to/video2.mp4',  // Replace with actual video path
                description: 'High-quality Plastic Drum with a capacity of 200 liters.',
            }
        };

        const product = products[productId];
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-video').src = product.video;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-price').textContent = product.price;

        popupProduct.style.display = 'block';
    }
});
window.onscroll = function () { myFunction() };

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function myFunction() {
    if (window.scrollY >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
}
var navContainer = document.getElementById("navbar");
var tabs = navContainer.getElementsByClassName("tabs");
for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
        }
        this.className += " active";
    });
}

