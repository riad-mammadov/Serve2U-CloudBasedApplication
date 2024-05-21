document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const username = getCookie('username');
    console.log("Username:", username);

    if (!username) {
        console.error('No username found.');
        document.getElementById('userOrderHistoryContainer').textContent = 'Error: No username found.';
        return;
    }
    fetchUserOrders(username);
});

// AI was used for the below function to help me debug, as i was having issues with making requests over the
// different ports and added the credentials include

// Function to get all orders by the user that have been completed ------------------------------
function fetchUserOrders(username) {
    const url = `http://localhost:8080/src/public/backend/getOrders.php?username=${encodeURIComponent(username)}`;
    fetch(url, {
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(orders => {
            displayOrders(orders);
        })
        .catch(error => {
            console.error('Error fetching user orders:', error);
            document.getElementById('userOrderHistoryContainer').textContent = 'Error loading orders: ' + error.message;
        });
}

// AI was used in order to help me to create a function which gets the cookie of certain type from the browser

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

// Function to display all orders ------------------------------


function displayOrders(orders) {
    const container = document.getElementById('userOrderHistoryContainer');
    container.innerHTML = '';

    if (!Array.isArray(orders) || orders.length === 0) {
        console.error('Expected an array of orders, received:', orders);
        container.textContent = 'No order history available. Once an order is completed, it will display here.';
        return;
    }

    const table = document.createElement('table');
    table.className = 'order-table';

    const thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Order ID</th>
        <th>Date</th>
        <th>Total</th>
        <th>Products</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    orders.forEach(order => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.created_at}</td>
            <td>£${order.total}</td>
            <td>
                <ul>
                    ${order.products.map(product => `<li>${product.product_name} (x${product.quantity})</li>`).join('')}
                </ul>
            </td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

