function appointmentType() {
    const types = new Set();
    const appointment_services_container = document.querySelector('.appointment_services_container');
    const services =  document.querySelectorAll('.appointment_services_container .service');
    const errorMessage = document.querySelector('.appointment_services_container .error_message');

    services.forEach(service => {
        service.addEventListener('click', function () {
            this.classList.toggle('selected');
            const serviceDataValue = this.dataset.value; 

            this.classList.contains('selected') ? types.add(serviceDataValue) : types.delete(serviceDataValue);
            appointment_services_container.classList.remove('error');
            errorMessage.textContent = "";
        });
    });

    return () => [...types]; // Return a function to get the selected values
}

function calendarFormInput(onDateSelect) {
    const calendarDates = document.querySelector(".calendar-dates");
    const currentMonthYear = document.getElementById("currentMonthYear");
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");
    const emptyTimeText = document.querySelector(".available_time_container p");

    let today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let selectedYear = currentYear;
    let selectedMonth = currentMonth;
    let selectedDate = null;

    function renderCalendar() {
        const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
        const lastDate = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"];
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        currentMonthYear.textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
        calendarDates.innerHTML = "";

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            calendarDates.appendChild(emptyCell);
        }

        for (let day = 1; day <= lastDate; day++) {
            const dateCell = document.createElement("div");
            dateCell.textContent = day;
            let cellDate = new Date(selectedYear, selectedMonth, day);

            if (cellDate < today.setHours(0, 0, 0, 0)) {
                dateCell.classList.add("disabled");
            } else {
                if (
                    selectedDate &&
                    selectedDate.year === selectedYear &&
                    selectedDate.month === selectedMonth &&
                    selectedDate.day === day
                ) {
                    dateCell.classList.add("selected");
                }

                dateCell.addEventListener("click", async function () {
                    document.querySelectorAll(".calendar-dates div").forEach(el => el.classList.remove("selected"));
                    dateCell.classList.add("selected");

                    let selectedWeekday = weekDays[cellDate.getDay()];

                    selectedDate = { 
                        year: selectedYear, 
                        month: selectedMonth+1, 
                        day: day, 
                        weekday: selectedWeekday
                    };
                    // console.log(selectedMonth);
                    document.querySelector(".calendar").classList.remove("error");
                    document.querySelector(".calendar .error_message").textContent = "";
                    emptyTimeText.style.display = "none";
                    
                    // Call the callback function to update available times
                    await onDateSelect(selectedDate);
                });
            }
            calendarDates.appendChild(dateCell);
        }

        prevMonth.disabled = (selectedYear === currentYear && selectedMonth === currentMonth);
    }

    prevMonth.addEventListener("click", function () {
        if (!(selectedYear === currentYear && selectedMonth === currentMonth)) {
            selectedMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
            selectedYear = selectedMonth === 11 ? selectedYear - 1 : selectedYear;
            renderCalendar();
        }
    });

    nextMonth.addEventListener("click", function () {
        selectedMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
        selectedYear = selectedMonth === 0 ? selectedYear + 1 : selectedYear;
        renderCalendar();
    });

    renderCalendar();

    return () => selectedDate; // Return function to get the selected date
}

async function getUnavailableTimes(selectedDate) {
    try {
        const formattedDate = `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`;

        const response = await fetch(`/api/getUnavailableTimes/${formattedDate}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        return data.unavailableTimes || [];
    } catch (error) {
        console.error("Error fetching unavailable times:", error);
        return [];
    }
}



async function renderAvailableTime(selectedDate) {
    const timeSlots = [
        "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "1:00 PM", "1:30 PM", "2:00 PM",
        "2:30 PM", "3:00 PM", "3:30 PM"
    ];
    
    const timeSlotsContainer = document.getElementById("timeSlots");
    let selectedTime = null; // Store the selected time
    
    // Get the current time
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const isToday = selectedDate.year === now.getFullYear() &&
                    selectedDate.month-1 === now.getMonth() &&
                    selectedDate.day === now.getDate();
    
    // Convert time to 24-hour format for comparison
    const convertTo24Hour = (timeStr) => {
        let [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return { hours, minutes };
    };
    
    // Fetch unavailable times for the selected date
    const unavailableTimes = await getUnavailableTimes(selectedDate);
    
    // Add past times to unavailable times (only if today)
    if (isToday) {
        timeSlots.forEach(time => {
            const { hours, minutes } = convertTo24Hour(time);
            if (hours < currentHours || (hours === currentHours && minutes <= currentMinutes)) {
                unavailableTimes.push(time);
            }
        });
    }

    timeSlotsContainer.innerHTML = ""; // Clear existing slots

    timeSlots.forEach(time => {
        const timeButton = document.createElement("div");
        timeButton.textContent = time;
        timeButton.classList.add("time-slot");

        if (unavailableTimes.includes(time)) {
            timeButton.classList.add("disabled");
        } else {
            timeButton.addEventListener("click", function () {
                document.querySelectorAll(".time-slot").forEach(slot => slot.classList.remove("selected"));
                timeButton.classList.add("selected");
                selectedTime = time; // Store selected time

                document.querySelector(".available_time_container").classList.remove("error");
                document.querySelector(".available_time_container .error_message").textContent = "";
            });
        }

        timeSlotsContainer.appendChild(timeButton);
    });

    return () => selectedTime; // Return function to get the selected time
}

function validateForm() {
    // Fields to validate
    // If add another field, it must be from bottom to top to scroll to the first error
    const fields = [
        { field: document.getElementById('purpose'), message: "Please select a purpose." },
        { field: document.getElementById('email'), message: "Please enter a valid email address.", pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
        { field: document.getElementById('countryCode'), message: "Please select your country code." },
        { field: document.getElementById('contactNumber'), message: "Please enter a valid contact number.", pattern: /^9\d{9}$/ },
        { field: document.getElementById('lastName'), message: "Please enter your last name." },
        { field: document.getElementById('firstName'), message: "Please enter your first name." }
    ];
    let isValid = true;
    for (let { field, message, pattern } of fields) {
        if (!field) continue; // Skip if field doesn't exist
        const value = field.value.trim();

        field.setCustomValidity("");
        if (!value || (pattern && !pattern.test(value))) {
            field.setCustomValidity(message);
            field.reportValidity();
            field.scrollIntoView({ behavior: "smooth", block: "center" });
            isValid = false;
            field.classList.add('error');
        }
    }

    return isValid; // Validation passed
}

function appointmentForm() {
    const getAppointmentTypes = appointmentType();
    
    let getSelectedDate = null;
    let getSelectedTime = null;

    function onDateSelected(selectedDate) {
        getSelectedDate = selectedDate; // Store the actual date value, not a function
        renderAvailableTime(selectedDate).then(timeGetter => {
            getSelectedTime = timeGetter;
        });
    }

    calendarFormInput(onDateSelected); // Initialize calendar with the callback

    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');
    const contactNumberField = document.getElementById('contactNumber');
    const countryCodeField = document.getElementById('countryCode');
    const emailField = document.getElementById('email');
    const purposeField = document.getElementById('purpose');

    document.getElementById('appointment_form').addEventListener('submit', function (event) {
        event.preventDefault();

        const firstName = firstNameField.value.trim();
        const lastName = lastNameField.value.trim();
        const countryCode = countryCodeField.value.trim();
        const contactNumber = contactNumberField.value.trim();
        const email = emailField.value.trim();
        const purpose = purposeField.value.trim();
        const selectedServices = getAppointmentTypes();
        
        const formData = new FormData();

        // console.log(selectedServices)

        if(!getSelectedTime) {
            const timeSlots = document.querySelector('.available_time_container');
            const errorMessage = document.querySelector('.available_time_container .error_message');
            timeSlots.scrollIntoView({ behavior: 'smooth', block: 'center' });
            timeSlots.classList.add('error');
            errorMessage.textContent = "Please select a time.";
        }

        if(!getSelectedDate) {
            const calendar = document.querySelector('.calendar');
            const errorMessage = document.querySelector('.calendar_container .error_message');
            calendar.scrollIntoView({ behavior: 'smooth', block: 'center' });
            calendar.classList.add('error');
            errorMessage.textContent = "Please select a date.";
        }
        
        if(!selectedServices || selectedServices.length <= 0) {
            const appointment_services_container = document.querySelector('.appointment_services_container');
            const errorMessage = document.querySelector('.appointment_services_container .error_message');
            appointment_services_container.scrollIntoView({ behavior: 'smooth', block: 'center' });
            appointment_services_container.classList.add('error');
            errorMessage.textContent = "Please select type of services you want.";
        }

        if(!validateForm() || !getSelectedDate || !getSelectedTime || !selectedServices || selectedServices.length <= 0) {
            return;
        }

        const fullNumber = `${countryCode}${contactNumber}`;

        // console.log("Selected Services:", getAppointmentTypes());
        // console.log("Selected Date:", getSelectedDate || "No date selected");
        // console.log("Selected Time:", getSelectedTime ? getSelectedTime() : "No time selected");

        // Validate form before toggling visibility
        if (this.checkValidity()) {
            event.preventDefault();

            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('contactNumber', fullNumber);
            formData.append('purpose', purpose);
            formData.append('services', JSON.stringify(selectedServices));
            formData.append('date', JSON.stringify(getSelectedDate));
            formData.append('time', getSelectedTime());
            
            const form = document.querySelector('section.form');
            const confirmation = document.querySelector('section.confirmation');
            form.classList.add('hide');
            confirmation.classList.add('show');
            submitConfirmedInfo(formData);
            confirmation.scrollIntoView({ block: 'center' });
        }
    });

    // Remove leading zero when user types
    contactNumberField.addEventListener("input", function () {
        contactNumberField.setCustomValidity("");
        if (this.value.startsWith('0')) {
            this.value = this.value.substring(1);
        }
    });

    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('change', function () {
            field.setCustomValidity("");
            this.classList.remove('error');
        });
    });    

    // Reset validation when country code changes
    countryCodeField.addEventListener("change", function () {
        contactNumberField.setCustomValidity("");
        this.classList.remove('error');
    });
}

function displayOverlay(header, message) {
    const thankYouOverlay = document.querySelector('.overlay');
    const container = document.querySelector('.overlay .container');
    const headerText = document.querySelector('.overlay .container h2');
    const messageText = document.querySelector('.overlay .container p');
    const okayBtn = document.getElementById('okayBtn');

    headerText.textContent = header;
    messageText.textContent = message;

    thankYouOverlay.style.opacity = '1';
    thankYouOverlay.style.visibility = 'visible';
    setTimeout(() => {
        container.style.transform = 'scale(1)';
    }, 100);

    okayBtn.addEventListener('click', async () => {
        container.style.transform = 'scale(0)';
        await setTimeout(() => {
            thankYouOverlay.style.opacity = '0';
            thankYouOverlay.style.visibility = 'hidden';
        }, 300);

        window.location.href = '/';
    })
}

function submitConfirmedInfo(formData) {
    const goBack = document.getElementById('goBack');
    const dateText = document.getElementById('date');
    const dayTimeText = document.getElementById('dayTime');
    const fullNameText = document.querySelector('#full_name_info p');
    const contactNumberText = document.querySelector('#contact_number_info p');
    const emailText = document.querySelector('#email_info p');
    const servicesText = document.querySelector('#services_info p');
    const purposeText = document.querySelector('.purpose_details p');
    const submitAppointmentBtn = document.getElementById('submitAppointmentBtn');

    // Get values from FormData
    const firstName = formData.get('firstName') || 'N/A';
    const lastName = formData.get('lastName') || 'N/A';
    const email = formData.get('email') || 'N/A';
    const contactNumber = formData.get('contactNumber') || 'N/A';
    const purpose = formData.get('purpose') || 'N/A';
    const services = formData.get('services') ? JSON.parse(formData.get('services')) : [];
    const dateObj = formData.get('date') ? JSON.parse(formData.get('date')) : null;
    const time = formData.get('time') || 'N/A';

    let formattedDate = 'N/A';
    let dayOfWeek = 'N/A';

    if (dateObj && dateObj.year && dateObj.month - 1 && dateObj.day) {
        const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day); // Month is 0-based
        formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    }

    let formattedNumber = 'N/A';
    if (contactNumber.match(/^\+639\d{9}$/)) {
        formattedNumber = contactNumber.replace(/^\+63(\d{3})(\d{3})(\d{4})$/, '(+63) $1 $2 $3');
    }

    // Convert services array to a string
    const servicesTextValue = Array.isArray(services) ? services.join(', ') : 'N/A';

    // Display the data
    dateText.textContent = formattedDate;
    dayTimeText.textContent = `${dayOfWeek} - ${time}`;
    fullNameText.textContent = `${firstName} ${lastName}`;
    contactNumberText.textContent = formattedNumber;
    emailText.textContent = email;
    servicesText.textContent = servicesTextValue;
    purposeText.textContent = purpose;

    // Go back event listener
    goBack.addEventListener('click', () => {
        const form = document.querySelector('section.form');
        const confirmation = document.querySelector('section.confirmation');
        form.classList.remove('hide');
        confirmation.classList.remove('show');
    });

    // Define a single submit event handler
    async function submitAppointmentHandler() {
        submitAppointmentBtn.textContent = "Submitting...";
        submitAppointmentBtn.disabled = true;

        try {
            // Check if date and time are available
            const response = await fetch(`/api/checkIfDateAndTimeAvailable?date=${encodeURIComponent(formattedDate)}&time=${encodeURIComponent(time)}`);
            const date = await response.json();

            if (date.isAvailable) {
                // Proceed with adding appointment
                const appointmentResponse = await fetch('/api/addAppointment', {
                    method: 'POST',
                    body: formData
                });

                const data = await appointmentResponse.json();
                
                if (data.message === 'Appointment added successfully!') {
                    displayOverlay("Thank You!", "Check your email and messages for your appointment’s updates.");
                    const message = `
                    Date & Time: ${formattedDate} ${time}
                    Location: Door 63 Hermanos Bldg. Legaspi St. Davao City
                    Service: ${servicesTextValue}
                    purpose: ${purpose}
                    `
                    sendMail(formData.get('email'), `${firstName} ${lastName}`, message);
                } else {
                    console.error("Error: Unexpected response", data);
                }
            } else {
                console.log("Appointment slot is not available.");
            }
        } catch (error) {
            console.error("Error in adding appointment:", error);
        } finally {
            submitAppointmentBtn.textContent = "Submit";
            submitAppointmentBtn.disabled = false;
        }
    }

    // Ensure the event listener is only added once
    submitAppointmentBtn.removeEventListener('click', submitAppointmentHandler);
    submitAppointmentBtn.addEventListener('click', submitAppointmentHandler);
}

function showProductAppointed() {
    const path = window.location.pathname.split("/");
    const productId = path[2];

    
    if(productId) {
        fetch(`/api/getProduct/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(async product => {
            product = product[0]
            // Select elements to update
            const productContainer = document.querySelector('.product');
            productContainer.style.display = 'block';
            const productImage = document.querySelector('.product .details img');
            const productName = document.querySelector('.product .details .name');
            const productMaterial = document.querySelector('.product .details .material');
            const productDescription = document.querySelector('.product .description');

            const imageResponse = await fetch(`/api/getProductImage/${productId}`);
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            
            productImage.src = imageUrl;
            productImage.alt = product.product_name;
            productName.textContent = product.product_name;
            productMaterial.textContent = product.product_material;
            productDescription.textContent = product.product_description;
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
            
    } else {
        console.log("NO")
    }

}

document.addEventListener("DOMContentLoaded", function () {
    showProductAppointed();
    appointmentForm();
});
