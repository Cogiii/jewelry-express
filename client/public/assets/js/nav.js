document.addEventListener("DOMContentLoaded", function () {
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
        window.location.href = "/book-Appointment";
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

		if(this.classList.contains('open'))
			mobile_links.style.display = 'block';
		else 
		mobile_links.style.display = 'none';
	});

	$('.dropdown_arrow').click(function(){
		$(this).toggleClass('down up');
	});
});
