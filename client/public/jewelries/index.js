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

    initializeSlider(container, dotsContainer, data.length);
}

function initializeSlider(container, dotsContainer, totalItems) {
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

function showGridJewelries(data, container) {
    data.forEach(jewelry => {
        const item = document.createElement("div");
        item.classList.add("jewelry-item");

        item.innerHTML = `
            <img src="${jewelry.src}" alt="${jewelry.alt}">
            <h2>${jewelry.name}</h2>
            <p class="material">${jewelry.material}</p>
            <p class="description">${jewelry.description}</p>
        `;

        container.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    createJewelrySlider([
        { img: "../assets/images/ring.webp", name: "Jubilated" },
        { img: "../assets/images/bracelet.webp", name: "Melancholy" },
        { img: "../assets/images/necklace.webp", name: "Despair"},
        { img: "../assets/images/necklace.webp", name: "Lust"}
    ], ".featured_jewelries .jewelries_container", ".earrings_slider");

    showGridJewelries([
        { src: "../assets/images/ring.png", alt: "Sloth Ring", name: "Seraphim", material: "Gold", description: "A ring from the Angels collection." },
        { src: "lust.jpg", alt: "Lust Earrings", name: "Lust", material: "Amethyst", description: "An earring from the Sinful collection." },
        { src: "envy.jpg", alt: "Envy Bracelet", name: "Envy", material: "Diamond", description: "A bracelet from the Sinful collection." },
        { src: "wrath.jpg", alt: "Wrath Necklace", name: "Wrath", material: "Gold", description: "A necklace from the Sinful collection." }
    ], document.querySelector(".rings .jewelries"));

    showGridJewelries([
        { src: "../assets/images/ring.png", alt: "Sloth Ring", name: "Seraphim", material: "Gold", description: "A ring from the Angels collection." },
        { src: "lust.jpg", alt: "Lust Earrings", name: "Lust", material: "Amethyst", description: "An earring from the Sinful collection." },
        { src: "envy.jpg", alt: "Envy Bracelet", name: "Envy", material: "Diamond", description: "A bracelet from the Sinful collection." },
        { src: "wrath.jpg", alt: "Wrath Necklace", name: "Wrath", material: "Gold", description: "A necklace from the Sinful collection." }
    ], document.querySelector(".earrings .jewelries"));

    showGridJewelries([
        { src: "../assets/images/ring.png", alt: "Sloth Ring", name: "Seraphim", material: "Gold", description: "A ring from the Angels collection." },
        { src: "lust.jpg", alt: "Lust Earrings", name: "Lust", material: "Amethyst", description: "An earring from the Sinful collection." },
        { src: "envy.jpg", alt: "Envy Bracelet", name: "Envy", material: "Diamond", description: "A bracelet from the Sinful collection." },
        { src: "wrath.jpg", alt: "Wrath Necklace", name: "Wrath", material: "Gold", description: "A necklace from the Sinful collection." }
    ], document.querySelector(".Necklaces .jewelries"));

    showGridJewelries([
        { src: "../assets/images/ring.png", alt: "Sloth Ring", name: "Seraphim", material: "Gold", description: "A ring from the Angels collection." },
        { src: "lust.jpg", alt: "Lust Earrings", name: "Lust", material: "Amethyst", description: "An earring from the Sinful collection." },
        { src: "envy.jpg", alt: "Envy Bracelet", name: "Envy", material: "Diamond", description: "A bracelet from the Sinful collection." },
        { src: "wrath.jpg", alt: "Wrath Necklace", name: "Wrath", material: "Gold", description: "A necklace from the Sinful collection." }
    ], document.querySelector(".Bracelets .jewelries"));
});