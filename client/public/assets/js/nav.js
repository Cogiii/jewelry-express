function displayNav() {
    const nav = document.querySelector('nav');

    const template = `
        <div class="mobile_look">
            <div class="mobile_nav">
                <div id="menu">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <button class="search" id="search"><img src="../assets/icons/ion_search-outline.webp" alt="search icon"></button>
        </div>

        <div class="mobile_links" id="mobile_links">
            <ul>
                <li><a href="/jewelries">Jewelries</a></li>
                <hr>
                <li><a href="/jewelries/#ring">Ring</a></li>
                <li><a href="/jewelries/#earring">Earring</a></li>
                <li><a href="/jewelries/#necklace">Necklace</a></li>
                <li><a href="/jewelries/#bracelet">Bracelet</a></li>
                <hr>
                <li><a href="/jewelries/#amethyst">Amethyst</a></li>
                <li><a href="/jewelries/#gold">Gold</a></li>
                <li><a href="/jewelries/#diamond">Diamond</a></li>
                <hr>
                <li><a href="/#services">Services</a></li>
            </ul>

            <div class="info">
                <div class="location">
                    <img src="../assets/icons/circum_location-on.webp" alt="location">
                    <p>Door 63 Hermanos Bldg. Legaspi St. Davao City</p>
                </div>
                <div class="contact_number">
                    <img src="../assets/icons/mdi-light_phone.webp" alt="phone">
                    <p>(+63) 981 084 8830</p>
                </div>
                <div class="weekdays_open">
                    <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                </div>
                <div class="weekend_open">
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                </div>
            </div>
        </div>

        <div class="logo">
            <a href="/">
                <img src="../assets/images/Jewelry Express Assets 1.webp" alt="Jewelry Express Logo">
            </a>
        </div>

        <div class="bookAppointment">
            <button id="bookAppointmentBtn"><img src="../assets/icons/Group.webp" alt="appointment"></button>
        </div>

        <div class="search-container" id="searchContainer">
            <img src="../assets/icons/ion_search-outline.webp" alt"search">
            <input type="text" id="searchInput" placeholder="Search creations, categories, materials ..." />
            <button id="closeSearch">&times;</button>
        </div>

        <div id="searchResults" class="search-results"></div>
    `;

    nav.innerHTML = template;
}

document.addEventListener("DOMContentLoaded", function () {
    displayNav();
    search();

    const searchBtn = document.getElementById("search");
    const searchContainer = document.getElementById("searchContainer");
    const closeSearchBtn = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");
	const bookAppointmentBtn = document.getElementById('bookAppointmentBtn')

    // Open search when button is clicked
    searchBtn.addEventListener("click", function (event) {
        event.preventDefault();
        searchContainer.classList.add("active");
        setTimeout(() => {
            searchInput.focus({ preventScroll: true });
        }, 0);
    });

    // Close search when close button is clicked
    closeSearchBtn.addEventListener("click", function () {
        searchContainer.classList.remove("active");
    });
    // Close search when close button is clicked
    bookAppointmentBtn.addEventListener("click", function () {
        window.location.href = "/appointment";
    });

    // Close search when clicking outside input
    document.addEventListener("click", function (e) {
        if (!searchContainer.contains(e.target) && !searchBtn.contains(e.target)) {
            searchContainer.classList.remove("active");
        }
    });

    // Close search when pressing "Esc"
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            searchContainer.classList.remove("active");
        }
    });
});

$(document).ready(function(){
    const mobile_links = document.getElementById('mobile_links');

	$('#menu').click(function(){
		$(this).toggleClass('open');

        document.body.classList.toggle('no-scroll', this.classList.contains('open'));
        mobile_links.classList.toggle('open_links', this.classList.contains('open'));
	});

	$('.dropdown_arrow').click(function(){
		$(this).toggleClass('down up');
	});

    $('.mobile_links ul li a').click(function () {
        $('#menu').toggleClass('open');
        
        document.body.classList.toggle('no-scroll', this.classList.contains('open'));
        mobile_links.classList.toggle('open_links', this.classList.contains('open'));
    });
});

function search() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const closeSearch = document.getElementById("closeSearch");

    searchInput.addEventListener("input", async () => {
        const query = searchInput.value.trim();
        
        if (query.length === 0) {
            searchResults.innerHTML = "";
            searchResults.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`/api/searchProducts?q=${query}`);
            if (!response.ok) throw new Error("Failed to fetch search results");

            const products = await response.json();
            displayResults(products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    });

    function displayResults(products) {
        searchResults.innerHTML = "";

        if (products.length === 0) {
            searchResults.innerHTML = "<p style='text-align: center;'>No results found</p>";
        } else {
            products.forEach(async product => {
                const imageResponse = await fetch(`/api/getProductImage/${product.product_id}`);
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);

                const item = document.createElement("div");
                item.classList.add("search-result-item");
                item.innerHTML = `
                    <img src="${imageUrl}" alt="${product.product_name}">
                    <span>${product.product_name}</span>
                `;
                item.addEventListener("click", () => {
                    window.location.href = `/collection/${product.product_id}`;
                });

                searchResults.appendChild(item);
            });
        }

        searchResults.style.display = "block";
    }

    closeSearch.addEventListener("click", () => {
        searchInput.value = "";
        searchResults.innerHTML = "";
        searchResults.style.display = "none";
    });

    document.addEventListener("click", (event) => {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = "none";
        }
    });
}
