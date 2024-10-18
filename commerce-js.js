
//added side bar for page responsiveness if the brower size is reduced
const bar = document.getElementById('bar');
const nav = document.getElementById('navbar1');
const close = document.getElementById('close');
let users=[{}];  // Declare the variable to avoid ReferenceError
let loggedInUserId;
const loginForm = document.getElementById('loginForm');
let attempts = 0;
const maxAttempts = 3;
let cart =[];
let loggedIn = false;
let uFirstname;


//--------------------------------------------------------------------------------------------------------------------------

function loginStatus() { //this is to output/display the user that is logged in firstname at the top of the page
    if (!loggedIn) {
        if (users) {
            uFirstname = localStorage.getItem("uFirstname");
            document.getElementById('login').innerHTML = `<p>${uFirstname}</P>`;
            
        } else {
            document.getElementById('login').innerHTML = 'USER';
        }
    } else {
       
        document.getElementById('login').innerHTML = 'USER';
    }
}




//--------------------------------------------------------------------------------------------------------------------------


// Feature for when the page is at a certain size the icon will show and have these function 
//additional features are on the css sheet
if(bar){
    bar.addEventListener('click', () => {
        nav.classList.add('active');

    })
}
if(close){
    close.addEventListener('click', () => {
        nav.classList.remove('active');

    })
}
//single product slide show



//--------------------------------------------------------------------------------------------------------------------------

//JS code that was used to test the change of image on the single product detail page 
//click the product image
//only set for the first item on the product list as a test 
var mainimg = document.getElementById("main");
var smallimg = document.getElementsByClassName("smallimg");

var smallimgarray = Array.prototype.slice.call(smallimg);//plass all images collected in an array

// smallimg[0].onclick = function() {
//     mainimg.src = smallimg[0].src;
// }
// smallimg[1].onclick = function() {
//     mainimg.src = smallimg[1].src;
// }
// smallimg[2].onclick = function(){
//     mainimg.src = smallimg[2].src;
// }
// smallimg[3].onclick = function() {
//     mainimg.src = smallimg[3].src;
// }


//listen  for click event on all images and change the main image
smallimgarray.forEach(function(thumbnail) {
    thumbnail.addEventListener('click', function() {
      // Change the main image to the clicked thumbnail's source
      mainimg.src = thumbnail.src;
  
      // Remove 'active' class from all thumbnails
      smallimgarray.forEach(img => img.classList.remove('active'));
  
      // Add 'active' class to the clicked thumbnail
      thumbnail.classList.add('active');
    });
  });

  //Add to cart function
// Select all product items




//----------------------------------------------------------------------------------------------------------------------------------------

function getProductDetails(productElement) {
    const productName = productElement.querySelector('#item').innerText;
    const brandName = productElement.querySelector('.des span').innerText;
    const pPrice = parseFloat(productElement.querySelector('#product-price').innerText);
    const pQuantity = parseInt(productElement.querySelector('.product-quantity').value);
    let pId;
    let cartlenght=0;

    if(cart){
        const storedCart = localStorage.getItem('cart');

        // Parse the stored cart, if it exists, or default to an empty array
        cart = storedCart ? JSON.parse(storedCart) : []; 

        // Check if the cart is empty
        if (cart.length === 0) {
            // If cart is empty, assign pId as '000001'
            pId = '00000' + 1; 
        } else {
            // If cart has items, calculate the new pId based on cart length
            const cartlength = cart.length; // Properly declare cartlength
            pId = '00000' + (cartlength + 1); // Assign pId based on current cart length
        }
    }else{
        //if the user array was not created then it will be intialized here to be used 
        cart = [];
    }

   
   if(pQuantity === 0){//validation to ensure no product with the quantity of  0 is added to the cart

    alert("Product Quantity is required");
   }else{

    if (!loggedIn) { // Check if the user is NOT logged in
        const customerId = localStorage.getItem("loggedInUserId");
        

        // Add product details to the cart array
        cart.push({
            customerId: customerId,
            productId: pId,
            productName: productName, // Consistent naming
            brandName: brandName,
            pPrice: pPrice,
            pQuantity: pQuantity
        });

        // Store the updated cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        alert('Item added to your cart!');
    } else {
        // Alert the user that they need to log in or create an account
        alert('You are not logged in, so no items were added to your cart.');
    }
   }
}

// Event listener for clicking on the "Add to Cart" button/icon
document.querySelectorAll('.pro').forEach((product) => {
    product.querySelector('.proditem').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default anchor action

        // Get the product details from the specific product clicked
        const details = getProductDetails(product);
    });
});

//--------------------------------------------------------------------------------------------------------------------------
  
//Display added items for the user only

function displayInvoice() {
  
    let itemtotal = 0;
    const taxrate = 0.15; // 15% tax rate
    const addedtaxrate = 1.15; // Total with tax multiplier
    const invoiceDate  = new Date();

    document.getElementById('date').innerHTML = `<p>${invoiceDate}</P>`;
    // Retrieve the cart from local storage
    cart = JSON.parse(localStorage.getItem('cart')) || []; // Ensure cart is defined
    
    // Select the output areas
    const calculationsDiv = document.getElementById('invoice-calculations'); // To show totals
    const invoiceOutput = document.getElementById('invoice-Output'); // Where cart items will be listed
    
    // Clear previous content
    invoiceOutput.innerHTML = '';
    calculationsDiv.innerHTML = '';
    
    // Check if the cart is empty
    if (cart.length === 0) {
        emptyCart.innerHTML = '<p>Your cart is empty!</p>'; 
        return;
    }
    
    // Loop through all items in the cart and display their details
    //using the word item as a container to host all elements as the cart array is being looped over
    cart.forEach(item => {
        const customerId =  item.customerId;
        loggedInUserId = localStorage.getItem('loggedInUserId');


        if(item.customerId === loggedInUserId){
            //validation check to ensure only those item that have matching  customer id are displayed

            const productName = item.productName; // Handle missing product name
            const quantity = parseInt(item.pQuantity, 10); // Handle missing/invalid quantity
            const price = parseFloat(item.pPrice); // Handle missing/invalid price
            const itemSubtotal = price * quantity;
            itemtotal += itemSubtotal;
    
        // Output product details
        invoiceOutput.innerHTML += `
                <p>Product: ${productName}</p>
                <p>Quantity: ${quantity}</p>
                <p>Price: $${price.toFixed(2)}</p>
                <p>Subtotal: $${itemSubtotal.toFixed(2)}</p>
                <hr>
            `;
        }
        
    });
    
    // Display the total, tax, and total with tax
    calculationsDiv.innerHTML = `
        <strong>Total:</strong> $${itemtotal.toFixed(2)}<br>
        <strong>Tax (15%):</strong> $${(itemtotal * taxrate).toFixed(2)}<br>
        <strong>Total with Tax:</strong> $${(itemtotal * addedtaxrate).toFixed(2)}
    `;
    
}


//--------------------------------------------------------------------------------------------------------------------------------------

/*New customer form*/ 
// script.js
// New Customer Registration
document.addEventListener("DOMContentLoaded", function() {
    const newCustomer = document.getElementById('newCustomer');
    let userID = 0;

    if (newCustomer) {
        newCustomer.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form submission
            registerNewCustomer(); // Call the registration function
        });
    }

    // Function to handle new customer registration
    function registerNewCustomer() {
        // Get input values
        var fname = document.getElementById('first-name').value.trim();
        var lname = document.getElementById('last-name').value.trim();
        var email = document.getElementById('email').value.trim();
        var password = document.getElementById('password').value.trim();
        var confirm = document.getElementById('confirm').value.trim();
        var street = document.getElementById('street').value.trim();
        var parish = document.getElementById('parish').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var country = document.getElementById('country').value.trim();

        // Get the array from local storage or create a new array if it doesn't exist 
        if(users){
            users = JSON.parse(localStorage.getItem('users'));
        }else{
            //if the user array was not created then it will be intialized here to be used 
            users = [];
        }
        userID = users.length;
        console.log(userID);

        // Check if password is not empty and matches the confirmation
        if (password === "") {
            alert('Password cannot be empty.');
            return; // Stop further execution
        }

        if (password !== confirm) {
            alert('Passwords do not match'); // Alert if passwords do not match
            return; // Stop further execution
        }

        // Check if the user already exists
        const existingUser = users.find(user => user.newUserEmail === email);
        console.log(existingUser);
        if (existingUser) {
            alert('Email already exists');
        } else {
            // Create a new user object and push it to the users array
            users.push({ 
                newUserID: ++userID,
                newUserFName: fname,
                newUserLName: lname,
                newUserEmail: email,
                newUserPassword: password,
                newUserstreet: street,
                newUserParish: parish,
                newUserPhone: phone,
                newUserCountry: country
            });
            console.log(users);
            localStorage.setItem('users', JSON.stringify(users)); // Save the user information
            alert('New user created');
            newCustomer.reset(); // Reset the form
            window.location.href = 'Loginpage.html'
        }
    }
});



//--------------------------------------------------------------------------------------------------------------------------
// Login Information

function login (event) {
    event.preventDefault();


    const username = document.getElementById('username').value;
    const password = document.getElementById('login-password').value;

            // Get the stored users from localStorage
    users = JSON.parse(localStorage.getItem('users')) || [];
    console.log(users);

            // Check if the user exists
    const user = users.find(user => user.newUserEmail === username && user.newUserPassword === password);

    if (user) {
        alert('Login successful');
        console.log(user);
        localStorage.setItem('loggedIn', true); // Set login state
        localStorage.setItem('loggedInUserId', user.newUserID); // Store logged-in userID
        localStorage.setItem('uFirstname', user.newUserFName);
        window.location.href = 'Products.html'; // Redirect to product page
    } else {
        attempts++;
        alert('Invalid username or password');
        if (attempts >= maxAttempts) {
            window.location.href = 'error.html'; // Redirect to error page after 3 attempts
            }
        }



}





//-----------------------------------------------DISPLAY---------------------------------------------------------------------------------

//this section controls the output of the shopping cart
//function name: DisplayCart

function displayCart(){
    //get the cart items from local storage
    cart = JSON.parse(localStorage.getItem('cart'));

    const tbody = document.getElementById("cart-items");
    tbody.innerHTML = "";  //clear the table body
    const emptyCart  = document.getElementById("empty-cart");

    emptyCart.innerHTML = '';

    loggedInUserId = localStorage.getItem('loggedInUserId');

    if(cart.length===0){
        emptyCart.innerHTML= `<Strong> Your Cart is Empty`;
    }else{
        cart.forEach(item=>{
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td><button class="object" onclick="removeItem(${item.productId})">Remove</button></td>
                <td>${item.productName}</td>
               <td>
                <input name="quant" type="number" value="${item.pQuantity}" min="1"
                       onchange="updateQuantity('${item.productId}', this.value)" />
                </td>
                <td>$${item.pPrice.toFixed(2)}</td>
                <td>$${(item.pQuantity * item.pPrice).toFixed(2)}</td>
            `;
        
            tbody.appendChild(tr);
            // Apply CSS directly with JavaScript
        });
    }

    //loop through the cart items and display them in the table

}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//this section controls the update of the quantity of items in the cart and update the cart
function updateQuantity(pId, newQuantity) {
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    const item = cart.find(item => item.productId === pId); // creating a reference to the cart array to be manipulated 
    if (item) {
        item.pQuantity = parseInt(newQuantity, 10);
        // Update the cart in local storage
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart(); // Update the UI
    }
}

function removeItem(pId) {
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Filter out the item to be removed
    let newcart = cart.filter(item => item.productId !== pId);

    // Update the cart in local storage
    localStorage.setItem('cart', JSON.stringify(newcart));
    displayCart(); // Update the UI
}