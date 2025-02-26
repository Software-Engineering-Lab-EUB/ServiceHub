
// Authentication functions
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
            showLoginForm();
        }
    } catch (error) {
        console.error('Signup error:', error);
    }
}

// Services functions
async function fetchServices() {
    try {
        const response = await fetch('/api/services/all');
        const services = await response.json();
        
        const serviceList = document.getElementById('serviceList');
        serviceList.innerHTML = services.map(service => `
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

// Load services when page loads
document.addEventListener('DOMContentLoaded', fetchServices);
