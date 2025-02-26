// Service categories data
const serviceCategories = {
    cleaning: ["Cleaning", "Party clean up", "Apartment cleaning", "Deep clean", "Garage Cleaning", "Move-out clean", "Gutter cleaning", "Pressure washing"],
    handyman: ["Appliance installation", "Carpentry", "Door lock repair", "Painting & drywall", "Ceiling installation", "Light fixture replacement", "Deck & fence repair"],
    moving: ["Moving Help", "Truck-assisted help moving", "Trash & furniture removal", "Heavy lifting & Loading", "Rearrange Furniture", "Junk haul away"],
    painting: ["Indoor painting", "Wallpapering", "Outdoor painting", "Concrete & brick painting", "Accent wall painting", "Wallpaper removal"],
    assembly: ["Desk assembly", "General furniture assembly", "IKEA assembly", "Crib assembly", "PAX assembly", "Bookshelf assembly"],
    mounting: ["Hang art, mirror & decor", "Install blinds & window treatments", "Mount & anchor furniture", "Install Shelves, rods & hooks", "TV mounting"],
    outdoor: ["Yard work", "Lawn care", "Snow removal", "Landscaping help", "Branch & Hedge Trimming", "Gardening & Weeding", "Fence repair", "Pool maintenance"],
    "home repairs": ["Door repair", "Wall repair", "Sealing & caulking", "Appliance repair", "Window repair", "Floor repair", "Roof repair", "Gutter repair"],
    plumbing: ["Pipe repair", "Leak detection & repair", "Faucet installation", "Toilet repair", "Drain repair", "Water heater installation"],
    electrical: ["Wiring & rewiring", "Circuit breaker repair", "Outlet & switch installation", "Lighting installation", "Ceiling fan installation"],
    furniture: ["Furniture assembly & repair", "Custom furniture making", "Upholstery repair", "Cabinet installation", "Shelving & wardrobe installation"],
    trending: ["Smart home setup", "EV supply installation", "AI-powered security system", "Ergonomic furniture setup", "Standing desk assembly"]
};

let selectedService = '';
let selectedSubcategory = '';

// Show subcategories when a main category is clicked
function showSubcategories(category, clickedElement) {
    const existingSubcategories = document.querySelector('.subcategories');
    if (existingSubcategories) {
        existingSubcategories.remove();
    }

    const parentCol = clickedElement.closest('.col-md-3');
    const subcategoriesDiv = document.createElement('div');
    subcategoriesDiv.className = 'subcategories active';

    const subcategoryList = serviceCategories[category.toLowerCase()] || [];
    subcategoryList.forEach(subcat => {
        const subcatDiv = document.createElement('div');
        subcatDiv.className = 'subcategory-item';
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
    const insertAfterIndex = Math.floor(colIndex / colsPerRow) * colsPerRow + colsPerRow - 1;
    const insertAfterElement = parentRow.children[insertAfterIndex] || parentRow.lastElementChild;

    insertAfterElement.after(subcategoriesDiv);
}

// Show service booking form
function showServiceForm(category, subcategory) {
    selectedService = category;
    selectedSubcategory = subcategory;
    document.getElementById('selectedServiceTitle').textContent = `Book ${subcategory}`;
    document.getElementById('serviceFormModal').style.display = 'block';
}

// Handle service form submission
function handleServiceSubmit(event) {
    event.preventDefault();
    document.getElementById('serviceFormModal').style.display = 'none';
    document.getElementById('confirmationDialog').style.display = 'block';
}

// Confirm service order
function confirmServiceOrder() {
    // Here you could add API call to save the order
    document.getElementById('confirmationDialog').style.display = 'none';
    alert('Your service order has been confirmed! We will contact you soon.');
}

// Authentication functions (keeping the existing ones)
function showLoginForm() {
    document.getElementById('auth-forms').style.display = 'block';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
}

function showSignupForm() {
    document.getElementById('auth-forms').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            fetchServices();
            document.getElementById('auth-forms').style.display = 'none';
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (data.message) {
            document.getElementById('auth-forms').style.display = 'none';
            window.location.reload();
        }
    } catch (error) {
        console.error('Signup error:', error);
    }
}


// Services functions
function showWelcomeMessage(show) {
    document.getElementById('welcome-section').style.display = show ? 'block' : 'none';
}

async function fetchServices(category = 'all') {
    try {
        const response = await fetch('/api/services/all');
        const services = await response.json();

        const filteredServices = category === 'all'
            ? services
            : services.filter(service => service.category === category);

        const serviceList = document.getElementById('serviceList');
        serviceList.innerHTML = filteredServices.map(service => `
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
        `).join('');
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

async function bookService(serviceId) {
    const token = localStorage.getItem('token');
    if (!token) {
        showLoginForm();
        return;
    }

    try {
        const response = await fetch('/api/bookings/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                service_id: serviceId,
                date: new Date().toISOString().split('T')[0],
                time: '10:00'
            })
        });
        const data = await response.json();
        if (data.message) {
            alert('Booking successful!');
        }
    } catch (error) {
        console.error('Booking error:', error);
    }
}


// Add click handlers for service categories
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-category').forEach(category => {
        category.addEventListener('click', (e) => {
            const serviceName = category.querySelector('h3').textContent.toLowerCase();
            showSubcategories(serviceName, category);
        });
    });
    fetchServices('all');
});