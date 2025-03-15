function sendMail(email, customerName, message) {
    let params = {
        customerName: customerName,
        message: message,
        email: email
    }

    emailjs.send("service_dxxhkvt","template_e3d3rhh",params);
}