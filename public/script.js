// Service categories data
const serviceCategories = {
    cleaning: [
        "Cleaning",
        "Party clean up",
        "Apartment cleaning",
        "Deep clean",
        "Garage Cleaning",
        "Move-out clean",
        "Gutter cleaning",
        "Pressure washing",
    ],
    handyman: [
        "Appliance installation",
        "Carpentry",
        "Door lock repair",
        "Painting & drywall",
        "Ceiling installation",
        "Light fixture replacement",
        "Deck & fence repair",
    ],
    moving: [
        "Moving Help",
        "Truck-assisted help moving",
        "Trash & furniture removal",
        "Heavy lifting & Loading",
        "Rearrange Furniture",
        "Junk haul away",
    ],
    painting: [
        "Indoor painting",
        "Wallpapering",
        "Outdoor painting",
        "Concrete & brick painting",
        "Accent wall painting",
        "Wallpaper removal",
    ],
    assembly: [
        "Desk assembly",
        "General furniture assembly",
        "IKEA assembly",
        "Crib assembly",
        "PAX assembly",
        "Bookshelf assembly",
    ],
    mounting: [
        "Hang art, mirror & decor",
        "Install blinds & window treatments",
        "Mount & anchor furniture",
        "Install Shelves, rods & hooks",
        "TV mounting",
    ],
    outdoor: [
        "Yard work",
        "Lawn care",
        "Snow removal",
        "Landscaping help",
        "Branch & Hedge Trimming",
        "Gardening & Weeding",
        "Fence repair",
        "Pool maintenance",
    ],
    "home repairs": [
        "Door repair",
        "Wall repair",
        "Sealing & caulking",
        "Appliance repair",
        "Window repair",
        "Floor repair",
        "Roof repair",
        "Gutter repair",
    ],
    plumbing: [
        "Pipe repair",
        "Leak detection & repair",
        "Faucet installation",
        "Toilet repair",
        "Drain repair",
        "Water heater installation",
    ],
    electrical: [
        "Wiring & rewiring",
        "Circuit breaker repair",
        "Outlet & switch installation",
        "Lighting installation",
        "Ceiling fan installation",
    ],
    furniture: [
        "Furniture assembly & repair",
        "Custom furniture making",
        "Upholstery repair",
        "Cabinet installation",
        "Shelving & wardrobe installation",
    ],
    trending: [
        "Smart home setup",
        "EV supply installation",
        "AI-powered security system",
        "Ergonomic furniture setup",
        "Standing desk assembly",
    ],
};

let selectedService = "";
let selectedSubcategory = "";

// Show subcategories when a main category is clicked
function showSubcategories(category, clickedElement) {
    const existingSubcategories = document.querySelector(".subcategories");
    if (existingSubcategories) {
        existingSubcategories.remove();
    }

    const parentCol = clickedElement.closest(".col-md-3");
    const subcategoriesDiv = document.createElement("div");
    subcategoriesDiv.className = "subcategories active";

    const subcategoryList = serviceCategories[category.toLowerCase()] || [];
    subcategoryList.forEach((subcat) => {
        const subcatDiv = document.createElement("div");
        subcatDiv.className = "subcategory-item";
        subcatDiv.textContent = subcat;
        subcatDiv.onclick = () => showServiceForm(category, subcat);
        subcategoriesDiv.appendChild(subcatDiv);
    });

    const nextElement = parentCol.nextElementSibling;
    const parentRow = parentCol.parentElement;
    const rowWidth = parentRow.offsetWidth;
    const colWidth = parentCol.offsetWidth;
    const colsPerRow = Math.floor(rowWidth / colWidth);
    const colIndex = Array.from(parentRow.children).indexOf(parentCol);
    const insertAfterIndex =
        Math.floor(colIndex / colsPerRow) * colsPerRow + colsPerRow - 1;
    const insertAfterElement =
        parentRow.children[insertAfterIndex] || parentRow.lastElementChild;

    insertAfterElement.after(subcategoriesDiv);
}

// Show service booking form
function showServiceForm(category, subcategory) {
    selectedService = category;
    selectedSubcategory = subcategory;
    document.getElementById("selectedServiceTitle").textContent = `Book ${subcategory}`;
    document.getElementById("serviceFormModal").style.display = "block";
}

// Handle service form submission
function handleServiceSubmit(event) {
    event.preventDefault();
    document.getElementById("serviceFormModal").style.display = "none";
    document.getElementById("confirmationDialog").style.display = "block";
}

// Confirm service order
function confirmServiceOrder() {
    const token = localStorage.getItem("jwt");
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (!token || !isLoggedIn) {
        alert("Please log in first to confirm your order");
        document.getElementById("confirmationDialog").style.display = "none";
        showLoginForm();
        return;
    }

    // Here you could add API call to save the order
    document.getElementById("confirmationDialog").style.display = "none";
    alert("Your service order has been confirmed! We will contact you soon.");
}

// Authentication functions (keeping the existing ones)
function showLoginForm() {
    document.getElementById("auth-forms").style.display = "block";
    document.getElementById("login-form").style.display = "block";
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("loginForm").style.display = "flex";
}

function showSignupForm() {
    document.getElementById("auth-forms").style.display = "block";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
}

function closeAuthForms() {
    document.getElementById("auth-forms").style.display = "none";
}

// Configure API base URL
const API_BASE_URL = window.location.hostname.includes("replit.dev")
    ? "/api"
    : "http://localhost:5000/api";

function handleLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.token) {
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("loggedIn", "true");
                closeAuthForms();
                updateAuthUI();
            } else {
                alert("Login failed");
            }
        })
        .catch(error => {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        });
}

function handleLogout() {
    localStorage.removeItem("jwt");
    alert("Logged out!");
    document.getElementById("logoutButton").style.display = "none";
}

function handleSignupSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.token) {
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("loggedIn", "true");
                closeAuthForms();
                updateAuthUI();
            } else {
                alert("Signup failed");
            }
        })
        .catch(error => {
            console.error("Signup error:", error);
            alert("Signup failed. Please try again.");
        });
}

// Services functions
function showWelcomeMessage(show) {
    document.getElementById("welcome-section").style.display = show
        ? "block"
        : "none";
}

async function fetchServices(category = "all") {
    try {
        const response = await fetch(`${API_BASE_URL}/services/all`);
        const services = await response.json();

        const filteredServices =
            category === "all"
                ? services
                : services.filter((service) => service.category === category);

        const serviceList = document.getElementById("serviceList");
        serviceList.innerHTML = filteredServices
            .map(
                (service) => `
            <div class="col-md-4">
                <div class="service-card">
                    <h3>${service.service_name}</h3>
                    <p>Category: ${service.category}</p>
                    <p>Price: $${service.price}</p>
                    <button class="btn btn-primary" onclick="bookService(${service.id})">
                        Book Now
                    </button>
                </div>
            </div>
        `,
            )
            .join("");
    } catch (error) {
        console.error("Error fetching services:", error);
    }
}

async function bookService(serviceId) {
    const token = localStorage.getItem("token");
    if (!token) {
        showLoginForm();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/bookings/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                service_id: serviceId,
                date: new Date().toISOString().split("T")[0],
                time: "10:00",
            }),
        });
        const data = await response.json();
        if (data.message) {
            alert("Booking successful!");
        }
    } catch (error) {
        console.error("Booking error:", error);
    }
}

// Add click handlers for service categories
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".service-category").forEach((category) => {
        category.addEventListener("click", (e) => {
            const serviceName = category
                .querySelector("h3")
                .textContent.toLowerCase();
            showSubcategories(serviceName, category);
        });
    });
    fetchServices("all");
});

function closeLoginForm() {
    document.getElementById("loginForm").style.display = "none";
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost/servicehub/backend/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                // Store user state in localStorage
                localStorage.setItem("loggedIn", "true");

                // Update UI
                updateAuthUI();
                closeLoginForm();
            } else {
                alert("Login failed: " + data.message);
            }
        })
        .catch((error) => {
            console.error("Error during login:", error);
        });
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem("loggedIn");
    updateAuthUI();
}

// Update UI Based on Auth State
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    document.querySelector('button[onclick="showLoginForm()"]').style.display =
        isLoggedIn ? "none" : "inline-block";
    document.querySelector('button[onclick="showSignupForm()"]').style.display =
        isLoggedIn ? "none" : "inline-block";
    document.getElementById("logoutButton").style.display = isLoggedIn
        ? "inline-block"
        : "none";
}


const districts = [
    "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh",
    "Comilla", "Narayanganj", "Gazipur", "Bogra", "Kushtia", "Jessore", "Dinajpur"
];

const serviceAreaSelect = document.getElementById('serviceArea');

// Populate the Service Area dropdown
districts.forEach(district => {
    const option = document.createElement('option');
    option.value = district.toLowerCase();
    option.textContent = district;
    serviceAreaSelect.appendChild(option);
});

// Popular services working method
document.querySelectorAll('.hero-category').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const selectedCategory = this.getAttribute('data-category');

        // Scroll to the Popular Services section smoothly
        const section = document.querySelector('#mainCategories');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }

        // Delay slightly so scroll completes and DOM is ready
        setTimeout(() => {
            const categoryItems = document.querySelectorAll('.service-category');
            categoryItems.forEach(item => {
                const titleElement = item.querySelector('h3');
                if (titleElement && titleElement.innerText.trim() === selectedCategory) {

                    // Optionally close other categories if needed
                    categoryItems.forEach(i => i.classList.remove('active')); // Remove 'active' from all
                    item.classList.add('active'); // Add 'active' to the selected one

                    // If your site uses a toggle function, call it here:
                    showSubcategories(selectedCategory, item);
                }
            });
        }, 500);
    });
});



window.onload = function () {
    populateServiceAreas();
    // First part: Handle token from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
        localStorage.setItem("jwt", token);
        window.history.replaceState({}, document.title, "/"); // Clean URL
        document.getElementById("logoutButton").style.display = "inline-block";
        // Optionally fetch user data here using the token
    }

    // Second part: Update auth UI
    updateAuthUI();

    // You might also want to add this if you're using the service categories
    document.querySelectorAll(".service-category").forEach((category) => {
        category.addEventListener("click", (e) => {
            const serviceName = category
                .querySelector("h3")
                .textContent.toLowerCase();
            showSubcategories(serviceName, category);
        });
    });

    // And this if you need to fetch services initially
    fetchServices("all");
};
