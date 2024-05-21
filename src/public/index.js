document.addEventListener('DOMContentLoaded', function () {
    updateUIBasedOnAuthStatus();

    document.getElementById('logoutButton').addEventListener('click', function () {
        logout();
    });

    const optionsButton = document.getElementById('optionsButton');
    const logoutButton = document.getElementById('logoutButton');
    const orderLink = document.getElementById('orderLink');
    const dashboardLink = document.getElementById('dashboardLink');



});



// Function to determine what is displayed after log in --------------------------------------

function updateUIBasedOnAuthStatus() {
    let token = getCookie('token');
    let isStaff = getCookie('isStaff') === 'true';

    if (token) {
        logoutButton.style.display = 'inline-block';
        orderHistoryLink.style.display = 'inline-block';
        if (isStaff) {
            // Staff UI
            optionsButton.style.display = 'none';
            orderLink.style.display = 'none';
            orderHistoryLink.style.display = 'none';
            dashboardLink.style.display = 'inline-block'; // Show dashboard link for staff
        } else {
            // Regular user UI
            optionsButton.style.display = 'none'; // hides log in or sign up button
            orderLink.style.display = 'inline-block'; // Show order now button for user
            dashboardLink.style.display = 'none'; // hides dashboard link for non-staff
            orderHistoryLink.style.display = 'inline-block';
        }
    } else {
        // User is not logged in so displays the log in or sign up button
        optionsButton.style.display = 'inline-block';
        optionsButton.onclick = showOptionsModal;
        logoutButton.style.display = 'none';
        orderLink.style.display = 'none';
        dashboardLink.style.display = 'none';
        orderHistoryLink.style.display = 'none';
    }
}

// Function to clear cookies upon log out --------------------------------------

function logout() {
    clearCookie('token');
    clearCookie('username');
    clearCookie('staff_username');
    clearCookie('seat');
    clearCookie('seatrow');
    clearCookie('stadium');
    clearCookie('isStaff');
    clearCookie('cart');
    clearCookie('discount');

    location.reload();
}

// Function to show options modal --------------------------------------

function showOptionsModal() {
    document.getElementById('optionsModal').style.display = 'block';
}

// If user clicks outside of the modal close it  --------------------------------------

var optionsModal = document.getElementById('optionsModal');
window.onclick = function (event) {
    if (event.target == optionsModal) {
        optionsModal.style.display = "none";
    }
}

// Function to get cookie details  --------------------------------------

function getCookie(name) {
    let cookieArray = document.cookie.split(';');
    let cookieName = name + "=";

    for (let i = 0; i < cookieArray.length; i++) {
        let c = cookieArray[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cookieName) === 0) {
            return c.substring(cookieName.length, c.length);
        }
    }
    return "";
}

// Function to clear cookie by setting a past date --------------------------------------

function clearCookie(name, path = '/') {
    document.cookie = name + '=; Path=' + path + '; Expires=Thu, 01 Jan 1969 00:00:01 GMT;';
}