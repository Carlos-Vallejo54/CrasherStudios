document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contact-form");

    if (!contactForm) return; 

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        };

        try {
            let response = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Email sent successfully!");
                contactForm.reset();
            } else {
                alert("Error sending email.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("An error occurred while sending the email.");
        }
    });
});