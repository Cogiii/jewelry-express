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

        updateAppointmentButton(data, currentIndex);
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

function showGridJewelries(products, container) {
    products.forEach(jewelry => {
        const item = document.createElement("div");
        item.classList.add("jewelry-item");

        item.innerHTML = `
            <img src="${jewelry.src}" alt="${jewelry.alt}">
            <h2>${jewelry.name}</h2>
            <p class="material">${jewelry.material}</p>
            <p class="description">${jewelry.description}</p>
        `;

        container.appendChild(item);

        item.addEventListener('click', () => {
            window.location = `/collection/${jewelry.id}`;
        });
    });
}

function movableNav() {
    const navType = document.querySelector('.navigation');

    let isDown = false;
    let startX;
    let scrollLeft;

    navType.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - navType.offsetLeft;
        scrollLeft = navType.scrollLeft;
    });

    navType.addEventListener('mouseleave', () => {
        isDown = false;
    });

    navType.addEventListener('mouseup', () => {
        isDown = false;
    });

    navType.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - navType.offsetLeft;
        const walk = (x - startX) * 2; // Adjust speed
        navType.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX = 0;
    let touchScrollLeft = 0;

    navType.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = navType.scrollLeft;
    });

    navType.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].pageX;
        const move = touchX - touchStartX;
        navType.scrollLeft = touchScrollLeft - move;
    });
}

function jewelriesFilter() {
    const categories = document.querySelectorAll(".filter_nav");
    const jewelrySections = document.querySelectorAll(".rings, .earrings, .necklaces, .bracelets");
    const materialSections = document.querySelectorAll(".amethysts, .golds, .diamonds");

    function updateDisplay(selectedType) {
        categories.forEach(cat => cat.classList.remove("active"));
        document.getElementById(selectedType)?.classList.add("active");
        console.log(selectedType)

        jewelrySections.forEach(section => {
            section.style.display = "none";
            section.classList.remove("fade-in");
        });

        materialSections.forEach(section => {
            section.style.display = "none";
            section.classList.remove("fade-in");
        });

        setTimeout(() => {
            jewelrySections.forEach(section => {
                section.style.display = (selectedType === "all" || section.classList.contains(selectedType + "s")) ? "block" : "none";
                section.classList.toggle("fade-in", (selectedType === "all" || section.classList.contains(selectedType + "s")));
            });
    
            materialSections.forEach(section => {
                section.style.display = (section.classList.contains(selectedType + "s")) ? "block" : "none";
                section.classList.toggle("fade-in", section.classList.contains(selectedType + "s"));
            });
        }, 0);
    }

    function isValidHash(hash) {
        hash = hash + "s";
        return [...jewelrySections].some(section => section.classList.contains(hash)) ||
               [...materialSections].some(section => section.classList.contains(hash));
    }    

    const hash = window.location.hash.slice(1);

    if(hash && hash !== "" && isValidHash(hash)) {
        updateDisplay(hash.toLocaleLowerCase());
    } else {
        updateDisplay("all");
    }


    categories.forEach(category => {
        category.addEventListener("click", () => {
            const selectedType = category.id.toLowerCase();
            updateDisplay(selectedType);
        });
    });
    

    // if url is change can you update the display
    window.addEventListener("hashchange", () => {
        const hash = window.location.hash.slice(1);
        updateDisplay(hash.toLocaleLowerCase());
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
                    img: imageUrl,
                };
            })
        );
    })
    .then(data => {
        createJewelrySlider(data, ".jewelries_container", ".slider_dots");
    })
    .catch(error => console.error("Error fetching featured jewelries:", error));
}

function showJewelryType(type, container) {
    fetch(`/api/getProductByType/${type}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(products => {
        return Promise.all(
            products.map(async (product) => {
                const imageResponse = await fetch(`/api/getProductImage/${product.product_id}`);
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
            
                return {
                    id: product.product_id,
                    name: product.product_name,
                    material: product.product_material,
                    type: product.product_type,
                    src: imageUrl,
                    alt: product.product_name,
                    description: product.product_description
                };
            })
        );
    })
    .then(products => {
        showGridJewelries(products, container);
    })
    .catch(error => console.error("Error fetching featured jewelries:", error));
}

function showJewelryMaterial(material, container) {
    fetch(`/api/getProductByMaterial/${material}`, { method: 'GET' })
    .then(response => response.json())
    .then(async (products) => {
        if (!Array.isArray(products) || products.length === 0) {
            throw new Error(`No products found for ${material}.`);
        }

        const processedProducts = await Promise.all(
            products.map(async (product) => {
                const imageResponse = await fetch(`/api/getProductImage/${product.product_id}`);
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
            
                return {
                    id: product.product_id,
                    name: product.product_name,
                    material: product.product_material,
                    type: product.product_type,
                    src: imageUrl,
                    alt: product.product_name,
                    description: product.product_description
                };
            })
        );

        return processedProducts; 
    })
    .then(products => showGridJewelries(products, container))
    .catch(error => console.error("Error fetching featured jewelries:", error));
}


document.addEventListener("DOMContentLoaded", function () {
    movableNav();
    jewelriesFilter();

    // FEATURED JEWELRIES
    showFeaturedJewelries();

    showJewelryType("Ring", document.querySelector(".rings .jewelries"));
    showJewelryType("Earring", document.querySelector(".earrings .jewelries"));
    showJewelryType("Necklace", document.querySelector(".necklaces .jewelries"));
    showJewelryType("Bracelet", document.querySelector(".bracelets .jewelries"));

    showJewelryMaterial("Amethyst", document.querySelector(".amethysts .jewelries"))
    showJewelryMaterial("Gold", document.querySelector(".golds .jewelries"))
    showJewelryMaterial("Diamond", document.querySelector(".diamonds .jewelries"))
});