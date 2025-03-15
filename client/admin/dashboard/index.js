const logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    window.location.href = '/auth/logout';
    console.log("YESY")
});
// dashboard.js - Customer modal functionality for dashboard

let appointmentData;
document.addEventListener('DOMContentLoaded', function() {
    const userName = document.querySelector('.user-profile .userName');
    userName.textContent = localStorage.getItem('username');

    fetchAppointmentCounts();
    fetchUpcomingAppointments();
});

function fetchUpcomingAppointments() {
    const dropdown = document.querySelector(".dropdown");

    // Function to get the selected filter type and fetch data
    function fetchAppointments() {
        let selectedValue = dropdown.value.toLowerCase(); // Get dropdown value

        // Map dropdown text to query parameter
        let filter = "day"; // Default
        if (selectedValue.includes("week")) {
            filter = "week";
        } else if (selectedValue.includes("month")) {
            filter = "month";
        }

        fetch(`/api/getAppointments?range=${filter}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Format appointments
                    const appointments = data.data.map((appointment, index) => ({
                        appointmentId: appointment.appointment_id,
                        customerId: appointment.customer_id,
                        firstName: appointment.first_name,
                        lastName: appointment.last_name,
                        name: `${appointment.first_name} ${appointment.last_name}`,
                        emails: appointment.emails,
                        contactNumbers: appointment.contact_numbers,
                        schedule: new Date(appointment.sched_of_appointment).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                        }),
                        time: new Date(appointment.sched_of_appointment).toLocaleTimeString('en-US', { 
                            hour: 'numeric', minute: '2-digit', hour12: true 
                        }),
                        purpose: appointment.appointment_purpose,
                        appointedDate: new Date(appointment.date_appointed).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                        }),
                        rowType: index === 0 ? "normal" : (index === 1 ? "expandable" : "hidden") // Adjust row type logic as needed
                    }));

                    setupDashboardRowClicks(appointments);
                    updateTable(appointments);
                } else {
                    console.error("Failed to fetch appointments");
                }
            })
            .catch(error => console.error("Error fetching appointments:", error));
    }


    // Function to update the table
    function updateTable(appointments) {
        const tbody = document.querySelector(".table-container tbody");
        tbody.innerHTML = ""; // Clear previous rows
    
        if (appointments.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">No upcoming appointments found.</td></tr>`;
            return;
        }
    
        appointments.forEach(app => {
            const row = document.createElement("tr");
            row.id = `appointment-${app.appointmentId}`;
            row.innerHTML = `
                <td>${app.firstName}, ${app.lastName}</td>
                <td>${app.schedule} ${app.time}</td>
                <td>${app.purpose || "N/A"}</td>
                <td>${app.appointedDate}</td>
            `;
            tbody.appendChild(row);
        });
    
        // Attach click event AFTER rows are added
        setupDashboardRowClicks(appointments);
    }
    

    // Event listener for dropdown change
    dropdown.addEventListener("change", fetchAppointments);

    // Fetch default data on page load
    fetchAppointments();
}

async function fetchAppointmentCounts() {
    try {
        const response = await fetch("/api/appointment-counts"); // Adjust API path if needed
        const result = await response.json();

        if (result.success) {
            const { today_count, week_count, month_count } = result.data;

            // Update the UI with fetched data
            document.querySelector(".stat-box:nth-child(1) span").textContent = today_count;
            document.querySelector(".stat-box:nth-child(2) span").textContent = week_count;
            document.querySelector(".stat-box:nth-child(3) span").textContent = month_count;
        } else {
            console.error("Failed to fetch appointment counts:", result.message);
        }
    } catch (error) {
        console.error("Error fetching appointment counts:", error);
    }
}

/**
 * Set up click handlers for all customer rows in the dashboard table
 */
function setupDashboardRowClicks(appointments) {
    const tableBody = document.querySelector('.table-container tbody');

    if (!tableBody) {
        console.error("Table body not found");
        return;
    }

    const rows = tableBody.querySelectorAll('tr');

    if (rows.length === 0) {
        console.warn("No rows found to attach event listeners.");
        return;
    }

    rows.forEach((row, index) => {
        row.addEventListener('click', function (event) {
            if (event.target.tagName === 'BUTTON' || event.target.closest('button')) return;

            if (row.cells.length === 1 && row.cells[0].textContent.includes("No upcoming appointments found.")) return;

            if (index < appointments.length) {
                openDashboardCustomerModal(appointments[index]);
            }
        });

        row.style.cursor = 'pointer';
    });
}



/**
 * Open the customer modal with the provided data
 * @param {Object} customerData - Customer information
 * @param {Object} appointmentData - Appointment information
 */
function openDashboardCustomerModal(appointmentData) {
    const modal = document.getElementById('customer-modal');
    if (!modal) {
        console.error("Customer modal not found");
        return;
    }

    console.log("Opening modal with data:", appointmentData); // Debugging

    document.getElementById('modal-first-name').textContent = appointmentData.firstName || '';
    document.getElementById('modal-last-name').textContent = appointmentData.lastName || '';
    document.getElementById('modal-contact').textContent = appointmentData.contactNumbers || '';
    document.getElementById('modal-email').textContent = appointmentData.emails || '';
    document.getElementById('modal-date').textContent = appointmentData.schedule || '';
    document.getElementById('modal-time').textContent = appointmentData.time || '';
    document.getElementById('modal-purpose').textContent = appointmentData.purpose || '';
    document.getElementById('modal-date-appointed').textContent = appointmentData.appointedDate || '';

    // Show modal
    modal.style.display = 'block';

    setupModalClose(modal);
}

/**
 * Set up the close button and backdrop click for the modal
 * @param {HTMLElement} modal - The modal element
 */
function setupModalClose(modal) {
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => modal.style.display = 'none');
    }

    window.addEventListener('click', event => {
        if (event.target === modal) modal.style.display = 'none';
    });
}

/**
 * Set up the go back button for the modal
 * @param {HTMLElement} modal - The modal element
 */
function setupGoBackButton(modal) {
    const goBackButton = modal.querySelector('.goBackBtn');
    if (goBackButton) {
        goBackButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
}
