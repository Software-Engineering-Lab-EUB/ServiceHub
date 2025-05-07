document.addEventListener('DOMContentLoaded', () => {
    // Fetch pending bookings and display them
    fetchBookings();

    // Go to Home Page
    document.getElementById('go-home').addEventListener('click', () => {
        window.location.href = '/serviceProviders/dashboard.html';
    });

    // Close popup
    document.getElementById('close-popup').addEventListener('click', () => {
        document.getElementById('popup').style.display = 'none';
    });
});

// Function to fetch bookings from the API
function fetchBookings() {
    fetch('/api/book/pending') // API endpoint to get pending bookings
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#tasks-table tbody');
            tableBody.innerHTML = ''; // Clear previous content

            data.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.id}</td>
                    <td>${booking.user_name}</td>
                    <td>${booking.contact_number}</td>
                    <td>${booking.email}</td>
                    <td>${booking.service_address}</td>
                    <td>${booking.date}</td>
                    <td>${booking.time}</td>
                    <td>${booking.work_details}</td>
                    <td>${booking.status}</td>
                    <td>${booking.created_at}</td>
                    <td>
                        <input type="checkbox" class="status-checkbox" data-id="${booking.id}" ${booking.status === 'done' ? 'checked' : ''}>
                        <span class="status-text">${booking.status === 'done' ? 'Done' : ''}</span>
                    </td>
                    <td>
                        <button class="accept-btn" onclick="showConfirmPopup(${booking.id}, 'accept')">Accept</button>
                        <button class="decline-btn" onclick="showConfirmPopup(${booking.id}, 'decline')">Decline</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Add event listeners for checkboxes
            const checkboxes = document.querySelectorAll('.status-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const bookingId = e.target.dataset.id;
                    const newStatus = e.target.checked ? 'done' : 'pending';
                    updateBookingStatus(bookingId, newStatus);
                    e.target.nextElementSibling.textContent = e.target.checked ? 'Done' : '';
                });
            });
        });
}

// Show confirmation popup
function showConfirmPopup(bookingId, action) {
    const popupMessage = action === 'accept' ? 'Do you want to accept this booking?' : 'Do you want to decline this booking?';
    document.getElementById('popup-message').textContent = popupMessage;
    document.getElementById('popup').style.display = 'block';

    // Confirm action
    document.getElementById('confirm-action').onclick = () => {
        updateBookingStatus(bookingId, action);
        document.getElementById('popup').style.display = 'none';
    };
}

// Update booking status in the database
function updateBookingStatus(bookingId, status) {
    fetch(`/api/book/${bookingId}/status`, {  // Corrected the endpoint to match the backend route
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(() => {
        // After status update, refresh the page
        fetchBookings();
    })
    .catch((error) => {
        console.error("Error updating status:", error);
    });
}


// Function to handle the accept/decline buttons
function handleBookingAction(bookingId, action) {
    const status = action === 'accept' ? 'accepted' : 'declined';
    updateBookingStatus(bookingId, status);
}
//
// Function to handle the status checkbox change event
function handleStatusChange(bookingId, checkbox) {
    const status = checkbox.checked ? 'done' : 'pending';
    updateBookingStatus(bookingId, status);
}
