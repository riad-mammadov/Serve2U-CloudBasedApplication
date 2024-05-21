/* For this page a tutorial was followed however the design was completely refined along with the functionality, but the core base of the
cart.html page uses this tutorial to help as it was the first time implementing a payment system into a project 

https://www.youtube.com/watch?v=LgnITjRQnlM

Upon any issues with my functions that i was not able to diagnose myself, i used StackOverflow along with AI prompts to help me find and diagnose the issue


*/

window.addEventListener('DOMContentLoaded', () => {

    const cartBtn = document.querySelector('.cartBtn')
    const itemContainer = document.querySelector('.item-container')
    const tbody = document.querySelector('.tbody')
    const checkoutBtn = document.querySelector('.checkout-btn')

    const scheduleOrderCheckbox = document.getElementById('scheduleOrderCheckbox');
    const scheduleTimeInput = document.getElementById('scheduleTimeInput');

    // Extract details from cookies
    const username = getCookie('username');
    const seat = getCookie('seat');
    const stadium = getCookie('stadium');
    const seatrow = getCookie('seatrow');

    const reviewsModal = document.getElementById('reviewsModal');
    const reviewsContainer = document.querySelector('.reviews-container');
    const closeModal = document.querySelector('.modal .close');





    loadCart(); // Loads the cart from cookie on initial page load
    checkTokenAndRedirect(); // Function to check if user has a token




    // Function to load cart from cookie (upon refresh or leaving the page)--------------------------------------
    function loadCart() {
        const cart = getCookie('cart');
        if (cart) {
            const cartItems = JSON.parse(cart);
            cartItems.forEach(item => {
                const tr = document.createElement('tr');
                tr.classList.add('item-row');
                tr.setAttribute('item-id', item.id);
                tr.innerHTML = `
                <td class="item-img"><img src="${item.imgSrc}"></td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><input type="number" value="${item.quantity}"></td>
                <td><button class="rm-btn">&times;</button></td>
            `;
                tbody.appendChild(tr);
            });
            updateTotal();
        }
    }


    // Function that checks for access token and redirects if none is found --------------------------------------
    function checkTokenAndRedirect() {
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
        const token = getCookie('token');
        if (!token) {
            alert('Please log in.');
            window.location.href = 'http://localhost:3000/index.html'; // Redirect to the index.html page if it does not exist 
        }
    }

    // Function to retrieve items from database and display on menu --------------------------------------
    fetch('http://localhost:8080/src/public/backend/myserver.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(res => res.json())
        .then(data => {
            data.forEach(product => {
                const div = document.createElement('div')
                div.classList.add('item')
                div.setAttribute('item-id', product.id)
                div.setAttribute('data-category', product.category);
                div.innerHTML = `
                          <img src="/src/public/html/${product.image}">
                          <h3>${product.name}</h3>
                          <span class="price">£${(product.price / 100).toFixed(2)}</span>
                        <button class="btn add-btn">Add To Cart</button>
                        <button class="btn review-btn">Reviews</button>

            `
                itemContainer.appendChild(div)
            })
        })



    // Function to open the cart --------------------------------------
    const toggleCart = () => {
        const cart = document.querySelector('.cart');
        if (cart.style.right === '0px') {
            cart.style.right = '-100%'; // Hide the cart 
        } else {
            cart.style.right = '0px'; // Show the cart 
        }
    };


    cartBtn.addEventListener('click', toggleCart);


    // Set up MutationObserver to dynamically attach event handlers to items in item-container and table body --------------------------------------

    let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (!mutation.addedNodes.length == 1) return
            if (mutation.target.classList.contains('item-container')) {
                mutation.addedNodes[0].children[3].addEventListener('click', addCartElm)
            }
            if (mutation.target.classList.contains('tbody')) {
                mutation.addedNodes[0].lastElementChild.addEventListener('click', rmCartElm)
                const quantity = mutation.addedNodes[0].children[3]
                quantity.addEventListener('change', quantityChange)
            }
        })
    })
    observer.observe(itemContainer, {
        childList: true
    })
    observer.observe(tbody, {
        childList: true
    })



    // Function to add item to the cart --------------------------------------
    function addCartElm() {
        const itemId = this.parentElement.getAttribute('item-id');

        // Try to find an existing row with the same item-id attribute
        const existingRow = tbody.querySelector(`.item-row[item-id="${itemId}"]`);

        if (existingRow) {
            // If the item already exists in the cart, increase the quantity instead of just adding another row and taking up more space
            const quantityInput = existingRow.querySelector('input[type=number]');
            quantityInput.value = parseInt(quantityInput.value) + 1;
            updateTotal();
        } else {
            const tr = document.createElement('tr')
            tr.classList.add('item-row')
            tr.setAttribute('item-id', this.parentElement.getAttribute('item-id'))
            tr.innerHTML = `
        <td class="item-img"> <img src="${this.parentElement.children[0].src}"> </td>
        <td> ${this.parentElement.children[1].innerText}</td>
        <td>${this.parentElement.children[2].innerText}</td>
        <td><input type="number" value="1"></td>
        <td><button class="rm-btn">&times</td>
        `
            tbody.insertBefore(tr, tbody.lastElementChild)
        }
        updateTotal();
        saveCart();

    }

    // Event Delegation for removing items from cart to ensure removal (When cart is loaded) --------------------------------------

    tbody.addEventListener('click', function (event) {
        if (event.target.classList.contains('rm-btn')) {
            const row = event.target.closest('tr');
            const quantityInput = row.querySelector('input[type=number]');
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantityInput.value = quantity - 1;
            } else {
                row.remove(); // If quantity is 1, remove the row
            }
            updateTotal();
            saveCart();
        }
    });



    // Function to remove item from cart --------------------------------------
    function rmCartElm() {
        const row = this.parentElement;
        const quantityInput = row.querySelector('input[type=number]');
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantity -= 1;
            quantityInput.value = quantity;
        } else {
            row.remove(); // If quantity is 1, remove the row
        }
        updateTotal();
        saveCart();
    }

    // Close cart if X button is clicked on
    document.querySelector('.close-cart-btn').addEventListener('click', toggleCart);

    // Function for changing quantity and updating the total --------------------------------------

    function quantityChange(e) {
        if (e.target.value == '' || e.target.value.startsWith('-') || e.target.value == '0')
            e.target.value == '1'
        updateTotal();
        saveCart();

    }




    // Function to post data to backend and redirect user to Stripe payment services to pay for items in cart --------------------------------------
    checkoutBtn.addEventListener('click', () => {
        let itemsToBuy = [];
        const itemRows = document.querySelectorAll('.item-row');
        const notes = document.getElementById('notesInput').value;
        const scheduleOrder = scheduleOrderCheckbox.checked;
        const scheduledTime = scheduleOrder ? scheduleTimeInput.value : null;

        let total = 0;
        itemRows.forEach(row => {
            let price = parseFloat(row.children[2].innerText.replace('£', ''));
            let quantity = parseInt(row.children[3].querySelector('input[type=number]').value);
            total += price * quantity;
        });

        itemRows.forEach(row => {
            let obj = {
                id: row.getAttribute('item-id'),
                quantity: (row.children[3].firstElementChild.value)
            };
            itemsToBuy.push(obj);
        });

        const discountPercent = parseFloat(getCookie('discount') || '0');


        fetch('http://localhost:8080/src/public/backend/myserver.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                items: itemsToBuy,
                username: username,
                seat: seat,
                notes: notes,
                stadium: stadium,
                seatrow: seatrow,
                scheduledTime: scheduledTime,
                discountPercent: discountPercent
            })
        }).then(res => res.json())
            .then(data => {
                var stripe = Stripe('Private Key');
                stripe.redirectToCheckout({
                    sessionId: data.id
                });
            })
        clearCookie('cart');
    });

    // If URL Query parameter is failure, alert user the order was unsuccessful --------------------------------------
    window.addEventListener('load', (event) => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        if (status === 'failure') {
            showNotification('The order was unsuccessful. Please try again.');
        }

    });

    // Function to filter items based on categories --------------------------------------
    function filterItems(category) {
        const items = itemContainer.getElementsByClassName('item');
        for (let item of items) {
            // Show all items when all category is selected
            if (category.toLowerCase() === 'all') {
                item.style.display = 'flex';
            } else if (item.getAttribute('data-category').toLowerCase() === category.toLowerCase()) {
                item.style.display = 'flex'; // Show item if it matches the category
            } else {
                item.style.display = 'none'; // Hide item if it doesn't match the category
            }
        }
    }

    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function () {
            let category = this.textContent;
            filterItems(category);
        });
    });




    // Function to search for item using search bar --------------------------------------
    function searchItems() {
        const input = document.getElementById('searchInput');
        const filter = input.value.toUpperCase();
        const itemContainer = document.querySelector('.item-container');
        const items = itemContainer.getElementsByClassName('item');

        for (let i = 0; i < items.length; i++) {
            // Find the product name within the items displayed
            let name = items[i].querySelector('h3').textContent;
            if (name.toUpperCase().indexOf(filter) > -1) {
                items[i].style.display = "flex"; // Item matches the search, so show it
            } else {
                items[i].style.display = "none"; // Item does not match the search, so hide it
            }
        }
    }
    document.getElementById('searchInput').addEventListener('keyup', searchItems);


    // Event listener to display the schedule time upon ticking the box --------------------------------------


    scheduleOrderCheckbox.addEventListener('change', () => {
        if (scheduleOrderCheckbox.checked) {
            scheduleTimeInput.style.display = 'block';
        } else {
            scheduleTimeInput.style.display = 'none';
        }
    });


    // Event listener to display modal when review button is clicked on --------------------------------------

    closeModal.addEventListener('click', () => {
        reviewsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === reviewsModal) {
            reviewsModal.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('review-btn')) {
            const productId = event.target.closest('.item').getAttribute('item-id');
            fetchReviews(productId);
        }
    });

    // Function to display review based on product selected --------------------------------------
    function fetchReviews(productId) {
        fetch(`http://localhost:8080/src/public/backend/getReviews.php?product_id=${productId}`)
            .then(response => response.json())
            .then(reviews => {
                reviewsContainer.innerHTML = '';
                reviews.forEach(review => {
                    const reviewDiv = document.createElement('div');
                    reviewDiv.innerHTML = `<p><strong>${review.username}:</strong> ${review.review_text} - Rating: ${review.rating}/5</p>`;
                    reviewsContainer.appendChild(reviewDiv);
                });
                reviewsModal.style.display = 'block';
            })
            .catch(error => console.error('Failed to fetch reviews:', error));
    }

    // Opening the modal when discount code button is clicked --------------------------------
    var discountModal = document.getElementById('discountModal');
    var btn = document.querySelector('.discountBtn');
    var span = discountModal.querySelector('.close');

    btn.onclick = function () {
        discountModal.style.display = "block";
        toggleCart(false);
    }
    span.onclick = function () {
        discountModal.style.display = "none";
        toggleCart(true);
    }
    window.onclick = function (event) {
        if (event.target == discountModal) {
            discountModal.style.display = "none";
            toggleCart(true);
        }

    }
});

function applyDiscount() {
    const discountCodeInput = document.querySelector('#discountCodeInput');

    console.log("Discount Code:", discountCodeInput.value);
    fetch('http://localhost:8080/src/public/backend/applyDiscount.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'code=' + encodeURIComponent(discountCodeInput.value)
    })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                const discountPercentage = parseFloat(data.discount);
                document.cookie = 'discount=' + discountPercentage + '; path=/; max-age=86400';
                showNotification("Discount code successfully applied.");
                discountModal.style.display = "none";
                updateTotal();
            } else {
                showNotification(data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}



// Function to save cart to cookie which clears upon checkout to allow for saving cart --------------------------------------
function saveCart() {
    let cartItems = [];
    document.querySelectorAll('.item-row').forEach(row => {
        let item = {
            id: row.getAttribute('item-id'),
            imgSrc: row.querySelector('img').src,
            name: row.querySelector('td:nth-child(2)').innerText,
            price: row.querySelector('td:nth-child(3)').innerText,
            quantity: row.querySelector('input[type=number]').value
        };
        cartItems.push(item);
    });
    document.cookie = 'cart=' + encodeURIComponent(JSON.stringify(cartItems)) + '; path=/';
}



// Function to update total displayed in the basket / cart --------------------------------------
function updateTotal() {
    total = 0
    const discountPercentage = parseFloat(getCookie('discount')) || 0 / 100; // Retrieves discount and convert to decimal
    const rows = document.querySelectorAll('.item-row')
    rows.forEach(row => {
        const ary = Array.from(row.children)
        const elm = ary.find(x => x.firstElementChild instanceof HTMLInputElement)
        let quantity = parseInt(elm.firstElementChild.value)
        let price = (ary[2].innerText).replace('£', '')
        price = price.replace(new RegExp('/.*'), '')
        price = parseFloat(price)
        total += quantity * price
    })
    total *= (1 - discountPercentage / 100);
    total = total.toFixed(2)

    const totalRow = document.querySelector('.totalRow>td')
    totalRow.innerText = `Total: £${total}`

    const discountDisplay = document.querySelector('.discount-display');
    if (discountPercentage > 0) {
        discountDisplay.textContent = `Discount code of ${discountPercentage}% active`;
        discountDisplay.style.display = 'block';
    } else {
        discountDisplay.textContent = '';
        discountDisplay.style.display = 'none';
    }

    if (total > 0) document.querySelector('.checkout-btn').disabled = false
    else document.querySelector('.checkout-btn').disabled = true
}

// Function to retrieve cookie details --------------------------------------

function getCookie(name) {
    let cookieArray = document.cookie.split('; ');
    let cookie = cookieArray.find(c => c.startsWith(name + '='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

// Function to clear cookie --------------------------------------

function clearCookie(name, path = '/') {
    document.cookie = name + '=; Path=' + path + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        notification.addEventListener('animationend', () => {
            document.body.removeChild(notification);
        });
    }, 5000);

    notification.style.display = 'block';
}
