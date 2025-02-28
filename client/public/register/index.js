function statusDropdown() {
    const statusDropDown = document.getElementById("status");
    const status = ['Admin', 'Staff', 'Resigned'];

    status.forEach(status => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        statusDropDown.appendChild(option);
    })
}

async function positionDropdown() {
    const positionDropdown = document.getElementById("position");
    
    try {
        const response = await fetch("http://localhost:3000/api/getPositions");
        const positions = await response.json();

        if (response.ok) {
            positions.forEach(position => {
                const option = document.createElement("option");
                option.value = position.position_id;
                option.textContent = position.position_name;
                positionDropdown.appendChild(option);
            });
        } else {
            console.error("Failed to fetch positions:", positions.message);
        }
    } catch (error) {
        console.error("Error fetching positions:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    positionDropdown();
    statusDropdown();
});

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastName = document.getElementById('lastName').value;
    const position = document.getElementById('position').value;
    const status = document.getElementById('status').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const responseMessage = document.getElementById('responseMessage');

    try {
        const response = await fetch('http://localhost:3000/auth/registerAdmin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstNameInput: firstName,
                middleNameInput: middleName,
                lastNameInput: lastName,
                positionInput: position,
                statusInput: status,
                usernameInput: username,
                passwordInput: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            responseMessage.style.color = 'green';
            responseMessage.textContent = data.message;
        } else {
            responseMessage.style.color = 'red';
            responseMessage.textContent = data.message || 'Registration failed';
        }
    } catch (error) {
        responseMessage.style.color = 'red';
        responseMessage.textContent = 'Error connecting to the server';
    }
});
