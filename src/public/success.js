document.addEventListener('DOMContentLoaded', function () {
    clearCookie("discount");
});

function clearCookie(name, path = '/') {
    document.cookie = name + '=; Path=' + path + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function toggleReview() {
    const reviewSection = document.getElementById('reviewSection');
    reviewSection.style.display = reviewSection.style.display === 'none' ? 'block' : 'none';
    if (reviewSection.style.display === 'block') {
        fetchProducts();
    }
}

var modal = document.getElementById("reviewModal");

var btn = document.querySelector("button[onclick='toggleReview()']");

var span = document.getElementsByClassName("close-button")[0];

// Function to fetch products to display in a list to pick from --------------------------------------

function fetchProducts() {
    fetch('http://localhost:8080/src/public/backend/getproducts.php')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('productSelect');
            select.innerHTML = '';
            data.products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Function to submit review to the database --------------------------------------

function submitReview() {
    const submitButton = document.querySelector('button[onclick="submitReview()"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...'; // Change button text to indicate action until completed

    const productID = document.getElementById('productSelect').value;
    const reviewText = document.getElementById('reviewText');
    const rating = document.getElementById('rating').value;

    const data = {
        product_id: productID,
        username: getCookie('username'),
        review_text: reviewText.value,
        rating: rating
    };

    fetch('http://localhost:8080/src/public/backend/submitReviews.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            submitButton.disabled = false; // Re-enable the button
            submitButton.textContent = 'Submit Review'; // Reset button text
            if (data.success) {
                alert('Review submitted successfully');
                reviewText.value = '';
                modal.style.display = "none";
                document.getElementById('productSelect').selectedIndex = 0;
                document.getElementById('rating').selectedIndex = 4;
            } else {
                alert('Failed to submit review: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error submitting review:', error);
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Review';
        });
}

// Function to get cookie --------------------------------------

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


// When the user clicks the review button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
    fetchProducts();
}

// Close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal close
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

