const apiKey = "e8e356d8c1b24337866570c344a7a88f";
const menuDiv = document.getElementById("menu-api");
const cart = document.getElementById("cart"); // using class instead of id

let orders = []; // store all orders
fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=6`)
  .then(res => res.json())
  .then(data => {
    const menuApi = document.getElementById("menu-api");
    menuApi.innerHTML = ""; // clear before adding new items

    data.results.forEach(item => {
      const div = document.createElement("div");
      div.className = "col-md-4"; // bootstrap grid column
      div.innerHTML = `
        <div class="card border-0 shadow-sm h-100" style="background-color: #27f00d92;">
          <img src="${item.image}" alt="${item.title}" class="card-img-top" />
          <div class="card-body text-center">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text small text-muted">
              Delicious and freshly made — try it today!
            </p>
            <button class="btn btn-dark mt-2" onClick='showCart()'>Order Now</button>
          </div>
        </div>
      `;
      menuApi.appendChild(div);
    });
  })
  .catch(error => console.error("Error fetching menu:", error));


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