// async function productTypesDropDown() {
//     const typeDropdown = document.getElementById("type");
    
//     try {
//         const response = await fetch("/api/getProductTypes");
//         const types = await response.json();

//         if (response.ok) {
//             types.forEach(type => {
//                 const option = document.createElement("option");
//                 option.value = type.product_type_id;
//                 option.textContent = type.product_type;
//                 typeDropdown.appendChild(option);
//             });
//         } else {
//             console.error("Failed to fetch positions:", types.message);
//         }
//     } catch (error) {
//         console.error("Error fetching positions:", error);
//     }
// }

// async function productMaterialsDropDown() {
//     const materialDropdown = document.getElementById("material");
    
//     try {
//         const response = await fetch("/api/getProductMaterials");
//         const materials = await response.json();

//         if (response.ok) {
//             materials.forEach(material => {
//                 const option = document.createElement("option");
//                 option.value = material.product_material_id;
//                 option.textContent = material.product_material;
//                 materialDropdown.appendChild(option);
//             });
//         } else {
//             console.error("Failed to fetch positions:", materials.message);
//         }
//     } catch (error) {
//         console.error("Error fetching positions:", error);
//     }
// }

// document.addEventListener("DOMContentLoaded", function () {
//     productTypesDropDown();
//     productMaterialsDropDown();
// });

// const selectedImages = []; // Store selected images

// document.getElementById('images').addEventListener('change', function (event) {
//     const files = event.target.files;
//     const imagePreviewContainer = document.getElementById('imagePreviewContainer');

//     Array.from(files).forEach((file) => {
//         // Check if the file is already added
//         if (selectedImages.some(img => img.name === file.name)) {
//             alert(`Image "${file.name}" is already selected.`);
//             return; // Skip duplicate image
//         }

//         if (file) {
//             const reader = new FileReader();
//             reader.onload = function (e) {
//                 const img = document.createElement('img');
//                 img.src = e.target.result;
//                 img.alt = file.name;
//                 img.style.width = '100px';
//                 img.style.height = '100px';
//                 img.style.margin = '5px';
//                 img.style.border = '1px solid #ccc';

//                 imagePreviewContainer.appendChild(img);
//             };
//             reader.readAsDataURL(file);
//             selectedImages.push(file); // Store image
//         }
//     });
// });

// document.getElementById('productForm').addEventListener('submit', async function (event) {
//     event.preventDefault();

//     if (selectedImages.length === 0) {
//         alert('Please upload at least one image.');
//         return;
//     }

//     const formData = new FormData();
//     formData.append('productName', document.getElementById('name').value);
//     formData.append('productType', document.getElementById('type').value);
//     formData.append('productMaterial', document.getElementById('material').value);
//     formData.append('productDescription', document.getElementById('description').value);
//     formData.append('productCode', document.getElementById('code').value);
//     formData.append('adminId', 1);

//     // Append all selected images
//     selectedImages.forEach((image) => {
//         formData.append('productImages', image);
//     });

//     try {
//         const response = await fetch('/api/addProduct', {
//             method: 'POST',
//             body: formData,
//         });

//         const data = await response.json();

//         if (response.ok) {
//             alert('Product added successfully!');
//             this.reset();
//             document.getElementById('imagePreviewContainer').innerHTML = ''; // Clear previews
//             selectedImages.length = 0; // Reset selected images
//         } else {
//             alert('Product add failed!');
//             console.log(data.message);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });

const logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    window.location.href = '/auth/logout';
    console.log("YESY")
});
// dashboard.js - Customer modal functionality for dashboard

document.addEventListener('DOMContentLoaded', function() {
    const userName = document.querySelector('.user-profile .userName');
    userName.textContent = localStorage.getItem('username');

    fetchAppointmentCounts();
    setupDashboardRowClicks();
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
                    updateTable(data.data);
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
            row.innerHTML = `
                <td>${app.last_name}, ${app.first_name}</td>
                <td>${new Date(app.sched_of_appointment).toLocaleDateString()} 
                    <span class="time">${new Date(app.sched_of_appointment).toLocaleTimeString()}</span>
                </td>
                <td>${app.appointment_purpose || "N/A"}</td>
                <td>${new Date(app.date_appointed).toLocaleDateString()}</td>
            `;
            tbody.appendChild(row);
        });
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
