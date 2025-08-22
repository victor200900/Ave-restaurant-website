const apiKey = "e8e356d8c1b24337866570c344a7a88f";
const menuDiv = document.getElementById("menu-api");
const cart = document.querySelector(".cart"); // using class instead of id

let orders = []; // store all orders

fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=6`)
  .then(res => res.json())
  .then(data => {
    data.results.forEach(item => {
      const div = document.createElement("div");
      div.className = "api-item";
      div.innerHTML = `
        <div class="menu-i">
          <div class="menu-card">
            <img src="${item.image}" alt="${item.title}" class="menu-img" />
            <div class="menu-info">
              <h3>${item.title}</h3>
              <p>Delicious and freshly made — try it today!</p>
              <button class="order-btn" onClick='showCart()'>Order Now</button>
            </div>
          </div>
        </div>
      `;
      menuDiv.appendChild(div);

      // Add click event for order button
      div.querySelector(".order-btn").addEventListener("click", () => {
        orders.push(item); // add item to cart array
        alert(`${item.title} added to cart`);
      });
    });
  })
  .catch(err => {
    menuDiv.innerHTML = "<p> Check your internet connection and try again.</p>";
    console.error(err);
  });

// Show cart items
function showCart() {
  if (!cart) return; // safety check
  
  if (orders.length === 0) {
    cart.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
  } else {
    cart.innerHTML = orders
      .map(order => `
        <div class="cart-item">
          <img src="${order.image}" alt="${order.title}" class="cart-img"/>
          <span class="cart-title">${order.title}</span>
          <span class="cart-price">$${order.price}</span>
          <button class="remove-btn" onclick="removeFromCart('${order.id}')">Remove</button>
        </div>
      `)
      .join("");
  }
}
function openWhatsApp() {
      let phone = "2347045939049";  
      let message = document.getElementById("message").value;  
      let encodedMessage = encodeURIComponent(message);
      let url = `https://wa.me/${phone}?text=${encodedMessage}`;
      window.open(url, "_blank");
    }