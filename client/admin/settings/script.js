// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const changePasswordModal = document.getElementById('change-password-modal');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const modalClose = document.querySelector('.modal-close');
    const cancelBtn = document.querySelector('.cancelBtn');
    const saveBtn = document.querySelector('.saveBtn');
    
    // Get password input fields
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    // Open modal when Change Password button is clicked
    changePasswordBtn.addEventListener('click', function() {
        // Reset form fields
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
        
        // Show modal
        changePasswordModal.style.display = 'block';
    });
    
    // Close modal when clicking the X
    modalClose.addEventListener('click', function() {
        changePasswordModal.style.display = 'none';
    });
    
    // Close modal when clicking Cancel button
    cancelBtn.addEventListener('click', function() {
        changePasswordModal.style.display = 'none';
    });
    
    // Close modal when clicking outside it
    window.addEventListener('click', function(event) {
        if (event.target === changePasswordModal) {
            changePasswordModal.style.display = 'none';
        }
    });
    
    // Handle Save Changes button click
    saveBtn.addEventListener('click', function() {
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Basic validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('New password and confirmation do not match');
            return;
        }
        
        // In a real application, you would send this data to the server
        // For now, just show success message and close modal
        alert('Password changed successfully!');
        changePasswordModal.style.display = 'none';
    });
    
    // Make sidebar menu items clickable
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.textContent.trim().toLowerCase();
            if (page !== 'settings') {
                window.location.href = page + '.html';
            }
        });
    });
});