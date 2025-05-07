document.addEventListener('DOMContentLoaded', function() {
    // Get the login form element
    const loginForm = document.getElementById('loginForm');
    
    // Add submit event listener
    loginForm.addEventListener('submit', handleLoginSubmit);
});

function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Add your login logic here
    fetch('/api/auth/serviceProviders/loginPage/service-provider-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Store the JWT token in localStorage
            localStorage.setItem("jwtToken", data.token);

            // Login success, redirect to the dashboard
            window.location.href = '/serviceProviders/dashboard.html';
        } else {
            // If no token, display the error message
            alert('Login failed: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login');
    });
}

function closeAuthForms() {
    document.getElementById('authContainer').style.display = 'none';
}
