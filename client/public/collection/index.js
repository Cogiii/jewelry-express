document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname.split("/");
    const productId = path[2];

    getImages(productId);
    showRelatedCreations(productId);

    getProductData(productId)
        .then(product => {
            const jewelryDetails = document.querySelector('.jewelry_details');
            const appointmentBtn = document.getElementById('appointment-link');
            const productName = document.getElementById('productName');
            const categoryLink = document.getElementById('category_link');

            categoryLink.textContent = product[0].product_type;
            categoryLink.href = `/jewelries/#${product[0].product_type.toLowerCase()}`;
            productName.textContent = product[0].product_name;
            jewelryDetails.textContent = product[0].product_name;
            appointmentBtn.href = `/appointment/${productId}`
        })
        .catch(error => console.error("Error in fetching product:", error));
});

function showRelatedCreations(productId) {
    fetch(`/api/relatedCreations/${productId}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(featuredProducts => {
        return Promise.all(
            featuredProducts.map(async (product) => {
                const imageResponse = await fetch(`/api/getProductImage/${product.product_id}`);
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
            
                return {
                    id: product.product_id,
                    name: product.product_name,
                    img: imageUrl,
                };
            })
        );
    })
    .then(data => {
        createJewelrySlider(data, ".related .jewelry_container", ".related .slider_dots");
    })
    .catch(error => console.error("Error fetching featured jewelries:", error));
}

function getImages(productId) {
    fetch(`/api/getAllProductImages/${productId}`, { method: 'GET' })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(productImages => {
        if (!Array.isArray(productImages)) {
            throw new Error("Invalid API response: Expected an array of images.");
        }

        return Promise.all(
            productImages.map(async (image) => {
                const imageResponse = await fetch(`/api/getProductImageById/${image.product_image_id}`);
                if (!imageResponse.ok) {
                    throw new Error(`Error fetching image ID ${image.product_image_id}`);
                }
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);

                return { img: imageUrl };
            })
        );
    })
    .then(data => {
        if (!data || data.length === 0) {
            console.warn("No images found for this product.");
            return;
        }

        createJewelrySlider(data, ".jewelry_images .jewelry_container", ".jewelry_images .slider_dots");
    })
    .catch(error => console.error("Error fetching product images:", error));
}

function getProductData(productId) {
    return fetch(`/api/getProduct/${productId}`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    });
}

function createJewelrySlider(data, containerSelector, dotsSelector) {
    const container = document.querySelector(containerSelector);
    const dotsContainer = document.querySelector(dotsSelector);

    if (!container || !dotsContainer) return;

    container.innerHTML = "";
    dotsContainer.innerHTML = "";

    // Populate jewelry items
    data.forEach((jewelry, index) => {
        const jewelryDiv = document.createElement("div");
        jewelryDiv.classList.add("jewelry");
        jewelryDiv.innerHTML = `
            <img src="${jewelry.img}" alt="Jewelry Image">
             ${jewelry.name ? `<h3 class="jewelry_details">${jewelry.name}</h3>` : ""}
            
        `;
        container.appendChild(jewelryDiv);
        // Create dots
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dotsContainer.appendChild(dot);

        if(jewelry.name) {
            jewelryDiv.addEventListener('click', () => {
                window.location = `/collection/${jewelry.id}`
            })
        }
    });

    initializeSlider(data, container, dotsContainer, data.length);
    updateAppointmentButton(data);
}

function updateAppointmentButton(data, currentIndex) {
    if (data[currentIndex] && data[currentIndex].id) {
        const existingBtn = document.getElementById("appointment-link");
        
        if (existingBtn) {
            existingBtn.href = `/appointment/${data[currentIndex].id}`;
        }
    }
}

function initializeSlider(data, container, dotsContainer, totalItems) {
    let currentIndex = 0;
    const jewelryItem = container.querySelector(".jewelry");
    if (!jewelryItem) return;
    const slideDistance = jewelryItem.offsetWidth + 45; // match the value on the gap property

    function goToSlide(index) {
        currentIndex = index;
        container.style.transform = `translateX(${-currentIndex * slideDistance}px)`;
        dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    dotsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("dot")) {
            const newIndex = [...dotsContainer.children].indexOf(event.target);
            goToSlide(newIndex);
        }
    });

    let startX = 0;
    let isDragging = false;

    container.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    container.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        let moveX = e.touches[0].clientX;
        let diff = moveX - startX;
        container.style.transform = `translateX(${-currentIndex * slideDistance + diff}px)`;
    });

    container.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        let endX = e.changedTouches[0].clientX;
        let diff = endX - startX;

        if (Math.abs(diff) > 50) {
            if (diff < 0 && currentIndex < totalItems - 1) currentIndex++;
            else if (diff > 0 && currentIndex > 0) currentIndex--;
        }

        goToSlide(currentIndex);
        isDragging = false;
    });
}