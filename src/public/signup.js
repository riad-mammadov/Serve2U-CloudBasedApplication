document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('signupForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Gather data from the form fields into an object
        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            name: document.getElementById('name').value,
            family_name: document.getElementById('family_name').value,
            birthdate: document.getElementById('birthdate').value
        };

        // Send request to the sign up route which interacts with cognito services and creates account / sends email --------------------------------------
        fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect user to the verification page if signup is successful
                    window.location.href = './verification.html';
                } else {
                    console.log('Signup failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error during signup:', error);
                alert('Signup failed. Please try again: ', error);
            });
    });

    // Function so password has correct input, the regex was created via AI

    form.addEventListener('submit', function (event) {
        const password = document.getElementById('password').value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!passwordRegex.test(password)) {
            event.preventDefault();
            alert('Password must be at least 8 characters long, include a symbol, a number, and both uppercase and lowercase letters.');
            // Ensures that thee password matches what Cognito expects
        }
    });
});