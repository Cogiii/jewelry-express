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
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Improved regex

        console.log(emailValue);

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
    getCustomerEmail();
});
