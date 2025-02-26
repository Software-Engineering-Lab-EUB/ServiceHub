function fetchServices() {
    fetch("http://localhost:5000/services/all")
        .then(response => response.json())
        .then(data => {
            let output = "<h2>Available Services</h2>";
            data.forEach(service => {
                output += `<p>${service.service_name} - ${service.category} ($${service.price})</p>`;
            });
            document.getElementById("serviceList").innerHTML = output;
        })
        .catch(error => console.error("Error fetching services:", error));
}
