function calendarFormInput() {
    const calendarDates = document.querySelector(".calendar-dates");
    const currentMonthYear = document.getElementById("currentMonthYear");
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");

    let today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let selectedYear = currentYear;
    let selectedMonth = currentMonth;

    function renderCalendar() {
        const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
        const lastDate = new Date(selectedYear, selectedMonth + 1, 0).getDate();

        const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];

        currentMonthYear.textContent = `${monthNames[selectedMonth]} ${selectedYear}`;
        calendarDates.innerHTML = "";

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            calendarDates.appendChild(emptyCell);
        }

        for (let day = 1; day <= lastDate; day++) {
            const dateCell = document.createElement("div");
            dateCell.textContent = day;
            dateCell.dataset.date = `${monthNames[selectedMonth]} ${day}, ${selectedYear}`;

            let cellDate = new Date(selectedYear, selectedMonth, day);

            // Disable past dates
            if (cellDate < today.setHours(0, 0, 0, 0)) {
                dateCell.classList.add("disabled");
            } else {
                dateCell.addEventListener("click", function () {
                    document.querySelectorAll(".calendar-dates div").forEach(el => el.classList.remove("selected"));
                    dateCell.classList.add("selected");

                    const dateInput = dateCell.dataset.date;
                    console.log(dateInput);
                });
            }

            calendarDates.appendChild(dateCell);
        }

        // Disable previous month navigation if on the current month
        prevMonth.disabled = (selectedYear === currentYear && selectedMonth === currentMonth);
    }

    prevMonth.addEventListener("click", function () {
        if (!(selectedYear === currentYear && selectedMonth === currentMonth)) {
            selectedMonth--;
            if (selectedMonth < 0) {
                selectedMonth = 11;
                selectedYear--;
            }
            renderCalendar();
        }
    });

    nextMonth.addEventListener("click", function () {
        selectedMonth++;
        if (selectedMonth > 11) {
            selectedMonth = 0;
            selectedYear++;
        }
        renderCalendar();
    });

    renderCalendar();
}

function renderAvailableTime() {
    const timeSlots = [
        "8:00 AM", "8:30 AM", "9:00 AM",
        "9:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 NN",
        "1:00 PM", "1:30 PM", "2:00 PM",
        "2:30 PM", "3:00 PM", "3:30 PM"
    ];

    const unavailableTimes = ["11:30 AM", "12:00 NN", "3:30 PM"]; // Unavailable time slots
    const timeSlotsContainer = document.getElementById("timeSlots");

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
                console.log("Selected Time:", time);
            });
        }

        timeSlotsContainer.appendChild(timeButton);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    calendarFormInput();
    renderAvailableTime();
});
