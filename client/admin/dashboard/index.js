async function productTypesDropDown() {
    const typeDropdown = document.getElementById("type");
    
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
    const materialDropdown = document.getElementById("material");
    
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

document.addEventListener("DOMContentLoaded", function () {
    productTypesDropDown();
    productMaterialsDropDown();
});

document.getElementById('image').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('productForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('productName', document.getElementById('name').value);
    formData.append('productType', document.getElementById('type').value);
    formData.append('productMaterial', document.getElementById('material').value);
    formData.append('productDescription', document.getElementById('description').value);
    formData.append('productCode', document.getElementById('code').value);
    formData.append('productImage', document.getElementById('image').files[0]);
    formData.append('adminId', );

    try {
        const response = await fetch('/api/addProduct', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            alert('Product added successfully!');
            this.reset();
            document.getElementById('imagePreview').style.display = 'none';
        } else {
            alert('Product add failed!');
            console.log(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
