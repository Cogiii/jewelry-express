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
                <li><a href="">Jewelries</a></li>
                <hr>
                <li><a href="">Ring</a></li>
                <li><a href="">Earring</a></li>
                <li><a href="">Necklace</a></li>
                <li><a href="">Bracelet</a></li>
                <hr>
                <li><a href="">Amethyst</a></li>
                <li><a href="">Gold</a></li>
                <li><a href="">Diamond</a></li>
                <hr>
                <li><a href="">Services</a></li>
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
            <input type="text" id="searchInput" placeholder="Search..." />
            <button id="closeSearch">&times;</button>
        </div>
    `;

    nav.innerHTML = template;
}

document.addEventListener("DOMContentLoaded", function () {
    displayNav();

    const searchBtn = document.getElementById("search");
    const searchContainer = document.getElementById("searchContainer");
    const closeSearchBtn = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");
	const bookAppointmentBtn = document.getElementById('bookAppointmentBtn')

    // Open search when button is clicked
    searchBtn.addEventListener("click", function () {
        searchContainer.classList.add("active");
        searchInput.focus();
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
	$('#menu').click(function(){
		$(this).toggleClass('open');

		const mobile_links = document.getElementById('mobile_links');
        document.body.classList.toggle('no-scroll', this.classList.contains('open'));
        mobile_links.classList.toggle('open_links', this.classList.contains('open'));
	});

	$('.dropdown_arrow').click(function(){
		$(this).toggleClass('down up');
	});
});
