document.addEventListener("DOMContentLoaded", () => {
    // Load Header
    fetch("../HeaderandFooter/header.html")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load header");
            return response.text();
        })
        .then(data => {
            document.getElementById("header").innerHTML = data;
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "../HeaderandFooter/header.css"; // Fix path
            document.head.appendChild(link);
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
