document.addEventListener('DOMContentLoaded', function() {
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
    window.toggleRows = function(sectionId) {
        const section = document.getElementById(sectionId);
        const hiddenRows = section.querySelectorAll('.hidden-row');
        const button = section.querySelector('.see-more-btn');
        
        // Toggle section expanded state
        const isExpanded = section.classList.contains('expanded');
        
        if (!isExpanded) {
            // Expand section
            section.classList.add('expanded');
            
            // Show hidden rows with animation
            hiddenRows.forEach(row => {
                row.style.display = 'table-row';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.style.transition = 'opacity 0.3s ease';
                    row.style.opacity = '1';
                }, 10);
            });
            
            // Change button text
            button.textContent = 'See less';
        } else {
            // Collapse section
            section.classList.remove('expanded');
            
            // Hide hidden rows with animation
            hiddenRows.forEach(row => {
                row.style.transition = 'opacity 0.3s ease';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.style.display = 'none';
                }, 300);
            });
            
            // Change button text
            button.textContent = 'See more';
        }
    };

    // Product Details Modal functionality
    const productDetailsModal = document.getElementById('product-details-modal');
    const productRows = document.querySelectorAll('.product-row');
    const productDetailsClose = productDetailsModal.querySelector('.modal-close');
    const goBackBtn = productDetailsModal.querySelector('.go-back-btn');
    
    // Sample product data
    const productData = {
        1: {
            code: '#904321',
            name: 'Sardonyx Shell Cameo Necklace',
            material: 'Sardonyx, Gold',
            description: 'An exquisite handcrafted cameo pendant featuring a detailed carving on genuine sardonyx shell, set in 14K gold with an adjustable chain.',
            images: ['placeholder.jpg', 'placeholder.jpg', 'placeholder.jpg']
        },
        2: {
            code: '#904322',
            name: 'Pearl Pendant Necklace',
            material: 'Freshwater Pearl, Sterling Silver',
            description: 'Elegant freshwater pearl pendant suspended on a delicate sterling silver chain, perfect for both casual and formal occasions.',
            images: ['placeholder.jpg', 'placeholder.jpg']
        },
        // More sample data for other products
        4: {
            code: '#905121',
            name: 'Diamond Stud Earrings',
            material: 'Diamond, 18K Gold',
            description: 'Classic diamond studs featuring brilliant-cut diamonds totaling 1 carat, set in 18K gold with secure butterfly backs.',
            images: ['placeholder.jpg', 'placeholder.jpg', 'placeholder.jpg']
        },
        7: {
            code: '#906121',
            name: 'Diamond Solitaire Ring',
            material: 'Diamond, Platinum',
            description: 'Timeless solitaire ring featuring a 1 carat round brilliant diamond set in platinum for maximum brilliance and durability.',
            images: ['placeholder.jpg', 'placeholder.jpg', 'placeholder.jpg']
        },
        10: {
            code: '#907121',
            name: 'Tennis Bracelet',
            material: 'Diamond, 18K White Gold',
            description: 'Stunning tennis bracelet featuring 3 carats of round brilliant diamonds set in 18K white gold with a secure double safety clasp.',
            images: ['placeholder.jpg', 'placeholder.jpg', 'placeholder.jpg']
        }
    };
    
    // Function to open product details modal
    function openProductDetailsModal(productId) {
        // Get product data
        const product = productData[productId] || {};
        const productRow = document.querySelector(`.product-row[data-product-id="${productId}"]`);
        
        if (!product.code && productRow) {
            // Extract data from the row if not found in sample data
            const cells = productRow.cells;
            product.name = cells[0].textContent;
            product.material = cells[1].textContent;
            product.description = cells[2].textContent;
            product.code = "#" + Math.floor(Math.random() * 1000000); // Generate a random code if not available
            product.images = ['placeholder.jpg', 'placeholder.jpg', 'placeholder.jpg'];
        }
        
        // Populate modal with product details
        document.getElementById('modal-product-code').textContent = product.code;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-material').textContent = product.material;
        document.getElementById('modal-product-description').textContent = product.description;
        
        // Set the main product image
        document.getElementById('modal-product-image').src = product.images[0];
        
        // Generate thumbnails and dots
        const thumbnailContainer = document.getElementById('thumbnail-container');
        const imageNavDots = document.getElementById('image-nav-dots');
        thumbnailContainer.innerHTML = '';
        imageNavDots.innerHTML = '';
        
        // Add thumbnails and dots for each image
        product.images.forEach((image, index) => {
            // Create thumbnail
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `Thumbnail ${index + 1}`;
            thumbnail.className = 'product-thumbnail-item' + (index === 0 ? ' active' : '');
            thumbnail.setAttribute('data-image-index', index);
            thumbnailContainer.appendChild(thumbnail);
            
            // Add click event to thumbnail
            thumbnail.addEventListener('click', function() {
                const imageIndex = this.getAttribute('data-image-index');
                document.getElementById('modal-product-image').src = product.images[imageIndex];
                
                // Update active states
                document.querySelectorAll('.product-thumbnail-item').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                this.classList.add('active');
                
                document.querySelectorAll('.image-nav-dot').forEach(dot => {
                    dot.classList.remove('active');
                });
                document.querySelector(`.image-nav-dot[data-image-index="${imageIndex}"]`).classList.add('active');
            });
            
            // Create navigation dot
            const dot = document.createElement('span');
            dot.className = 'image-nav-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('data-image-index', index);
            imageNavDots.appendChild(dot);
            
            // Add click event to dot
            dot.addEventListener('click', function() {
                const imageIndex = this.getAttribute('data-image-index');
                document.getElementById('modal-product-image').src = product.images[imageIndex];
                
                // Update active states
                document.querySelectorAll('.image-nav-dot').forEach(dot => {
                    dot.classList.remove('active');
                });
                this.classList.add('active');
                
                document.querySelectorAll('.product-thumbnail-item').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                document.querySelector(`.product-thumbnail-item[data-image-index="${imageIndex}"]`).classList.add('active');
            });
        });
        
        // Show the modal
        productDetailsModal.style.display = 'block';
    }
    
    // Open product details modal when clicking on a product row
    productRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Make sure we're not clicking on a button within the row
            if (!e.target.closest('button')) {
                const productId = this.getAttribute('data-product-id');
                openProductDetailsModal(productId);
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

    // ===== ADD PRODUCT MODAL =====
    const addProductModal = document.getElementById('add-product-modal');
    const addProductBtn = document.getElementById('global-add-product-btn');
    const addProductClose = addProductModal.querySelector('.modal-close');
    const cancelAddProductBtn = document.getElementById('cancel-add-product');
    const addProductForm = document.getElementById('add-product-form');
    
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
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
    
    // Submit add product form
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const productCode = document.getElementById('product-code').value;
        const productName = document.getElementById('product-name').value;
        const productMaterial = document.getElementById('product-material').value;
        const productDescription = document.getElementById('product-description').value;
        const productType = document.getElementById('product-type').value; // Changed from product-type-title
        
        // Create a new product row
        const sectionId = productType.toLowerCase() + '-section';
        const section = document.getElementById(sectionId);
        
        if (!section) {
            console.error('Section not found:', sectionId);
            return;
        }
        
        const tbody = section.querySelector('tbody');
        
        // Generate a unique product ID
        const productId = Date.now();
        
        // Create the new row
        const newRow = document.createElement('tr');
        newRow.className = 'product-row';
        newRow.setAttribute('data-product-id', productId);
        newRow.setAttribute('data-product-type', productType);
        
        // Set row content
        newRow.innerHTML = `
            <td>${productName}</td>
            <td>${productMaterial}</td>
            <td>${productDescription}</td>
            <td class="product-image-cell">
                <img src="${uploadedFiles.length > 0 ? 'placeholder.jpg' : 'placeholder.jpg'}" alt="Product" class="product-thumbnail">
            </td>
        `;
        
        // Add the row to the table
        tbody.appendChild(newRow);
        
        // Add click event to the new row
        newRow.addEventListener('click', function() {
            const rowProductId = this.getAttribute('data-product-id');
            
            // Create product data for the new product
            productData[rowProductId] = {
                code: productCode,
                name: productName,
                material: productMaterial,
                description: productDescription,
                images: uploadedFiles.length > 0 ? Array(uploadedFiles.length).fill('placeholder.jpg') : ['placeholder.jpg']
            };
            
            openProductDetailsModal(rowProductId);
        });
        
        // Close the add product modal
        addProductModal.style.display = 'none';
        
        // Show confirmation modal
        confirmationModal.style.display = 'block';
    });
});

const logout = document.getElementById('logout');

logout.addEventListener('click', () => {
    window.location.href = '/auth/logout';
    console.log("YESY")
});
