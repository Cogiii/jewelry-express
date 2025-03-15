document.addEventListener('DOMContentLoaded', function() {
    const userName = document.querySelector('.user-profile .userName');
    userName.textContent = localStorage.getItem('username');

    const logout = document.getElementById('logout');

    logout.addEventListener('click', () => {
        window.location.href = '/auth/logout';
    });
    
    productTypesDropDown();
    productMaterialsDropDown();
    fetchProductsByType("Necklace", "#necklace-section");
    fetchProductsByType("Earring", "#earring-section");
    fetchProductsByType("Ring", "#ring-section");
    fetchProductsByType("Bracelet", "#bracelet-section");

    // Set up See More buttons functionality
    const seeMoreButtons = document.querySelectorAll('.see-more-btn');
    
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent event bubbling
            e.stopPropagation();
            
            // Find the parent product section
            const section = this.closest('.product-section');
            if (section) {
                toggleRows(section.id);
            }
        });
    });
    
    // Toggle hidden rows in product sections
    window.toggleRows = function (sectionId) {
        const section = document.getElementById(sectionId);
        const hiddenRows = section.querySelectorAll('.hidden-row');
        const button = section.querySelector('.see-more-btn');

        if (!hiddenRows.length) return; 

        const isExpanded = section.classList.toggle('expanded');

        if (isExpanded) {
            // Expand section
            hiddenRows.forEach(row => {
                row.style.display = 'table-row';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.style.transition = 'opacity 0.3s ease';
                    row.style.opacity = '1';
                }, 10);
            });

            button.textContent = 'See less';
        } else {
            hiddenRows.forEach(row => {
                row.style.transition = 'opacity 0.3s ease';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.style.display = 'none';
                }, 300);
            });

            button.textContent = 'See more';
        }
    };

    // Product Details Modal functionality
    const productDetailsModal = document.getElementById('product-details-modal');
    const productRows = document.querySelectorAll('.Necklace');
    const productDetailsClose = productDetailsModal.querySelector('.modal-close');
    const goBackBtn = productDetailsModal.querySelector('.go-back-btn');
    
    // Open product details modal when clicking on a product row
    productRows.forEach(row => {
        row.addEventListener('click', function(e) {

            if (!e.target.closest('button')) {
                const productId = this.getAttribute('data-product-id');
            }
        });
    });
    
    // Close product details modal
    productDetailsClose.addEventListener('click', function() {
        productDetailsModal.style.display = 'none';
    });
    
    goBackBtn.addEventListener('click', function() {
        productDetailsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === productDetailsModal) {
            productDetailsModal.style.display = 'none';
        }
    });
    

    addNewProduct();

});

function addNewProduct() {
    const addProductForm = document.getElementById('add-product-form');
    const addProductBtn = document.getElementById('global-add-product-btn');
    const addProductModal = document.getElementById('add-product-modal');
    const addProductClose = addProductModal.querySelector('.modal-close');
    const cancelAddProductBtn = document.getElementById('cancel-add-product');

    // Open add product modal when clicking add product button
    addProductBtn.addEventListener('click', function(e) {
        // Prevent event bubbling
        e.stopPropagation();
        
        // Reset the form
        addProductForm.reset();
        imagePreviewContainer.innerHTML = '';
        uploadedFiles.length = 0;
        
        // Show the modal
        addProductModal.style.display = 'block';
    });
    
    // Close add product modal
    addProductClose.addEventListener('click', function() {
        addProductModal.style.display = 'none';
    });
    
    cancelAddProductBtn.addEventListener('click', function() {
        addProductModal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === addProductModal) {
            addProductModal.style.display = 'none';
        }
    });

        // File upload and preview functionality
        const fileUpload = document.getElementById('file-upload');
        const imagePreviewContainer = document.getElementById('image-preview-container');
        const uploadedFiles = [];
        
        fileUpload.addEventListener('change', function(event) {
            const files = event.target.files;
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.match('image.*')) {
                    uploadedFiles.push(file);
                    
                    // Create image preview
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const previewContainer = document.createElement('div');
                        previewContainer.className = 'image-preview';
                        previewContainer.style.position = 'relative';
                        
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '4px';
                        
                        const removeBtn = document.createElement('span');
                        removeBtn.className = 'remove-image';
                        removeBtn.innerHTML = '&times;';
                        removeBtn.dataset.index = uploadedFiles.length - 1;
                        
                        // Remove image when clicking the remove button
                        removeBtn.addEventListener('click', function() {
                            const index = parseInt(this.dataset.index);
                            uploadedFiles.splice(index, 1);
                            previewContainer.remove();
                            
                            // Update indices for remaining remove buttons
                            const removeBtns = imagePreviewContainer.querySelectorAll('.remove-image');
                            for (let j = 0; j < removeBtns.length; j++) {
                                removeBtns[j].dataset.index = j;
                            }
                        });
                        
                        previewContainer.appendChild(img);
                        previewContainer.appendChild(removeBtn);
                        imagePreviewContainer.appendChild(previewContainer);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    
    // ===== CONFIRMATION MODAL =====
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationClose = confirmationModal.querySelector('.modal-close');
    const confirmationOkayBtn = confirmationModal.querySelector('.confirmation-okay');
    
    // Close confirmation modal
    confirmationClose.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });
    
    confirmationOkayBtn.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
        location.reload();
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });

    // Submit add product form
    addProductForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (uploadedFiles.length === 0) {
            alert('Please upload at least one image.');
            return;
        }

        const formData = new FormData();
        formData.append('productName', document.getElementById('product-name').value);
        formData.append('productType', document.getElementById('product-type').value);
        formData.append('productMaterial', document.getElementById('product-material').value);
        formData.append('productDescription', document.getElementById('product-description').value);
        formData.append('productCode', document.getElementById('product-code').value);
        formData.append('adminId', localStorage.getItem('id'));

        // Append all selected images
        uploadedFiles.forEach((image) => {
            formData.append('productImages', image);
        });

        try {
            const response = await fetch('/api/addProduct', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {

                // Close the add product modal
                addProductModal.style.display = 'none';
                
                // Show confirmation modal
                confirmationModal.style.display = 'block';
            } else {
                alert('Product add failed!');
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
                
    });
}

function fetchProductsByType(type, containerSelector) {
    fetch(`/api/getProductByType/${type}`, { method: 'GET' })
        .then(response => response.json())
        .then(products => {
            return Promise.all(
                products.map(async (product) => {
                    try {
                        const imageResponse = await fetch(`/api/getProductImage/${product.product_id}`);
                        if (!imageResponse.ok) throw new Error("Image not found");
                        const imageBlob = await imageResponse.blob();
                        const imageUrl = URL.createObjectURL(imageBlob);

                        return { ...product, img: imageUrl };
                    } catch (error) {
                        console.error(`Error fetching image for product ${product.product_id}:`, error);
                    }
                })
            );
        })
        .then(data => {
            updateProductTable(data, containerSelector);
        })
        .catch(error => console.error("Error loading products:", error));
}




function updateProductTable(products, containerSelector) {
    const tbody = document.querySelector(`${containerSelector} .table-container tbody`);
    tbody.innerHTML = "";

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">No products found.</td></tr>`;
        return;
    }

    let index = 0;
    products.forEach(product => {
        index += 1;
        const row = document.createElement("tr");
        row.classList.add("product-row");
        if (index > 2) row.classList.add("hidden-row");

        row.innerHTML = `
            <td>${product.product_name}</td>
            <td>${product.product_material}</td>
            <td>${product.product_description}</td>
            <td class="product-image-cell">
                <img src="${product.img || 'placeholder.jpg'}" alt="Product" class="product-thumbnail">
            </td>
        `;

        // Add click event listener to open the modal with product details
        row.addEventListener('click', () => openProductModal(product));

        tbody.appendChild(row);
    });
}
function openProductModal(product) {
    const modal = document.getElementById("product-details-modal");
    console.log(product)
    // Populate modal fields directly from the product object
    document.getElementById("modal-product-name").textContent = product.product_name;
    document.getElementById("modal-product-material").textContent = product.product_material;
    document.getElementById("modal-product-type").textContent = product.product_type;
    document.getElementById("modal-product-description").textContent = product.product_description;
    getImages(product.product_id);

    // Show modal
    modal.style.display = "block";
}

// Close modal when clicking the close button
document.querySelector(".modal-close").addEventListener("click", () => {
    document.getElementById("product-details-modal").style.display = "none";
});

// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
    const modal = document.getElementById("product-details-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


async function productTypesDropDown() {
    const typeDropdown = document.getElementById("product-type");
    
    try {
        const response = await fetch("/api/getProductTypes");
        const types = await response.json();

        if (response.ok) {
            types.forEach(type => {
                const option = document.createElement("option");
                option.value = type.product_type_id;
                option.textContent = type.product_type;
                typeDropdown.appendChild(option);
            });
        } else {
            console.error("Failed to fetch positions:", types.message);
        }
    } catch (error) {
        console.error("Error fetching positions:", error);
    }
}

async function productMaterialsDropDown() {
    const materialDropdown = document.getElementById("product-material");
    
    try {
        const response = await fetch("/api/getProductMaterials");
        const materials = await response.json();

        if (response.ok) {
            materials.forEach(material => {
                const option = document.createElement("option");
                option.value = material.product_material_id;
                option.textContent = material.product_material;
                materialDropdown.appendChild(option);
            });
        } else {
            console.error("Failed to fetch positions:", materials.message);
        }
    } catch (error) {
        console.error("Error fetching positions:", error);
    }
}

function getImages(productId) {
    fetch(`/api/getAllProductImages/${productId}`, { method: 'GET' })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(productImages => {
        if (!Array.isArray(productImages)) {
            throw new Error("Invalid API response: Expected an array of images.");
        }

        return Promise.all(
            productImages.map(async (image) => {
                const imageResponse = await fetch(`/api/getProductImageById/${image.product_image_id}`);
                if (!imageResponse.ok) {
                    throw new Error(`Error fetching image ID ${image.product_image_id}`);
                }
                const imageBlob = await imageResponse.blob();
                const imageUrl = URL.createObjectURL(imageBlob);

                return { img: imageUrl };
            })
        );
    })
    .then(data => {
        if (!data || data.length === 0) {
            console.warn("No images found for this product.");
            return;
        }

        createJewelrySlider(data, ".jewelry_images .jewelry_container");
    })
    .catch(error => console.error("Error fetching product images:", error));
}

function createJewelrySlider(data, containerSelector) {
    const container = document.querySelector(containerSelector);

    if (!container) return;

    container.innerHTML = "";

    // Populate jewelry items
    data.forEach((jewelry, index) => {
        const jewelryDiv = document.createElement("div");
        jewelryDiv.classList.add("jewelry");
        jewelryDiv.innerHTML = `
            <img src="${jewelry.img}" alt="Jewelry Image">
             ${jewelry.name ? `<h3 class="jewelry_details">${jewelry.name}</h3>` : ""}
            
        `;
        container.appendChild(jewelryDiv);
        // Create dots
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");

        if(jewelry.name) {
            jewelryDiv.addEventListener('click', () => {
                window.location = `/collection/${jewelry.id}`
            })
        }
    });
}

