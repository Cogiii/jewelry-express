// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const userName = document.querySelector('.user-profile .userName');
    userName.textContent = localStorage.getItem('username');

    logout.addEventListener('click', () => {
        window.location.href = '/auth/logout';
        console.log("YESY")
    });

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
    saveBtn.addEventListener('click', function () {
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            alert('New password and confirmation do not match');
            return;
        }

        fetch('/auth/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Password changed successfully.') {
                alert('Password changed successfully!');
                changePasswordModal.style.display = 'none';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while changing the password.');
        });
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