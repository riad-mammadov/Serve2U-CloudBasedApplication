
// Function to verify the code sent to email --------------------------------------

function verifyCode() {
    const username = document.getElementById('username').value;
    const verificationCode = document.getElementById('verificationCode').value;

    // Check if either the username or the verification code fields are empty
    if (!username || !verificationCode) {
        alert('Please enter both your username and the verification code.');
        return;
    }

    // Post username and code to route and verify code --------------------------------------

    fetch('/auth/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, code: verificationCode })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // If verification is successful, redirect to index.html
                window.location.href = './login.html';
            } else {
                alert('Verification failed, please ensure your inputs are correct');
            }
        })
        .catch(error => {
            console.error('Error during verification:', error);
            alert('Verification failed. Please try again.');
        });
}