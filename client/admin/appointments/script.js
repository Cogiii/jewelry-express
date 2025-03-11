document.addEventListener('DOMContentLoaded', function() {
    // Get all table rows that should be clickable
    const tableRows = document.querySelectorAll('tbody tr');
    
    const customerModal = document.getElementById('customer-modal');
    const approvalModal = document.getElementById('approval-modal');
    const rejectionModal = document.getElementById('rejection-modal');
    const approvalConfirmModal = document.getElementById('approval-confirmation-modal');
    const rejectionConfirmModal = document.getElementById('rejection-confirmation-modal');
    
    // Add click event to each row
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            // Get data from the clicked row
            const customerName = this.cells[0].textContent.trim();
            const scheduleParts = this.cells[1].textContent.trim().split(' ');
            const date = scheduleParts[0] + ' ' + scheduleParts[1] + ' ' + scheduleParts[2];
            const time = scheduleParts[3] + ' ' + scheduleParts[4];
            const purpose = this.cells[2].textContent.trim();
            const dateAppointed = this.cells[3].textContent.trim();
            
            // Extract first and last name
            const nameParts = customerName.split(',');
            const lastName = nameParts[0].trim();
            const firstNameFull = nameParts.length > 1 ? nameParts[1].trim() : '';
            // Assuming the middle name/nickname might be part of the first name section
            const firstNameParts = firstNameFull.split(' ');
            const firstName = firstNameParts[0];
            
            // Populate the modal with the data
            document.getElementById('modal-first-name').textContent = firstName;
            document.getElementById('modal-last-name').textContent = lastName;
            document.getElementById('modal-date').textContent = date;
            document.getElementById('modal-time').textContent = time;
            document.getElementById('modal-purpose').textContent = purpose;
            document.getElementById('modal-date-appointed').textContent = dateAppointed;
            
            // Show the modal
            document.getElementById('customer-modal').style.display = 'block';
        });
    });
    
    // Close modal when X button is clicked
    document.querySelector('.modal-close').addEventListener('click', function() {
        document.getElementById('customer-modal').style.display = 'none';
    });
    
    // Button handlers for opening approval/rejection modals
    document.getElementById('open-accept-modal').addEventListener('click', function() {
        customerModal.classList.remove('show');
        approvalModal.classList.add('show');
    });
    
    document.getElementById('open-reject-modal').addEventListener('click', function() {
        customerModal.classList.remove('show');
        rejectionModal.classList.add('show');
    });
    
    // Confirmation button handlers
    document.getElementById('confirm-approval').addEventListener('click', function() {
        approvalModal.classList.remove('show');
        approvalConfirmModal.classList.add('show');
    });
    
    document.getElementById('confirm-rejection').addEventListener('click', function() {
        rejectionModal.classList.remove('show');
        rejectionConfirmModal.classList.add('show');
    });
    
    // Cancel button handlers
    document.querySelectorAll('.approval-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            approvalModal.classList.remove('show');
            customerModal.classList.add('show');
        });
    });
    
    document.querySelectorAll('.rejection-cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            rejectionModal.classList.remove('show');
            customerModal.classList.add('show');
        });
    });
    
    // Confirmation okay button handlers
    document.querySelectorAll('.confirmation-okay').forEach(btn => {
        btn.addEventListener('click', function() {
            approvalConfirmModal.classList.remove('show');
            rejectionConfirmModal.classList.remove('show');
            // You can add code here to refresh the table data if needed
        });
    });
    
    // Close buttons for all modals
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            customerModal.classList.remove('show');
            approvalModal.classList.remove('show');
            rejectionModal.classList.remove('show');
            approvalConfirmModal.classList.remove('show');
            rejectionConfirmModal.classList.remove('show');
        });
    });
    
    // Close modals when clicking outside modal content
    window.addEventListener('click', function(event) {
        if (event.target === customerModal) {
            customerModal.classList.remove('show');
        } else if (event.target === approvalModal) {
            approvalModal.classList.remove('show');
        } else if (event.target === rejectionModal) {
            rejectionModal.classList.remove('show');
        } else if (event.target === approvalConfirmModal) {
            approvalConfirmModal.classList.remove('show');
        } else if (event.target === rejectionConfirmModal) {
            rejectionConfirmModal.classList.remove('show');
        }
    });
    
    // Prevent "See more" button from triggering the modal
    const seeMoreButtons = document.querySelectorAll('.see-more-btn');
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
});