let appointmentData = null;
document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const customerModal = document.getElementById('customer-modal');
    const approvalModal = document.getElementById('approval-modal');
    const rejectionModal = document.getElementById('rejection-modal');
    const approvalConfirmModal = document.getElementById('approval-confirmation-modal');
    const rejectionConfirmModal = document.getElementById('rejection-confirmation-modal');
    const userName = document.querySelector('.user-profile .userName');
    userName.textContent = localStorage.getItem('username');
    
    fetchAppointments("Pending", "#pending-section .table-container");
    fetchAppointments("Approve", "#approved-section .table-container");
    fetchAppointments("Cancelled", "#cancelled-section .table-container");

    const logout = document.getElementById('logout');

    logout.addEventListener('click', () => {
        window.location.href = '/auth/logout';
        console.log("YESY")
    });
        

    // Setup See More buttons for expandable sections
    setupSeeMoreButtons();
    
    // Setup all modal actions and close buttons
    setupModals();
});

async function fetchAppointments(status, containerSelector) {
    try {
        const response = await fetch(`http://localhost:3000/api/get${status}Appointments`);
        const result = await response.json();

        if (!result.success) {
            console.error('Error fetching appointments:', result.message);
            return [];
        }

        const appointments = result.data.map((appointment, index) => ({
            appointmentId: appointment.appointment_id,
            customerId: appointment.customer_id,
            firstName: appointment.first_name,
            lastName: appointment.last_name,
            name: `${appointment.first_name} ${appointment.last_name}`,
            emails: appointment.emails,
            contactNumbers: appointment.contact_numbers,
            schedule: new Date(appointment.sched_of_appointment).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date(appointment.sched_of_appointment).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            purpose: appointment.appointment_purpose,
            appointedDate: new Date(appointment.date_appointed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            rowType: index === 0 ? "normal" : (index === 1 ? "expandable" : "hidden") // Adjust row type logic as needed
        }));        

        if(status == "Pending") createAppointmentsTable(appointments, "#pending-section .table-container");
        if(status == "Approve") createAppointmentsTable(appointments, "#approved-section .table-container");
        if(status == "Cancelled") createAppointmentsTable(appointments, "#cancelled-section .table-container");

        setupTableRowClicks(appointments, containerSelector);
    } catch (error) {
        console.error('Failed to fetch pending appointments:', error);
        return [];
    }
}

function createAppointmentsTable(data, containerSelector) {
    const container = document.querySelector(containerSelector);

    container.innerHTML = '';
    const appointments = data || [
        { name: "Navarez, Jaja Nikolkog", schedule: "Jun 29, 2004", time: "9:30 AM", purpose: "Buy", appointedDate: "Jun 14, 2004", rowType: "normal" },
        { name: "Navarez, Jaja Nikolkog", schedule: "Jun 29, 2004", time: "9:30 AM", purpose: "Buy", appointedDate: "Jun 14, 2004", rowType: "expandable" },
        { name: "Devera, Cory Khong", schedule: "Jun 30, 2004", time: "1:30 PM", purpose: "Cleaning", appointedDate: "Jun 17, 2004", rowType: "hidden" },
        { name: "Royeras, Mc Arthur Watapon", schedule: "Jun 30, 2004", time: "2:30 PM", purpose: "Maglu2", appointedDate: "Jun 4, 2004", rowType: "hidden" },
    ];

    // Create table element
    const table = document.createElement('table');

    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Customer</th>
            <th>Schedule of Appointment</th>
            <th>Purpose</th>
            <th>Date Appointed</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');

    // Loop through appointments and create rows
    appointments.forEach((appointment) => {
        const row = document.createElement('tr');

        // Apply appropriate class for hidden or expandable rows
        if (appointment.rowType === "hidden") {
            row.classList.add('hidden-row');
        } else if (appointment.rowType === "expandable") {
            row.classList.add('expandable-row');
        }

        // Insert row data
        row.innerHTML = `
            <td>${appointment.name}</td>
            <td>${appointment.schedule} <span class="time">${appointment.time}</span></td>
            <td>${appointment.purpose}</td>
            <td>${appointment.appointedDate}</td>
        `;

        tbody.appendChild(row);
    });

    // Append tbody to table
    table.appendChild(tbody);

    // Append table to container
    container.appendChild(table);
}

// =============================================
// ROW CLICK FUNCTIONALITY
// =============================================

function setupTableRowClicks(appointments, containerSelector) {
    // Get all tables inside the specified container
    const tables = document.querySelectorAll(`${containerSelector} table`);
    
    tables.forEach(table => {
        const section = table.closest('.appointment-section');
        const sectionId = section ? section.id : null;
        let status = 'pending';

        // Determine status based on section ID
        if (sectionId) {
            if (sectionId.includes('approved')) {
                status = 'approved';
            } else if (sectionId.includes('cancelled')) {
                status = 'cancelled';
            }
        }

        // Get all rows in this table except header rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            // Add a click event to each row
            row.addEventListener('click', function(event) {
                if (event.target.tagName === 'BUTTON' || event.target.closest('button')) {
                    return; // Ignore clicks on buttons
                }

                // Ensure the index exists in appointments
                if (index < appointments.length) {
                    openCustomerModal(appointments[index], status);
                }
            });

            // Add a visual indication that rows are clickable
            row.style.cursor = 'pointer';
        });
    });
}

function openCustomerModal(appointment, status) {
    appointmentData = appointment;

    // Extract appointment details
    const firstName = appointment.firstName;
    const lastName = appointment.lastName;
    const date = appointment.schedule;
    const time = appointment.time;
    const purpose = appointment.purpose;
    const dateAppointed = appointment.appointedDate;
    const contactNumber = appointment.contactNumbers || "No contact available"; // Handle missing numbers

    // Split emails and format them
    const emails = appointment.emails 
        ? appointment.emails.split(", ").map(email => `<div>${email}</div>`).join("")
        : "<div>No email available</div>"; // Handle missing emails

    // Update modal content
    document.getElementById('modal-first-name').textContent = firstName;
    document.getElementById('modal-last-name').textContent = lastName;
    document.getElementById('modal-date').textContent = date;
    document.getElementById('modal-time').textContent = time;
    document.getElementById('modal-purpose').textContent = purpose;
    document.getElementById('modal-date-appointed').textContent = dateAppointed;
    document.getElementById('modal-contact-number').innerHTML = contactNumber;
    document.getElementById('modal-email').innerHTML = emails;

    // Store the status as a data attribute
    const customerModal = document.getElementById('customer-modal');
    customerModal.setAttribute('data-source', status);

    // Update buttons based on status
    updateModalButtons(status);

    // Show the modal
    customerModal.style.display = 'block';
}


// =============================================
// SEE MORE FUNCTIONALITY
// =============================================

function setupSeeMoreButtons() {
    const seeMoreButtons = document.querySelectorAll('.see-more-btn');
    
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Prevent this click from bubbling up to the row
            event.stopPropagation();
            
            // Get the section ID from the button's data attribute
            const sectionId = this.getAttribute('data-section-id');
            
            if (sectionId) {
                toggleRows(sectionId);
            }
        });
    });
}

function toggleRows(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const hiddenRows = section.querySelectorAll('.hidden-row');
    const button = section.querySelector('.see-more-btn');
    
    // Toggle visibility of hidden rows
    hiddenRows.forEach(row => {
        row.classList.toggle('show');
    });
    
    // Toggle section expanded state
    section.classList.toggle('expanded');
    
    // Change button text
    if (section.classList.contains('expanded')) {
        button.textContent = 'See less';
    } else {
        button.textContent = 'See more';
    }
}

// =============================================
// MODAL FUNCTIONALITY
// =============================================

function setupModals() {
    // Set up close buttons
    setupCloseButtons();
    
    // Set up action buttons
    setupActionButtons();
}

function setupCloseButtons() {
    // All elements with class 'modal-close' should close modals
    const closeButtons = document.querySelectorAll('.modal-close, .approval-close, .rejection-close, .confirmation-close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Clicking outside modal content should close modal
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

function setupActionButtons() {
    // Get modals
    const customerModal = document.getElementById('customer-modal');
    const approvalModal = document.getElementById('approval-modal');
    const rejectionModal = document.getElementById('rejection-modal');
    const approvalConfirmModal = document.getElementById('approval-confirmation-modal');
    const rejectionConfirmModal = document.getElementById('rejection-confirmation-modal');
    
    // Accept/Reject buttons in customer modal
    const acceptBtn = customerModal.querySelector('.accept-btn');
    const rejectBtn = customerModal.querySelector('.reject-btn');
    
    // Accept button logic
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            const source = customerModal.getAttribute('data-source');
            
            customerModal.style.display = 'none';
            
            if (source === 'cancelled') {
                // Update title for restoration
                document.querySelector('#approval-modal h3').textContent = 'Appointment Restoration Remarks';
            } else {
                // Reset to default title
                document.querySelector('#approval-modal h3').textContent = 'Appointment Approval Remarks';
            }
            
            approvalModal.style.display = 'block';
        });
    }
    
    // Reject button logic
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            const source = customerModal.getAttribute('data-source');
            
            customerModal.style.display = 'none';
            
            if (source === 'approved') {
                // Update title for cancellation
                document.querySelector('#rejection-modal h3').textContent = 'Appointment Cancellation Remarks';
            } else {
                // Reset to default title
                document.querySelector('#rejection-modal h3').textContent = 'Appointment Rejection Remarks';
            }
            
            rejectionModal.style.display = 'block';
        });
    }
    
    // Confirm approval button
    const confirmApprovalBtn = document.getElementById('confirm-approval');
    const approvalRemarks = document.getElementById('approval-remarks');
    if (confirmApprovalBtn) {
        confirmApprovalBtn.addEventListener('click', async function() {
            approvalModal.style.display = 'none';
            
            // Update message based on source
            const source = customerModal.getAttribute('data-source');
            const confirmMsg = document.querySelector('#approval-confirmation-modal .confirmation-message p');
            
            const formData = new FormData();
            formData.append('appointmentId', appointmentData.appointmentId);
            formData.append('adminId', localStorage.getItem('id'));
            formData.append('remarks', approvalRemarks.value);

            approvalRemarks.value = '';

            try {
                const response = await fetch('/api/approveAppointment', {
                    method: 'POST',
                    body: formData
                });
    
                const result = await response.json();
    
                if (result.success) {
                    // Hide approval modal only if successful
                    approvalModal.style.display = 'none';
                    confirmMsg.textContent = source === 'cancelled'
                        ? 'Appointment restored successfully!'
                        : 'Appointment approved successfully!';
                    location.reload();
                } else {
                    confirmMsg.textContent = `Failed to approve appointment: ${result.message}`;
                }
            } catch (error) {
                console.error("Error approving appointment:", error);
                confirmMsg.textContent = "Error connecting to server.";
            }

            approvalConfirmModal.style.display = 'block';
        });
    }
    
    // Confirm rejection button
    const confirmRejectionBtn = document.getElementById('confirm-rejection');
    const rejectionRemarks = document.getElementById('rejection-remarks');
    if (confirmRejectionBtn) {
        confirmRejectionBtn.addEventListener('click', async function() {
            rejectionModal.style.display = 'none';
            
            // Update message based on source
            const source = customerModal.getAttribute('data-source');
            const confirmMsg = document.querySelector('#rejection-confirmation-modal .confirmation-message p');

            const formData = new FormData();
            formData.append('appointmentId', appointmentData.appointmentId);
            formData.append('adminId', localStorage.getItem('id'));
            formData.append('remarks', rejectionRemarks.value);

            rejectionRemarks.value = '';

            try {
                const response = await fetch('/api/cancelAppointment', {
                    method: 'POST',
                    body: formData
                });
    
                const result = await response.json();
    
                if (result.success) {
                    // Hide approval modal only if successful
                    approvalModal.style.display = 'none';
                    confirmMsg.textContent = source === 'approved'
                        ? 'Appointment rejected successfully!'
                        : 'Appointment cancelled successfully!';
                    location.reload();
                } else {
                    confirmMsg.textContent = `Failed to cancel appointment: ${result.message}`;
                }
            } catch (error) {
                console.error("Error cancelling appointment:", error);
                confirmMsg.textContent = "Error connecting to server.";
            }
            
            rejectionConfirmModal.style.display = 'block';
        });
    }
    
    // Cancel buttons in the remarks modals
    const approvalCancelBtn = document.querySelector('.approval-cancel');
    if (approvalCancelBtn) {
        approvalCancelBtn.addEventListener('click', function() {
            approvalModal.style.display = 'none';
            customerModal.style.display = 'block';
        });
    }
    
    const rejectionCancelBtn = document.querySelector('.rejection-cancel');
    if (rejectionCancelBtn) {
        rejectionCancelBtn.addEventListener('click', function() {
            rejectionModal.style.display = 'none';
            customerModal.style.display = 'block';
        });
    }
    
    // OK buttons in confirmation modals
    const confirmationOkButtons = document.querySelectorAll('.confirmation-okay');
    confirmationOkButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
            // Here you would typically update the UI or refresh data
        });
    });
}

function closeAllModals() {
    // Get all modals
    const modals = [
        document.getElementById('customer-modal'),
        document.getElementById('approval-modal'),
        document.getElementById('rejection-modal'),
        document.getElementById('approval-confirmation-modal'),
        document.getElementById('rejection-confirmation-modal')
    ];
    
    // Hide all modals
    modals.forEach(modal => {
        if (modal) modal.style.display = 'none';
    });
    
    // Reset modal titles
    const approvalHeader = document.querySelector('#approval-modal h3');
    if (approvalHeader) {
        approvalHeader.textContent = 'Appointment Approval Remarks';
    }
    
    const rejectionHeader = document.querySelector('#rejection-modal h3');
    if (rejectionHeader) {
        rejectionHeader.textContent = 'Appointment Rejection Remarks';
    }
}

function updateModalButtons(status) {
    const customerModal = document.getElementById('customer-modal');
    const acceptBtn = customerModal.querySelector('.accept-btn');
    const rejectBtn = customerModal.querySelector('.reject-btn');
    
    if (status === 'pending') {
        // For pending appointments, show both buttons
        acceptBtn.textContent = 'Accept';
        rejectBtn.textContent = 'Reject';
        acceptBtn.style.display = 'block';
        rejectBtn.style.display = 'block';
    } else if (status === 'approved') {
        // For approved appointments, show only cancel button
        acceptBtn.style.display = 'none';
        rejectBtn.textContent = 'Cancel Appointment';
        rejectBtn.style.display = 'block';
    } else if (status === 'cancelled') {
        // For cancelled appointments, show only restore button
        acceptBtn.textContent = 'Restore Appointment';
        acceptBtn.style.display = 'block';
        rejectBtn.style.display = 'none';
    }
}


