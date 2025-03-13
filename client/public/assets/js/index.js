function createJewelrySlider(data, containerSelector, dotsSelector) {
    const container = document.querySelector(containerSelector);
    const dotsContainer = document.querySelector(dotsSelector);
    const jewelriesWrapper = document.querySelector(".featured");

    if (!container || !dotsContainer || !jewelriesWrapper) return;

    container.innerHTML = "";
    dotsContainer.innerHTML = "";

    // Populate jewelry items
    data.forEach((jewelry, index) => {
        const jewelryDiv = document.createElement("div");
        jewelryDiv.classList.add("jewelry");
        jewelryDiv.innerHTML = `
            <img src="${jewelry.img}" alt="${jewelry.name || jewelry.category}">
            <h3 class="jewelry_details">${jewelry.name || jewelry.category}</h3>
            ${jewelry.material ? `<p class="jewelry_material">${jewelry.material}</p>` : ""}
        `;
        container.appendChild(jewelryDiv);

        // Create dots
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dotsContainer.appendChild(dot);
    });

    initializeSlider(data, container, dotsContainer, data.length);
    updateAppointmentButton(data, 0);
    updateCategorySeeMore(data, 0)
}

function updateAppointmentButton(data, currentIndex) {
    if (data[currentIndex] && data[currentIndex].id) {
        const existingBtn = document.getElementById("appointment-link");
        
        if (existingBtn) {
            existingBtn.href = `/appointment/${data[currentIndex].id}`;
        }
    }
}

function updateCategorySeeMore(data, currentIndex) {
    if (data[currentIndex] && data[currentIndex].category) {
        const seeMore = document.getElementById("category-seemore");

        seeMore.href = `/jewelries/#${data[currentIndex].category.toLowerCase()}`;
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

        updateAppointmentButton(data, currentIndex);
        updateCategorySeeMore(data, currentIndex)
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

function showFeaturedJewelries() {
    fetch('/api/getFeaturedProduct', {
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
                    material: product.product_material,
                    type: product.product_type,
                    img: imageUrl
                };
            })
        );
    })
    .then(data => {
        createJewelrySlider(data, ".jewelries_container", ".jewelries_slider");
    })
    .catch(error => console.error("Error fetching featured jewelries:", error));
}

function showCategories() {
    const data = [
        { img: "../assets/images/ring.webp", category: "Ring" },
        { img: "../assets/images/bracelet.webp", category: "Bracelet" },
        { img: "../assets/images/necklace.webp", category: "Necklace" },
        { img: "../assets/images/earring.webp", category: "Earring" }
    ];

    createJewelrySlider(data, ".category_container", ".category_slider");
}



document.addEventListener("DOMContentLoaded", function () {
    // FEATURED JEWELRIES
    showFeaturedJewelries();

    // Categories
    showCategories();
});


