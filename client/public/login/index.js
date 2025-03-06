document.getElementById('loginButton').addEventListener('click', async (error) => {
    error.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password})
        })
        const data = await response.json();
        
        if (response.ok){
            localStorage.setItem("id", data.admin.employee_id);
            window.location.href = data.redirectUrl;

            // alert("Login")
        } else {
            console.log(response.message)
            alert("No login for you")
        }
    } catch (error) {
        console.log("Error: " + error);
    }
});