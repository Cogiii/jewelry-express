function displayFooter() {
    const footer = document.querySelector('footer');

    const template = `
        <div class="thankyou_overlay">
            <div class="container">
                <h2>Thank you!</h2>
    
                <p>Check your email for more updates.</p>
                <button id="okayBtn">Okay</button>
            </div>
        </div>

        <section class="news_letter">
            <h2>Subscribe to our Newsletter</h2>

            <form action="" id="newsletterForm">
                <input type="email" name="news_email" id="news_email" class="news_email" autocomplete="email" placeholder="Write your email here..." required>
                <button type="submit">Send</button>
            </form>
        </section>

        <section class="customer_care">
            <div class="dropdown">
                <h2>Customer Care</h2>

                <p><i class="arrow down"></i></p>
            </div>

            <div class="details" id="customer_care_details">
                <p>CONTACT US</p>
                <p>CALL NOW: (+63 969 617 8289)</p>
                <p>BOOK AND APPOINTMENT</p>
            </div>
        </section>

        <section class="store_details">
            <h2>Follow Us</h2>

            <div class="social_links">
                <a href="https://www.facebook.com/jewelryexpressdavao" target="_blank">
                    <img src="../assets/icons/ri_facebook-line.webp" alt="Facebook">
                </a>
                <a href="https://www.instagram.com/janelly_joyce/" target="_blank">
                    <img src="../assets/icons/circum_instagram.webp" alt="Instagram">
                </a>
            </div>

            <img src="../assets/images/Jewelry_Express_Logo_Transparent 2.webp" alt="Jewelry Express Logo" class="logo">
        </section>

        <div class="bottom">
            <p>&#169; Jewelry Express Davao</p>
        </div>
    `;

    footer.innerHTML = template;
}

$(document).ready(function () {
    $('.dropdown').click(function () {
        $(document.getElementsByClassName('arrow')).toggleClass('down up');
        $('#customer_care_details').stop().slideToggle(300);
    });
});

function getCustomerEmail() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById("news_email");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page refresh

        const emailValue = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // console.log(emailValue);

        if (!emailPattern.test(emailValue)) {
            emailInput.setCustomValidity("Please enter a valid email address.");
        } else {
            try {
                const response = await fetch('/api/addCustomerEmail', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ customerEmail: emailValue})
                });

                const data = await response.json();

                if(response.ok) {
                    displayThankYouOverlay();
                    emailInput.setCustomValidity("");
                } else {
                    emailInput.setCustomValidity(data.message);
                }

            } catch (error) {
                emailInput.setCustomValidity("Error in subscribing the email. try again later!");
            }
        }

        emailInput.reportValidity();
    });

    // Clear custom error on input change
    emailInput.addEventListener("input", function () {
        emailInput.setCustomValidity("");
    });
}

function displayThankYouOverlay() {
    const thankYouOverlay = document.querySelector('.thankyou_overlay');
    const container = document.querySelector('.thankyou_overlay .container');
    const okayBtn = document.getElementById('okayBtn');

    thankYouOverlay.style.opacity = '1';
    thankYouOverlay.style.visibility = 'visible';
    setTimeout(() => {
        container.style.transform = 'scale(1)';
    }, 100);

    okayBtn.addEventListener('click', () => {
        container.style.transform = 'scale(0)';
        setTimeout(() => {
            thankYouOverlay.style.opacity = '0';
            thankYouOverlay.style.visibility = 'hidden';
        }, 300);
    })
}

// Newsletter Email
document.addEventListener("DOMContentLoaded", function () {
    displayFooter();
    getCustomerEmail();
});
