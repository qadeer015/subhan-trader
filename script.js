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
        // Dummy product data for demonstration purposes
        const products = {
            1: {
                title: 'IBC Tank 1000L',
                image: 'path/to/image1.jpg',  // Replace with actual image path
                video: 'path/to/video1.mp4',  // Replace with actual video path
                description: 'High-quality IBC tank with a capacity of 1000 liters.',
            },
            2: {
                title: 'Plastic Drum 500L',
                image: 'path/to/image2.jpg',  // Replace with actual image path
                video: 'path/to/video2.mp4',  // Replace with actual video path
                description: 'High-quality Plastic Drum with a capacity of 500 liters.',
            }
        };

        const product = products[productId];
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-video').src = product.video;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-price').textContent = product.price;

        popupProduct.style.display = 'block';
    }
});
