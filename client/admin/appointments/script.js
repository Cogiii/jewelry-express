document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const customerModal = document.getElementById('customer-modal');
    const approvalModal = document.getElementById('approval-modal');
    const rejectionModal = document.getElementById('rejection-modal');
    const approvalConfirmModal = document.getElementById('approval-confirmation-modal');
    const rejectionConfirmModal = document.getElementById('rejection-confirmation-modal');
    
    // Add click handlers directly to all relevant rows
    setupTableRowClicks();
    
    // Setup See More buttons for expandable sections
    setupSeeMoreButtons();
    
    // Setup all modal actions and close buttons
    setupModals();
});

// =============================================
// ROW CLICK FUNCTIONALITY
// =============================================

function setupTableRowClicks() {
    // Get all non-hidden rows from all tables
    const allTables = document.querySelectorAll('table');
    
    allTables.forEach(table => {
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
        
        rows.forEach(row => {
            // Add a direct click handler to each row
            row.addEventListener('click', function(event) {
                // Prevent click if we clicked on a button inside the row
                if (event.target.tagName === 'BUTTON' || 
                    event.target.closest('button')) {
                    return;
                }
                
                // Otherwise show the modal
                openCustomerModal(row, status);
            });
            
            // Add a visual indication that rows are clickable
            row.style.cursor = 'pointer';
        });
    });
}

function openCustomerModal(row, status) {
    console.log("Opening modal for row:", row, "with status:", status);
    
    // Extract data from the row
    const cells = row.cells;
    if (!cells || cells.length === 0) {
        console.error("No cells found in row");
        return;
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
    
    // Get appointment details
    let date = "";
    let time = "";
    if (cells.length > 1) {
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
    }
    
    // Get purpose and date appointed
    const purpose = cells.length > 2 ? cells[2].textContent.trim() : "";
    const dateAppointed = cells.length > 3 ? cells[3].textContent.trim() : "";
    
    // Update modal content
    document.getElementById('modal-first-name').textContent = firstName;
    document.getElementById('modal-last-name').textContent = lastName;
    document.getElementById('modal-date').textContent = date;
    document.getElementById('modal-time').textContent = time;
    document.getElementById('modal-purpose').textContent = purpose;
    document.getElementById('modal-date-appointed').textContent = dateAppointed;
    
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
    if (confirmApprovalBtn) {
        confirmApprovalBtn.addEventListener('click', function() {
            approvalModal.style.display = 'none';
            
            // Update message based on source
            const source = customerModal.getAttribute('data-source');
            const confirmMsg = document.querySelector('#approval-confirmation-modal .confirmation-message p');
            
            if (source === 'cancelled') {
                confirmMsg.textContent = 'Appointment restored successfully!';
            } else {
                confirmMsg.textContent = 'Appointment approved successfully!';
            }
            
            approvalConfirmModal.style.display = 'block';
        });
    }
    
    // Confirm rejection button
    const confirmRejectionBtn = document.getElementById('confirm-rejection');
    if (confirmRejectionBtn) {
        confirmRejectionBtn.addEventListener('click', function() {
            rejectionModal.style.display = 'none';
            
            // Update message based on source
            const source = customerModal.getAttribute('data-source');
            const confirmMsg = document.querySelector('#rejection-confirmation-modal .confirmation-message p');
            
            if (source === 'approved') {
                confirmMsg.textContent = 'Appointment cancelled successfully!';
            } else {
                confirmMsg.textContent = 'Appointment rejected successfully!';
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