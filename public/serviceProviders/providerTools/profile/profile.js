import jwt_decode from 'jwt-decode';
// Fetch and populate user data
document.addEventListener('DOMContentLoaded', () => {
    //get the JWT token from LocalStorage
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        //Redirect to the login page if no token is available
        const errorContainer = document.createElement('div');
        errorContainer.className = 'alert alert-danger';
        errorContainer.style.margin = '20px';
        errorContainer.style.padding = '20px';
        errorContainer.style.borderRadius = '5px';
        errorContainer.innerHTML = `
            <h2>User information not found</h2>
            <p>There is a problem on fetching your data.</p>
            <a href="/serviceProviders/dashboard.html" class="btn btn-primary">Go To Home Page</a>
        `;
        
        // Clear the page content and show the error message
        document.body.innerHTML = '';
        document.body.appendChild(errorContainer);
        return;
    }
    console.log("Token found:", token);  // Debugging statement
    //Get the userID from the token (decoded)
    const decoded = jwt_decode(token);
    const userId = decoded.id;     //Extract userID from the token

        //Fetch the service provider's profile
       fetch(`/api/profiles/providers/${userId}`, {
        method: "GET",
        headers: {
            "Authorization":  `Bearer ${token}` //Include the token in the header
            }
       })
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data:", data);  // Debugging statement
            document.getElementById('name').value = data.name;
            document.getElementById('phone').value = data.phone;
            document.getElementById('email').value = data.email;
            document.getElementById('nid').value = data.nid;
            document.getElementById('serviceCategory').value = data.serviceCategory;
            document.getElementById('experience').value = data.experience;
            document.getElementById('service_area').value = data.service_area;
            document.getElementById('workStart').value = data.workStart;
            document.getElementById('workEnd').value = data.workEnd;

            // Set the profile image source dynamically
            const profilePicPath = data.profilePicPath ; // Default image if not found
            document.getElementById('profilePhoto').src = profilePicPath;
        })
        .catch(error => console.error('Error fetching profile data:', error));

    // Handle profile picture upload
    document.getElementById('profilePicInput').addEventListener('change', handleFileUpload);

    // Handle profile update
    document.getElementById('profileForm').addEventListener('submit', updateProfile);
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('profilePic', file);
    formData.append('phone', document.getElementById('phone').value);

    fetch('/api/profiles/upload-profile-pic', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwtToken")}` //Include the token in the header
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const profilePicPath = `/serviceProviders/providerTools/profile/profilePictures/${data.phone}.jpg`;
            document.getElementById('profilePhoto').src = profilePicPath;
        } else {
            alert('Error uploading profile picture');
        }
    })
    .catch(error => console.error('Error uploading profile picture:', error));
}

//Update profile function with JWT token
function updateProfile(event) {
    event.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) {
        alert("You must be logged in to update your profile.");
        return;
    }

    const profileData = {
        user_id         : userId, // Get userId dynamically from the token
        name            : document.getElementById('name').value,
        phone           : document.getElementById('phone').value,
        email           : document.getElementById('email').value,
        nid             : document.getElementById('nid').value,
        serviceCategory : document.getElementById('serviceCategory').value,
        experience      : document.getElementById('experience').value,
        service_area     : document.getElementById('service_area').value,
        workStart       : document.getElementById('workStart').value,
        workEnd         : document.getElementById('workEnd').value
    };

    fetch('/api/profiles/update-provider', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, //Include the token in the request
        },
        body: JSON.stringify(profileData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else {
            alert('Profile update failed');
        }
    })
    .catch(error => console.error('Error updating profile:', error));
}
