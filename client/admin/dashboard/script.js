// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select all table rows in the tbody
    const tableRows = document.querySelectorAll('table tbody tr');
    
    // Add click event listener to each row
    tableRows.forEach(row => {
        row.style.cursor = 'pointer'; // Show pointer cursor on hover
        
        row.addEventListener('click', function() {
            // Get the data from this row
            const cells = this.querySelectorAll('td');
            
            // Parse customer name (LastName, FirstName format)
            const fullName = cells[0].textContent.trim();
            const nameParts = fullName.split(',');
            const lastName = nameParts[0].trim();
            const firstName = nameParts.length > 1 ? nameParts[1].trim() : '';
            
            // Get schedule details
            const scheduleCell = cells[1].textContent.trim();
            const date = scheduleCell.split(' ')[0] + ' ' + scheduleCell.split(' ')[1] + ' ' + scheduleCell.split(' ')[2];
            const timeSpan = cells[1].querySelector('.time');
            const time = timeSpan ? timeSpan.textContent.trim() : '';
            
            // Get purpose and date appointed
            const purpose = cells[2].textContent.trim();
            const dateAppointed = cells[3].textContent.trim();
            
            // Update modal content
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
    
    // Close modal when clicking the X
    const closeButton = document.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            document.getElementById('customer-modal').style.display = 'none';
        });
    }
    
    // Close modal when clicking outside it
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('customer-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Setup Accept/Reject buttons
    const acceptBtn = document.querySelector('.accept-btn');
    const rejectBtn = document.querySelector('.reject-btn');
    
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            alert('Appointment rejected!');
            document.getElementById('customer-modal').style.display = 'none';
        });
    }
});