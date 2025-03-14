// dashboard.js - Customer modal functionality for dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Set up click handlers for all customer rows in the dashboard
    setupDashboardRowClicks();
});

/**
 * Set up click handlers for all customer rows in the dashboard table
 */
function setupDashboardRowClicks() {
    // Get all rows from the dashboard table
    const rows = document.querySelectorAll('.table-container tbody tr');
    
    rows.forEach(row => {
        // Add click handler to each row
        row.addEventListener('click', function() {
            // Extract data from the row
            const customerData = extractCustomerData(row);
            const appointmentData = extractAppointmentData(row);
            
            // Open the modal with the extracted data
            openDashboardCustomerModal(customerData, appointmentData);
        });
        
        // Add visual indication that rows are clickable
        row.style.cursor = 'pointer';
    });
}

/**
 * Extract customer data from a table row
 * @param {HTMLElement} row - The table row element
 * @returns {Object} - Customer data object
 */
function extractCustomerData(row) {
    const cells = row.cells;
    if (!cells || cells.length === 0) {
        console.error("No cells found in row");
        return {};
    }
    
    // Get customer name from first column
    const customerName = cells[0].textContent.trim();
    
    // Split name into parts (assuming "LastName, FirstName" format)
    const nameParts = customerName.split(',');
    const lastName = nameParts[0].trim();
    let firstName = "";
    
    if (nameParts.length > 1) {
        const firstNameFull = nameParts[1].trim();
        const firstNameParts = firstNameFull.split(' ');
        firstName = firstNameParts[0];
    }
    
    // In a real application, you would fetch these from a database
    // For now, we'll use placeholder data
    return {
        firstName: firstName,
        lastName: lastName,
        contactNumber: "09467135588",
        email: "customer@example.com"
    };
}

/**
 * Extract appointment data from a table row
 * @param {HTMLElement} row - The table row element
 * @returns {Object} - Appointment data object
 */
function extractAppointmentData(row) {
    const cells = row.cells;
    if (!cells || cells.length < 4) {
        console.error("Not enough cells found in row");
        return {};
    }
    
    // Get appointment details
    let date = "";
    let time = "";
    
    const scheduleText = cells[1].textContent.trim();
    const scheduleParts = scheduleText.split(' ');
    
    if (scheduleParts.length >= 3) {
        date = scheduleParts.slice(0, 3).join(' '); // e.g. "Jun 17, 2004"
        
        // Extract time if it exists (might be in a span)
        const timeSpan = cells[1].querySelector('.time');
        if (timeSpan) {
            time = timeSpan.textContent.trim();
        } else if (scheduleParts.length > 3) {
            time = scheduleParts.slice(3).join(' ');
        }
    }
    
    // Get purpose and date appointed
    const purpose = cells[2].textContent.trim();
    const dateAppointed = cells[3].textContent.trim();
    
    return {
        date: date,
        time: time,
        purpose: purpose,
        dateAppointed: dateAppointed
    };
}

/**
 * Open the customer modal with the provided data
 * @param {Object} customerData - Customer information
 * @param {Object} appointmentData - Appointment information
 */
function openDashboardCustomerModal(customerData, appointmentData) {
    const modal = document.getElementById('customer-modal');
    if (!modal) {
        console.error("Customer modal not found");
        return;
    }
    
    // Update modal content
    document.getElementById('modal-first-name').textContent = customerData.firstName || '';
    document.getElementById('modal-last-name').textContent = customerData.lastName || '';
    
    // Update contact and email if they have IDs
    const contactElement = modal.querySelector('.detail-value:nth-of-type(3)');
    if (contactElement) {
        contactElement.textContent = customerData.contactNumber || '';
    }
    
    const emailElement = modal.querySelector('.detail-value:nth-of-type(4)');
    if (emailElement) {
        emailElement.textContent = customerData.email || '';
    }
    
    // Update appointment details
    document.getElementById('modal-date').textContent = appointmentData.date || '';
    document.getElementById('modal-time').textContent = appointmentData.time || '';
    document.getElementById('modal-purpose').textContent = appointmentData.purpose || '';
    document.getElementById('modal-date-appointed').textContent = appointmentData.dateAppointed || '';
    
    // Show the modal
    modal.style.display = 'block';
    
    // Set up close button and backdrop click
    setupModalClose(modal);
    
    // Set up go back button
    setupGoBackButton(modal);
}

/**
 * Set up the close button and backdrop click for the modal
 * @param {HTMLElement} modal - The modal element
 */
function setupModalClose(modal) {
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close when clicking outside the modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
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