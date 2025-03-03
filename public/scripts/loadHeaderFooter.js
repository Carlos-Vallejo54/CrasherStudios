document.addEventListener("DOMContentLoaded", function () {
    // Load Header
    fetch("../HeaderandFooter/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "../HeaderandFooter/header.css";
            document.head.appendChild(link);

            // Ensure the Nav Toggle Button Works
            setTimeout(() => {  // Delay to ensure elements load
                const menuButton = document.querySelector(".menu-toggle");
                const nav = document.querySelector("nav");

                if (menuButton && nav) {
                    menuButton.addEventListener("click", () => {
                        nav.classList.toggle("active");
                    });
                } else {
                    console.error("Menu button or nav-menu not found");
                }
            }, 500);
        })
        .catch(error => console.error("Error loading header:", error));

    // Load Footer
    fetch("../HeaderandFooter/footer.html")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load footer");
            return response.text();
        })
        .then(data => {
            document.getElementById("footer").innerHTML = data;
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "../HeaderandFooter/footer.css"; // Fix path
            document.head.appendChild(link);
        })
        .catch(error => console.error("Error loading footer:", error));

});
