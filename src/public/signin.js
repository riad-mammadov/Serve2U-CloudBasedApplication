document.getElementById('signInForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const stadium = document.getElementById('stadium').value;
    const seatnumber = document.getElementById('seat-number').value;
    const seatrow = document.getElementById('seatrow').value;


    // Post details to the route created in auth.controller --------------------------------------

    fetch('/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(response => response.json())
        .then(data => {
            validateToken(data.token); // Function to validate token
        })
        .catch(error => console.error('Error:', error));

    // Function to set cookie --------------------------------------


    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Function to validate token --------------------------------------

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
                    window.location = 'http://localhost:3000';
                    setCookie('token', token, 1); // Stores token in cookie for 1 day 
                    setCookie('username', username, 1); // Stores username in cookie for 1 day
                    setCookie('stadium', stadium, 1); // Stores stadium in cookie for 1 day
                    setCookie('seat', seatnumber, 1); // Stores seat in cookie for 1 day
                    setCookie('seatrow', seatrow, 1); // Stores row in cookie for 1 day
                } else {
                    console.log('Failed to validate token, server responded with status:', response.status);
                    alert('Invalid Details, please try again ');

                }
            })
            .catch(error => {
                console.error('Validation error:', error);
                alert('Invalid Details, please try again: ' + error.message);
            });
    }
});
