function sendMail(email, customerName, message) {
    let params = {
        email: email,
        customerName: customerName,
        message: message
    }

    emailjs.send("service_dxxhkvt","template_e3d3rhh",params).then(alert("Email Sent!"));
}