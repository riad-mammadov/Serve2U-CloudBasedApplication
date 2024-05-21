//For this page the structure was taken from a bootstrap tutorial as i had never used it before, and was then edited to tailor to 
//the needs of my project and staff dashboard requirements. 

//The github for this along with the JS and CSS = https://github.com/codzsword/bootstrap-admin-dashboard/blob/main/index.html

// The javascript was adopted however was completely altered as i added my own functionality to the dashboard.

// Upon any issues with my functions that i was not able to diagnose myself, i used StackOverflow along with AI prompts to help me find and diagnose the issue


document.addEventListener("DOMContentLoaded", function () {
    fetchOrders(); // For overview to display recent orders
    ManageData(); // for manage orders section with main details needed ie products username seatnumber stadium etc 
    fetchOrderHistory(); // for order history section to get details from the order history and order items history table to store completed orders 
    setWelcomeMessage(); // for the welcome message 
    fetchMenuItems(); // for the edit item section
    fetchReviews(); // For displaying reviews on manage review section
    fetchDiscounts();


    // ------------------------------------------------------------

    const sections = document.querySelectorAll('#welcomeSection, #earningsSection, #earningsSection2, #overview, #manageOrders, #orderhistory, #addItemSection, #removeItemSection, #manageReviews, #userDetailsSection, #discountSection, #manageDiscountsSection');
    const ordersOverview = document.querySelector('#ordersOverview');
    const manageOrdersLink = document.querySelector('.manage-orders-link');
    const orderHistoryLink = document.querySelector('.order-history-link');
    const addItem = document.querySelector('.additem');
    const removeItem = document.querySelector('.removeItem');
    const manageReviews = document.querySelector('.manage-reviews-link');
    const viewUserDetails = document.querySelector('.viewUserDetails');
    const addDiscount = document.querySelector('.addDiscount');
    const manageDiscountsLink = document.querySelector('.manage-discounts-link');


    // Function to show specific sections ---------
    function showSection(sectionDisplay) {
        sections.forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionDisplay).style.display = 'block';
    }

    // Displaying each section to show on click of the sidebar ------------

    manageDiscountsLink.addEventListener('click', function (event) {
        event.preventDefault();
        showSection('manageDiscountsSection');
        fetchDiscounts();
    });

    addDiscount.addEventListener('click', function (event) {
        event.preventDefault();
        showSection('discountSection');
    });

    viewUserDetails.addEventListener('click', function (event) {
        event.preventDefault();
        showSection('userDetailsSection');
        fetchUserDetails();
    });

    manageReviews.addEventListener('click', function (event) {
        event.preventDefault();
        showSection('manageReviews');
    });

    removeItem.addEventListener('click', function (event) {
        event.preventDefault();
        showSection('removeItemSection');
        fetchMenuItems();
    });

    addItem.addEventListener('click', function (event) {
        event.preventDefault();
        showSection('addItemSection');
    });

    manageOrdersLink.addEventListener('click', function (event) {
        event.preventDefault();
        showSection('manageOrders');
    });

    ordersOverview.addEventListener('click', function (event) {
        event.preventDefault();
        sections.forEach(section => { section.style.display = 'none'; });
        document.getElementById('welcomeSection').style.display = 'block';
        document.getElementById('earningsSection').style.display = 'block';
        document.getElementById('overview').style.display = 'block';
    });

    orderHistoryLink.addEventListener('click', function (event) {
        event.preventDefault();
        showSection('orderhistory');
        document.getElementById('earningsSection2').style.display = 'block';

    });

    // Function to get user details ----------------------------------------------

    function fetchUserDetails() {
        fetch('http://localhost:8080/src/public/backend/getUserDetails.php')
            .then(response => response.json())
            .then(users => {
                const tableBody = document.querySelector('#userDetailsSection .table tbody');
                tableBody.innerHTML = '';
                users.forEach(user => {
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = user.username;

                    const emailCell = row.insertCell(1);
                    emailCell.textContent = user.email + " ";

                    const emailButton = document.createElement('button');
                    emailButton.textContent = "Email";
                    emailButton.className = 'btn btn-sm btn-primary email-user-button';
                    emailButton.onclick = () => {
                        window.location.href = `mailto:${user.email}`;
                    };

                    emailCell.appendChild(emailButton);

                    row.insertCell(2).textContent = user.first_name;
                    row.insertCell(3).textContent = user.last_name;
                    row.insertCell(4).textContent = user.dob;
                });
            })
            .catch(error => console.error('Error fetching user details:', error));
    }

    // Function to send form data from discount code to the backend which insert the code to the DB ------------------
    document.getElementById('discountForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const code = document.getElementById('discountCode').value;
        const percent = document.getElementById('discountPercent').value;

        fetch('http://localhost:8080/src/public/backend/setDiscount.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'code=' + encodeURIComponent(code) + '&percent=' + encodeURIComponent(percent)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Discount set successfully!');
                } else {
                    showNotification('Failed to set discount: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error setting discount:', error);
                showNotification('Failed to set discount.');
            });
    });




    // Fetches Reviews for Manage Review section -------------------------------------
    function fetchReviews() {
        fetch('http://localhost:8080/src/public/backend/getReviewsStaff.php')
            .then(response => response.json())
            .then(reviews => {
                const tableBody = document.querySelector('#manageReviews .table tbody');
                tableBody.innerHTML = '';
                reviews.forEach(review => {
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = review.review_id;
                    row.insertCell(1).textContent = review.product_name;
                    row.insertCell(2).textContent = review.username;
                    row.insertCell(3).textContent = review.review_text;
                    row.insertCell(4).textContent = review.rating;
                    row.insertCell(5).textContent = new Date(review.created_at).toLocaleString();
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'btn btn-danger';
                    deleteButton.onclick = () => deleteReview(review.review_id);
                    row.insertCell(6).appendChild(deleteButton);
                });
            })
            .catch(error => console.error('Error:', error));
    }


    // Function to open view detail modal ----------------------------------------

    document.addEventListener('click', function (e) {
        if (e.target && e.target.matches('.view-details-button')) {
            const orderId = e.target.getAttribute('data-order-id');
            fetchOrderDetails(orderId);
        }
    });


    // Function to fetch information for view details ----------------------------------------

    function fetchOrderDetails(orderId) {
        fetch('http://localhost:8080/src/public/backend/viewdetailmodal.php?order_id=' + orderId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                populateOrderDetailsModal(data);
                new bootstrap.Modal(document.getElementById('orderDetailsModal')).show();
            })
            .catch(error => console.error('Error:', error));
    }

    // Function to popoulate view detail modal ----------------------------------------


    function populateOrderDetailsModal(orderDetails) {
        const container = document.getElementById('orderDetailsContainer');
        container.innerHTML = '';
        if (orderDetails.length > 0) {
            orderDetails.forEach(order => {
                const productDetails = order.products.map(product => {
                    return `${product.product_name} (x${product.quantity})`;
                }).join(", ");

                const detailElement = document.createElement('div');
                detailElement.innerHTML = // when clicking the contact user via email button it opens the default mail provider and automatically inserts the users email
                    `
                <p><strong>Username:</strong> ${order.username} <button onclick="window.location.href='mailto:${order.user_email}';" class="email-button">Contact ${order.username} via Email</button></p>
                <p><strong>Products and Quantities:</strong> ${productDetails}</p>
                <p><strong>Total:</strong> ${order.total}</p>
                <p><strong>Seat:</strong> ${order.seat}</p>
                <p><strong>Seat Row:</strong> ${order.seatrow}</p>
                <p><strong>Stadium:</strong> ${capitaliseWords(order.stadium.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}</p> 
                <p><strong>Notes:</strong> ${order.notes || 'None'}</p>
                `;
                container.appendChild(detailElement);
            });
        } else {
            container.textContent = 'No details available';
        }
    }


    // replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))} was given by AI to remove the _ between any
    // Stadiums that had it such as old_trafford to make it more user friendly


    // Function to remove to review -------------------------------------------------

    function deleteReview(reviewId) {
        if (confirm('Are you sure you want to delete this review?')) {
            fetch('http://localhost:8080/src/public/backend/deletereview.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'review_id=' + reviewId
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Review deleted successfully');
                        fetchReviews();
                    } else {
                        alert('Failed to delete review');
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }



    // FETCHES ORDERS FOR OVERVIEW TABLE -------------------------------------

    function fetchOrders() {
        fetch('http://localhost:8080/src/public/backend/getdata.php') // send request to backend which retrieves the order details
            .then(response => response.json())
            .then(data => {
                populateTable(data);
            })
            .catch(error => console.error('Error:', error));
    }

    // POPULATES OVERVIEW TABLE -------------------------------------------------

    function populateTable(orders) {
        orders.sort((a, b) => b.order_id - a.order_id);

        // Slices the array to get the most recent 10 orders instead of displaying all 
        const recentOrders = orders.slice(0, 10);

        const table = document.querySelector("table tbody");
        table.innerHTML = "";

        orders.forEach(order => {
            const row = table.insertRow() // inserts the order information
            row.insertCell(0).textContent = order.order_id;
            row.insertCell(1).textContent = order.total;
            row.insertCell(2).textContent = order.created_at;
            row.insertCell(3).textContent = order.username;
            row.insertCell(4).textContent = order.seat;
            row.insertCell(5).textContent = order.stadium;
            row.insertCell(6).textContent = order.seatrow;
        });


    }

    // Function to retrieve cookie value ------------------------------------------------------------

    function getCookie(name) {
        let cookie = {};
        document.cookie.split(';').forEach(function (el) {
            let [k, v] = el.split('=');
            cookie[k.trim()] = v;
        })
        return cookie[name];
    }

    // Welcome Message to get staffs name ------------------------------------------------------------


    function setWelcomeMessage() {
        const welcomeMessageElement = document.querySelector('.p-3.m-1 h4');
        const username = getCookie('username');
        if (username) {
            welcomeMessageElement.textContent = `Welcome Back, ${username}`;
        } else {
            welcomeMessageElement.textContent = 'Welcome Back, Staff';
        }
    }

    // GET MAIN DATA FOR MANAGE ORDER PAGE ------------------------------------------

    function ManageData() {
        fetch('http://localhost:8080/src/public/backend/maindata.php')
            .then(response => response.json())
            .then(orders => {
                console.log(orders);
                const tableBody = document.querySelector('#manageOrders .table tbody');
                tableBody.innerHTML = '';

                orders.forEach(order => {
                    const row = document.createElement('tr');

                    // Order ID
                    const orderIdCell = document.createElement('td');
                    orderIdCell.textContent = order.order_id;
                    row.appendChild(orderIdCell);

                    // Total of order
                    const totalCell = document.createElement('td');
                    totalCell.textContent = '£' + order.total;
                    row.appendChild(totalCell);

                    // Date of the order
                    const dateCell = document.createElement('td');
                    dateCell.textContent = new Date(order.created_at).toLocaleString();
                    row.appendChild(dateCell);

                    // Username
                    const usernameCell = document.createElement('td');
                    usernameCell.textContent = order.username;
                    row.appendChild(usernameCell);

                    // Products and quantity 
                    const productsCell = document.createElement('td');
                    productsCell.textContent = order.products.map(p => `${capitaliseWords(p.product_name)} (x${p.quantity})`).join(', ');
                    row.appendChild(productsCell);

                    // Stadium
                    const stadiumCell = document.createElement('td');
                    // AI was used to help me with the text content for this
                    stadiumCell.textContent = order.stadium.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    stadiumCell.setAttribute('data-stadium', order.stadium); // For filtering
                    row.appendChild(stadiumCell);

                    // Seat Row
                    const seatRowCell = document.createElement('td');
                    seatRowCell.textContent = order.seatrow;
                    row.appendChild(seatRowCell);

                    // Seat number
                    const seatCell = document.createElement('td');
                    seatCell.textContent = order.seat;
                    row.appendChild(seatCell);

                    const notesCell = document.createElement('td');
                    notesCell.textContent = order.notes || 'N/A';
                    notesCell.classList.add('order-notes'); // For the css in case the note is too long to fit the table
                    notesCell.setAttribute('data-bs-toggle', 'tooltip'); // bootstrap tooltip feature to see text when hovering over it (useful for when its too long to fit)
                    notesCell.setAttribute('data-bs-placement', 'top');
                    notesCell.setAttribute('title', order.notes);
                    row.appendChild(notesCell);
                    new bootstrap.Tooltip(notesCell);

                    // Schedule time
                    const scheduledTimeCell = document.createElement('td');
                    scheduledTimeCell.textContent = formatTime(order.scheduled_time);
                    row.appendChild(scheduledTimeCell);


                    // Actions button
                    const actionsCell = document.createElement('td');
                    const dropdownButton = document.createElement('button');
                    dropdownButton.className = 'btn btn-primary dropdown-toggle';
                    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
                    dropdownButton.textContent = 'Actions';
                    const dropdownMenu = document.createElement('div');
                    dropdownMenu.className = 'dropdown-menu';

                    // Complete Order 
                    const completeOption = document.createElement('button');
                    completeOption.className = 'dropdown-item complete-order-button';
                    completeOption.setAttribute('data-order-id', order.order_id);
                    completeOption.textContent = 'Complete Order';



                    // Cancel Order 
                    const cancelOption = document.createElement('button');
                    cancelOption.className = 'dropdown-item cancel-order-button';
                    cancelOption.setAttribute('data-order-id', order.order_id);
                    cancelOption.textContent = 'Cancel Order';
                    row.setAttribute('data-order-id', order.order_id);



                    // View details
                    const detailsOption = document.createElement('button');
                    detailsOption.className = 'dropdown-item view-details-button'; // Added class to identify the button
                    detailsOption.textContent = 'View Details';
                    detailsOption.setAttribute('data-order-id', order.order_id);

                    // Adds the options to the dropdown menu
                    dropdownMenu.appendChild(completeOption);
                    dropdownMenu.appendChild(cancelOption);
                    dropdownMenu.appendChild(detailsOption);

                    // Adds dropdown menu to the dropdown button
                    dropdownButton.appendChild(dropdownMenu);

                    // adds the dropdown button to the actions cell
                    actionsCell.appendChild(dropdownButton);

                    // adds actions button to the row
                    row.appendChild(actionsCell);

                    // adds row to the table body
                    document.querySelector('#manageOrders table tbody').appendChild(row);

                });
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });

    }


    // function to format the Schedule time section, prompted via AI ------------------------------------------------------------

    function formatTime(scheduledTime) {
        if (!scheduledTime || scheduledTime === 'NULL') {
            return 'ASAP'; // Inserted text of asap if no time is scheduled
        } else {
            const [hours, minutes] = scheduledTime.split(':');
            const isPM = parseInt(hours, 10) >= 12;
            const adjustedHours = ((parseInt(hours, 10) + 11) % 12 + 1);
            return `${adjustedHours}:${minutes} ${isPM ? 'PM' : 'AM'}`;
        }
    }

    // Mark order as complete and move to order history function ------------------------------------------------------------

    document.addEventListener('click', function (e) {
        if (e.target && e.target.className.includes('complete-order-button')) {
            const orderId = e.target.getAttribute('data-order-id');
            if (confirm('Are you sure you want to complete this order?')) {
                completeOrder(orderId, e.target);
            }
        }
    });

    function completeOrder(orderId, element) {
        fetch('http://localhost:8080/src/public/backend/completeorder.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'order_id=' + orderId
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    const row = element.closest('tr');
                    row.parentNode.removeChild(row);
                    showNotification('Order completed');
                    ManageData();
                    fetchOrderHistory();
                    fetchOrders();
                } else {
                    console.error('Failed to complete the order:', data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


    // Function to display items on the menu to edit/remove ------------------------------------------------------------

    function fetchMenuItems() {
        fetch('http://localhost:8080/src/public/backend/getproducts.php')
            .then(response => response.json())
            .then(data => {
                const menuItemsList = document.getElementById('menuItemsList');
                menuItemsList.innerHTML = '';
                data.products.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

                    // Product name and price
                    const name = document.createElement('span');
                    name.textContent = item.name + ' - £' + (item.price / 100).toFixed(2);
                    listItem.appendChild(name);

                    // Edit button
                    const editBtn = document.createElement('button');
                    editBtn.className = 'btn btn-secondary btn-sm ms-2';
                    editBtn.textContent = 'Edit';
                    editBtn.setAttribute('data-bs-toggle', 'modal');
                    editBtn.setAttribute('data-bs-target', '#editItemModal');
                    editBtn.onclick = function () {
                        loadItemDetails(item.id, item.name, item.price);
                    };
                    listItem.appendChild(editBtn);


                    // Delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'btn btn-danger btn-sm ms-2';
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.onclick = function () {
                        if (confirm('Are you sure you want to delete ' + item.name + '?')) {
                            deleteMenuItem(item.id);
                        }
                    };
                    const buttonGroup = document.createElement('div');

                    buttonGroup.appendChild(editBtn);
                    buttonGroup.appendChild(deleteBtn);
                    listItem.appendChild(buttonGroup);
                    menuItemsList.appendChild(listItem);

                });
            });
    }



    // Function to handle deleting an item ------------------------------------------------------------

    function deleteMenuItem(itemId) {
        fetch('http://localhost:8080/src/public/backend/removeItem.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'item_id=' + itemId
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Item removed successfully.');
                    fetchMenuItems();
                } else {
                    showNotification('Failed to remove item: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error removing item: ' + error);
            });
    }

    // Function to edit the item details ------------------------------------------------------------


    document.getElementById('editItemForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('editItemId').value;
        const name = document.getElementById('editItemName').value;
        const price = document.getElementById('editItemPrice').value;

        fetch('http://localhost:8080/src/public/backend/editItem.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `itemId=${id}&itemName=${encodeURIComponent(name)}&itemPrice=${price}`
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Item updated successfully');
                    fetchMenuItems();
                } else {
                    alert('Failed to update item: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error updating item: ' + error);
            });
    });




    // Function to fetch order history details (when order is marked as complete) ------------------------------------------------------------

    function fetchOrderHistory() {
        fetch('http://localhost:8080/src/public/backend/orderhistorydata.php')
            .then(response => response.json())
            .then(orderHistory => {
                document.querySelectorAll('#dropdownStadiumButton + .dropdown-menu .dropdown-item').forEach(item => {
                    item.addEventListener('click', function (event) {
                        event.preventDefault();
                        const stadiumFilter = this.getAttribute('data-stadium');
                        filterTableByStadium(stadiumFilter, '#orderhistory .table');
                    });
                });
                const totalEarningsElement1 = document.querySelector('#earningsSection h4');
                const totalEarningsElement2 = document.querySelector('#totalEarningsDisplay');
                let totalEarnings = 0;
                const tableBody = document.querySelector('#orderhistory .table tbody');
                tableBody.innerHTML = '';

                orderHistory.forEach(order => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-order-id', order.order_id);

                    row.addEventListener('click', function () {
                        this.classList.toggle('selected');
                    });

                    // order ID 
                    const orderIdCell = document.createElement('td');
                    orderIdCell.textContent = order.order_id;
                    row.appendChild(orderIdCell);

                    // Total
                    const totalCell = document.createElement('td');
                    totalCell.textContent = '£' + order.total;
                    row.appendChild(totalCell);

                    // Date 
                    const dateCell = document.createElement('td');
                    dateCell.textContent = new Date(order.created_at).toLocaleString();
                    row.appendChild(dateCell);

                    // Useername 
                    const usernameCell = document.createElement('td');
                    usernameCell.textContent = order.username;
                    row.appendChild(usernameCell);

                    // stadium
                    const stadiumCell = document.createElement('td');
                    stadiumCell.textContent = order.stadium.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');;
                    row.appendChild(stadiumCell);


                    // Products 
                    const productsCell = document.createElement('td');
                    productsCell.className = 'product-cell';
                    productsCell.textContent = order.products.map(p => `${capitaliseWords(p.product_name)} (x${p.quantity})`).join(', ');
                    row.appendChild(productsCell);

                    // Gather total earnings from the order history section which stores all complete orders and display on the total earnings card
                    totalEarnings += parseFloat(order.total);

                    tableBody.appendChild(row);
                });
                if (totalEarningsElement1) {
                    totalEarningsElement1.textContent = '£' + totalEarnings.toFixed(2); // Two different elements, one for the overview section and the other in order history
                }
                if (totalEarningsElement2) {
                    totalEarningsElement2.textContent = 'Total Earnings: £' + totalEarnings.toFixed(2);
                }
            })
            .catch(error => {
                console.error('Error fetching order history:', error);
            });
    }



    // Listener for the cancel order button ------------------------------------------------------------

    document.addEventListener('click', function (e) {
        if (e.target && e.target.className.includes('cancel-order-button')) {
            const orderId = e.target.getAttribute('data-order-id');
            if (confirm('Are you sure you want to cancel this order?')) {
                cancelOrder(orderId, e.target);
            }
        }
    });


    // Function to cancel order (remove it from the database) ------------------------------------------------------------


    function cancelOrder(orderId, element) {
        fetch('http://localhost:8080/src/public/backend/cancelorder.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'order_id=' + orderId
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const selector = `tr[data-order-id="${orderId}"]`;
                    const row = document.querySelector(selector);
                    if (row) {
                        row.remove();
                        showNotification('Order cancelled successfully.');
                    } else {
                        console.error('Row not found: ', selector);
                    }
                } else {
                    showNotification('Failed to cancel the order: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error cancelling order: ' + error);
            });
    }



    // Capitalise the words from db that may be lowecase for better UI/UX --------------------------------------


    function capitaliseWords(str) {
        return str.replace(/\b(\w)/g, s => s.toUpperCase());
    }



    // Filter by stadium function & listener ------------------------------------------------------------

    document.querySelectorAll('#dropdownStadiumButton + .dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const stadiumFilter = this.getAttribute('data-stadium');
            filterTableByStadium(stadiumFilter);
        });
    });

    function filterTableByStadium(stadium) {
        const table = document.querySelector('#manageOrders .table');
        const rows = table.getElementsByTagName('tr');

        for (let i = 1; i < rows.length; i++) {
            let currentStadium = rows[i].querySelector('td[data-stadium]');
            if (currentStadium) {
                if (stadium === 'all' || currentStadium.getAttribute('data-stadium') === stadium) {
                    rows[i].style.display = ''; // Show row
                } else {
                    rows[i].style.display = 'none'; // Hide row
                }
            }
        }
    }





});

// Function for staff log out ------------------------------------------------------------

function logout() {
    // Clears cookies by setting their expiration dates to the past
    function clearCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1969 00:00:01 GMT;';
    }

    clearCookie('token');
    clearCookie('username');
    clearCookie('isStaff');

    window.location.href = 'http://localhost:3000';
}

// Filter by order ID ------------------------------------------------------------

function filterById() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("orderIdFilter");
    filter = input.value.toUpperCase();
    table = document.querySelector("#manageOrders .table");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.textContent.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // Shows the row if it matches
            } else {
                tr[i].style.display = "none"; // Hides the row if it doesn't match
            }
        }
    }

}


// Function to show notification when completing order / cancelling ---------------------------------------------------------

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




// Load items on modal for editting ------------------------------------------------------------

function loadItemDetails(id, name, price) {
    document.getElementById('editItemId').value = id;
    document.getElementById('editItemName').value = name;
    document.getElementById('editItemPrice').value = price;
}

// Function to search order history via username in order to make navigating easier ---------------------------------------

function filterByUsername() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("usernameFilter");
    filter = input.value.toUpperCase();
    table = document.querySelector("#orderhistory .table");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        td = tr[i].cells[3];
        if (td) {
            if (td.textContent.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ''; // Shows the row if it matches
            } else {
                tr[i].style.display = 'none'; // Hides the row if it doesn't match
            }
        }
    }
}

// Same function as above but to work for the User Section --------------------------------------

function filterByUsernameUS() {
    var input = document.getElementById("usernameFilterUS");
    var filter = input.value.toUpperCase();
    var table = document.querySelector("#userDetailsSection .table");
    var tr = table.getElementsByTagName("tr");

    for (var i = 1; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.textContent.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ''; // Shows the row if it matches
            } else {
                tr[i].style.display = 'none'; // Hides the row if it doesn't match
            }
        }
    }
}


// Same filter function as for Manage Orders section but works for the order history table instead ------------------------

document.querySelectorAll('#orderHistoryStadiumDropdownButton + .dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        const stadiumFilter = this.getAttribute('data-stadium');
        filterTableByStadiumOH(stadiumFilter);
    });
});

function filterTableByStadiumOH(stadium) {
    const table = document.querySelector('#orderhistory .table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        let stadiumCell = rows[i].cells[4];
        if (stadiumCell) {
            let cellStadiumValue = stadiumCell.textContent.replace(/ /g, '_').toLowerCase();
            if (stadium === 'all' || cellStadiumValue === stadium) {
                rows[i].style.display = ''; // Show row
            } else {
                rows[i].style.display = 'none'; // Hide row
            }
        }
    }
}

// Function to delete selected order from Order history section -------------------------------------
function deleteSelectedOrders() {
    const selectedRows = document.querySelectorAll('#orderhistory .table tbody tr.selected');
    const orderIds = Array.from(selectedRows).map(row => row.getAttribute('data-order-id'));

    console.log('Order IDs to delete:', orderIds);

    if (orderIds.length === 0) {
        alert("No orders selected for deletion.");
        return;
    }

    fetch('http://localhost:8080/src/public/backend/deleteOrderHistory.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderIds })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                selectedRows.forEach(row => row.remove());
                alert('Orders successfully deleted.');
                fetchOrderHistory();


            } else {
                console.error('Error deleting orders:', data.error);
                alert('Failed to delete orders: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error deleting orders:', error);
        });
}

// Function to display discounts ----------------------------------

function fetchDiscounts() {
    fetch('http://localhost:8080/src/public/backend/listDiscounts.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const discountsList = document.getElementById('discountsList');
                discountsList.innerHTML = '';
                data.discounts.forEach(discount => {
                    const discountEntry = document.createElement('div');
                    discountEntry.className = 'discount-entry d-flex justify-content-between align-items-center mb-2 p-2 border rounded';
                    discountEntry.innerHTML = `
                        <div class="discount-details">
                            <span class="discount-code font-weight-bold">Code: ${discount.code}</span>
                            <span class="discount-percent"> - ${discount.discount_percent}% off</span>
                        </div>
                        <button class="btn btn-danger delete-btn" data-id="${discount.id}">Delete</button>
                    `;
                    discountsList.appendChild(discountEntry);
                });
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        deleteDiscount(this.getAttribute('data-id'));
                    });
                });
            } else {
                showNotification('Failed to load discounts: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error loading discounts:', error);
        });
}

// function to delete discount ----------------------------------

function deleteDiscount(discountId) {
    fetch('http://localhost:8080/src/public/backend/deleteDiscount.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'discount_id=' + encodeURIComponent(discountId)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Discount deleted successfully!');
                fetchDiscounts();
            }
        })
        .catch(error => {
            console.error('Error deleting discount:', error);
        });
}



// Collapses the sidebar when clicking the 3 lines on the top left (Via the github) ----------------------------------------
const sidebarToggle = document.querySelector("#sidebar-toggle");
sidebarToggle.addEventListener("click", function () {
    document.querySelector("#sidebar").classList.toggle("collapsed");
});

// Function to add item to the menu (to be displayed on the cart.html) ------------------------------------------------------------

const addItemForm = document.getElementById('addItemForm');

addItemForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(addItemForm);

    fetch('http://localhost:8080/src/public/backend/additem.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Item added successfully', data.message);
                addItemForm.reset();
                showNotification("Item successfully added to the menu")
            } else {
                console.log(data.error);
                showNotification('Error adding item:', data.error);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});
