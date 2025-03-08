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
                        month: selectedMonth, 
                        day: day, 
                        weekday: selectedWeekday // Store the weekday
                    };
                    
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
        const formattedDate = `${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.day}`;

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
                    selectedDate.month === now.getMonth() &&
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
    const fields = [
        { field: document.getElementById('purpose'), message: "Please select a purpose." },
        { field: document.getElementById('email'), message: "Please enter a valid email address.", pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
        { field: document.getElementById('countryCode'), message: "Please select your country code." },
        { field: document.getElementById('contactNumber'), message: "Please enter a valid contact number." },
        { field: document.getElementById('lastName'), message: "Please enter your last name." },
        { field: document.getElementById('firstName'), message: "Please enter your first name." }
    ];
    let isValid = true;

    for (let { field, message, pattern } of fields) {
        if (!field) continue; // Skip if field doesn't exist
        const value = field.value.trim();

        console.log("TEST")

        if (!value || (pattern && !pattern.test(value))) {
            field.setCustomValidity(message);
            field.reportValidity(); // Show error message
            field.scrollIntoView({ behavior: "smooth", block: "center" });
            isValid = false; // Stop further validation
            field.style.border = 'solid red 1px';
        } else {
            field.setCustomValidity(""); // Clear error
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

    const contactNumberField = document.getElementById('contactNumber');
    const countryCodeField = document.getElementById('countryCode');
    const emailField = document.getElementById('email');

    document.getElementById('appointment_form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent page refresh

        const countryCode = countryCodeField.value.trim();
        const contactNumber = contactNumberField.value.trim();
        const email = emailField.value.trim();
        const selectedServices = getAppointmentTypes();
        // getSelectedDate
        // getSelectedTime
        
        console.log(selectedServices)

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

        const fullNumber = `${countryCode}-${contactNumber}`;
        const regex = new RegExp(`^\\${countryCode}-9\\d{9}$`); // Ensures countryCode and format are correct

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
            emailField.setCustomValidity("Please enter a valid email address.");
            emailField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            emailField.setCustomValidity("");
        }

        if (!regex.test(fullNumber)) {
            contactNumberField.setCustomValidity("Invalid contact number format");
            contactNumberField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            contactNumberField.setCustomValidity(""); // Clear error if valid
        }

        console.log("Selected Services:", getAppointmentTypes());
        console.log("Selected Date:", getSelectedDate || "No date selected");
        console.log("Selected Time:", getSelectedTime ? getSelectedTime() : "No time selected");

        // Validate form before toggling visibility
        if (this.checkValidity()) {
            event.preventDefault();
            
            const form = document.querySelector('section.form');
            const confirmation = document.querySelector('section.confirmation');
            form.classList.add('hide');
            confirmation.classList.add('show');
            submitConfirmedInfo();
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
            this.style.border = 'none';
        });
    });    

    // Reset validation when country code changes
    countryCodeField.addEventListener("change", function () {
        contactNumberField.setCustomValidity("");
        this.style.border = 'none';
    });
}

function submitConfirmedInfo() {
    const goBack = document.getElementById('goBack');

    goBack.addEventListener('click', () => {
        const form = document.querySelector('section.form');
        const confirmation = document.querySelector('section.confirmation');
        form.classList.remove('hide');
        confirmation.classList.remove('show');
    });
}

document.addEventListener("DOMContentLoaded", function () {
    appointmentForm();
});
