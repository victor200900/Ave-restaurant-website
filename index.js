const apiKey = "e8e356d8c1b24337866570c344a7a88f";
const menuDiv = document.getElementById("menu-api");
const cart = document.getElementById("cart");

// Load saved orders or start empty
let orders = JSON.parse(localStorage.getItem("cart")) || [];

// ===== SAMPLE FALLBACK MENU =====
const sampleMenu = [
  { id: 1, title: "Spaghetti Bolognese", image: "https://static.fanpage.it/wp-content/uploads/sites/22/2021/06/spaghetti-bolognese.jpg", price: "12.99" },
  { id: 2, title: "Grilled Chicken", image: "https://www.simplyrecipes.com/thmb/7KwExJ0ZbVEmlxBaMsgmrBTi9M4=/4667x3111/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Grilled-BBQ-Chicken-LEAD-10-03fd9892eaae4ce1a8a3f4c949657cfd.jpg", price: "14.49" },
  { id: 3, title: "Veggie Pizza", image: "https://tse1.mm.bing.net/th/id/OIP.qLXRRRCAKwLc1-Vq4r5H5gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", price: "10.50" },
  { id: 4, title: "Beef Burger", image: "https://content.hy-vee.com/remote.axd/3f4c2184e060ce99111b-f8c0985c8cb63a71df5cb7fd729edcab.ssl.cf2.rackcdn.com/media/19208/besteverjuicyburger.jpg?v=1&mode=crop", price: "11.25" },
  { id: 5, title: "Caesar Salad", image: "https://www.thespruceeats.com/thmb/Z6IWF7c9zywuU9maSIimGLbHoI4=/3000x2000/filters:fill(auto,1)/classic-caesar-salad-recipe-996054-Hero_01-33c94cc8b8e841ee8f2a815816a0af95.jpg", price: "9.75" },
  { id: 6, title: "Sushi Roll", image: "https://static.vecteezy.com/system/resources/previews/005/532/493/non_2x/traditional-delicious-fresh-sushi-roll-set-on-a-white-background-free-photo.JPG", price: "15.00" },
];

// ===== FETCH MENU ITEMS =====
fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=6`)
  .then(res => {
    if (!res.ok) throw new Error("API request failed");
    return res.json();
  })
  .then(data => {
    if (!data.results || data.results.length === 0) {
      console.warn("API returned no results, using fallback menu.");
      renderMenu(sampleMenu);
    } else {
      // assign random prices for Spoonacular data
      const menuData = data.results.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        price: (Math.random() * (20 - 10) + 10).toFixed(2),
      }));
      renderMenu(menuData);
    }
  })
  .catch(error => {
    console.error("Error fetching menu:", error);
    renderMenu(sampleMenu); // fallback if API fails
  });

// ===== RENDER MENU =====
function renderMenu(menuItems) {
  menuDiv.innerHTML = ""; // clear before adding new items

  const row = document.createElement("div");
  row.className = "row g-4";

  menuItems.forEach(item => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card h-100 border-0 shadow-lg rounded-4 overflow-hidden food-card" 
        style="transition: transform 0.25s ease, box-shadow 0.25s ease; border-radius:1.2rem; overflow:hidden;">
        
        <div class="img-container" 
          style="width:100%; height:220px; overflow:hidden; border-bottom:4px solid #ffc107;">
          <img src="${item.image}" alt="${item.title}" 
            class="card-img-top img-fluid" 
            style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" />
        </div>
        
        <div class="card-body text-center p-4" 
          style="background:linear-gradient(135deg,#fff,#f9f9f9); border-top:1px solid #eee;">
          <h5 class="card-title fw-bold">${item.title}</h5>
          <p class="card-text text-muted small mb-3">
            Freshly prepared & made with love ✨
          </p>
          <p class="fw-bold mb-2 text-success">$${item.price}</p>
          <button class="btn btn-warning px-4 rounded-pill fw-semibold" 
            style="box-shadow:0 4px 12px rgba(255,193,7,0.4); transition:all 0.3s ease;"
            onmouseover="this.style.background='#ffb300'; this.style.transform='scale(1.05)'"
            onmouseout="this.style.background='#ffc107'; this.style.transform='scale(1)'"
            onClick="addToCart('${item.id}', '${item.title}', '${item.image}', '${item.price}')">
            Order Now
          </button>
        </div>
      </div>
    `;

    row.appendChild(col);
  });

  menuDiv.appendChild(row);

  // Add hover effects for cards & images dynamically
  document.querySelectorAll(".food-card").forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px)";
      card.style.boxShadow = "0 20px 35px rgba(0,0,0,0.15)";
      const img = card.querySelector("img");
      if (img) img.style.transform = "scale(1.08)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 8px 15px rgba(0,0,0,0.1)";
      const img = card.querySelector("img");
      if (img) img.style.transform = "scale(1)";
    });
  });
}

// ===== SAVE CART TO LOCALSTORAGE =====
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(orders));
}

// ===== ADD ITEM TO CART =====
function addToCart(id, title, image, price) {
  orders.push({ id, title, image, price });
  saveCart();
  showCart();
  updateCartCount();
}

// ===== REMOVE ITEM FROM CART =====
function removeFromCart(id) {
  orders = orders.filter(order => order.id != id);
  saveCart();
  showCart();
  updateCartCount();
}

// ===== SHOW CART ITEMS =====
function showCart() {
  if (!cart) return;

  if (orders.length === 0) {
    cart.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
  } else {
    cart.innerHTML = orders
      .map(order => `
        <div class="cart-item d-flex align-items-center gap-2 mb-2">
          <img src="${order.image}" alt="${order.title}" class="cart-img" 
            style="width:50px; height:50px; object-fit:cover; border-radius:8px;"/>
          <span class="cart-title flex-grow-1">${order.title}</span>
          <span class="cart-price fw-bold">$${order.price}</span>
          <button class="btn btn-sm btn-danger" onclick="removeFromCart('${order.id}')">✕</button>
        </div>
      `)
      .join("") +
      `<hr><p class="fw-bold">Total: $${orders.reduce((sum, o) => sum + parseFloat(o.price), 0).toFixed(2)}</p>`;
  }
}

// ===== UPDATE CART COUNT =====
function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  if (countSpan) {
    countSpan.textContent = orders.length;
  }
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  showCart();
  updateCartCount();
});
