document.getElementById('staffSignInForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    // Send details to signin route which interacts with cognito and logs them in if token is retrieved --------------------------------------

    fetch('/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.groups && data.groups.includes('Staff')) {
                console.log('Token:', data.token);
                setCookie('token', data.token, 1); // Stores token in cookie for 1 day 
                setCookie('staff_username', username, 1); // Stores username in cookie for 1 day
                setCookie('isStaff', data.groups.includes('Staff'), 1); // Sets a cookie if staff group assigned in cognito is associated with login
                validateToken(data.token);
            } else {
                alert('Access Denied. You are not authorized to access the staff portal.');
                window.location = 'http://localhost:3000';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login error: ' + error.message);
        });
});

// Function to set cookie --------------------------------------

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to validate token and redirect to dashboard --------------------------------------


function validateToken(token) {
    fetch('/protected/secret', {
        method: 'GET',
        headers: {
            'Auth': `${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                console.log('Token validated successfully');
                window.location = 'http://localhost:8080/src/public/html/staffdashboard.html';
            } else {
                console.log('Failed to validate token, server responded with status:', response.status);
                throw new Error('Token validation failed with status ' + response.status);
            }
        })
        .catch(error => {
            console.error('Validation error:', error);
            alert('Invalid Details, please try again: ' + error.message);
        });
}


