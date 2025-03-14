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
