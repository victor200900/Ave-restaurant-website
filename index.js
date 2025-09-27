// ✅ Inject CSS styles directly from JS
const styles = `
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    transition: background 0.3s ease, color 0.3s ease;
  }

  body:not(.dark-mode) {
    background: #fdfdfd;
    color: #222;
  }

  body.dark-mode {
    background: #111;
    color: white;
  }

  h1 {
    text-align: center;
    color: #ffcc00;
    margin-bottom: 20px;
  }

  #menuGrid {
    display: flex;
    gap: 18px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 10px 0;
  }

  .menu-card {
    flex: 0 0 auto;
    width: 210px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    border: 1px solid #f1f1f1;
    display: flex;
    flex-direction: column;
    min-height: 340px;
    transition: box-shadow 0.2s, transform 0.2s;
    cursor: pointer;
  }

  body.dark-mode .menu-card {
    background: #2a2a2a;
    color: #f0f0f0;
  }

  .menu-card:hover {
    box-shadow: 0 8px 24px rgba(255, 204, 0, 0.18);
    transform: translateY(-4px) scale(1.02);
    border-color: #ffcc00;
  }

  .menu-img {
    width: 100%;
    height: 170px;
    object-fit: cover;
    background: #f5f5f5;
    border-bottom: 1px solid #eee;
  }

  .menu-info {
    padding: 14px 12px;
    text-align: left;
  }

  .menu-info h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px;
  }

  .price {
    color: #ff5722;
    font-weight: bold;
    font-size: 16px;
  }

  .order-btn {
    display: block;
    width: 100%;
    background: linear-gradient(90deg, #ffcc00 0%, #ff5722 100%);
    color: #232526;
    border: none;
    padding: 10px 0;
    border-radius: 7px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 8px;
  }

  body.dark-mode .order-btn {
    background: linear-gradient(90deg, #444 0%, #222 100%);
    color: #fff;
  }

  .carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: #000;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
  }

  .carousel-btn.prev { left: 10px; }
  .carousel-btn.next { right: 10px; }

  .cart-sidebar {
    position: fixed;
    top: 0;
    right: -400px;
    width: 370px;
    height: 100vh;
    background: #fff;
    color: #111;
    box-shadow: -8px 0 32px rgba(0,0,0,0.7);
    padding: 24px;
    transition: right 0.4s ease;
    overflow-y: auto;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
  }

  body.dark-mode .cart-sidebar {
    background: linear-gradient(135deg, #232526 0%, #414345 100%);
    color: #fff;
  }

  .cart-sidebar.active { right: 0; }

  .cart-item {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 10px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  body.dark-mode .cart-item {
    background: #2a2a2a;
  }

  .qty-btn, .remove-btn {
    background: #eee;
    color: #111;
    border: none;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
  }

  body.dark-mode .qty-btn, body.dark-mode .remove-btn {
    background: #444;
    color: #fff;
  }

  .checkout-btn {
    background: linear-gradient(90deg,#ffcc00,#ff5722);
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
  }
`;
document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);


// ✅ Elements
let menuGrid = document.getElementById("menuGrid");
let prevBtn = document.querySelector(".carousel-btn.prev");
let nextBtn = document.querySelector(".carousel-btn.next");
let cartBody = document.getElementById("cartBody");
let cartTotal = document.getElementById("cart-total");
let cartCount = document.getElementById("cart-count");

// ✅ Load Category
function loadCategory(category) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then(res => res.json())
    .then(data => {
      menuGrid.innerHTML = data.meals.map(meal => `
        <div class="menu-card">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="menu-img"/>
          <div class="menu-info">
            <h3>${meal.strMeal}</h3>
            <span class="price">$${(Math.random()*20+5).toFixed(2)}</span>
            <button class="order-btn" onclick='viewMeal(${meal.idMeal})'>Order Now</button>
          </div>
        </div>
      `).join("");
    })
    .catch(() => { menuGrid.innerHTML = `<p></p>`; });
}
loadCategory("Seafood");

// ✅ Carousel buttons
nextBtn.addEventListener("click", () => menuGrid.scrollBy({ left: 240, behavior: "smooth" }));
prevBtn.addEventListener("click", () => menuGrid.scrollBy({ left: -240, behavior: "smooth" }));

// ✅ Cart Logic
let cartItems = [];

function viewMeal(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data => {
      let meal = data.meals[0];
      addToCart(meal);
    });
}

function addToCart(item) {
  let existing = cartItems.find(i => i.idMeal === item.idMeal);
  if (existing) {
    existing.quantity++;
  } else {
    item.price = Math.floor(Math.random() * 15) + 5;
    item.quantity = 1;
    cartItems.push(item);
  }
  updateCartSidebar();
  document.getElementById("cartSidebar").classList.add("active");
}

function updateCartSidebar() {
  cartBody.innerHTML = "";
  let total = 0;
  cartItems.forEach((item, index) => {
    total += item.price * item.quantity;
    let div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div style="display:flex;align-items:center;">
        <img src="${item.strMealThumb}">
        <div>
          <span>${item.strMeal}</span><br>
          <small>$${item.price}</small>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;">
        <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
        <button class="remove-btn" data-index="${index}">✖</button>
      </div>
    `;
    cartBody.appendChild(div);
  });
  cartTotal.textContent = `$${total.toFixed(2)}`;
  cartCount.textContent = cartItems.length;

  // Qty buttons
  cartBody.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      let index = e.target.dataset.index;
      let action = e.target.dataset.action;
      if (action === "increase") cartItems[index].quantity++;
      if (action === "decrease" && cartItems[index].quantity > 1) cartItems[index].quantity--;
      updateCartSidebar();
    });
  });

  // Remove buttons
  cartBody.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      let index = e.target.dataset.index;
      cartItems.splice(index, 1);
      updateCartSidebar();
    });
  });
}

function toggleCart() {
  document.getElementById("cartSidebar").classList.toggle("active");
}

// ✅ Search
function searchMeal() {
  let query = document.getElementById("searchInput").value.trim();
  if (!query) return;
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.meals) {
        menuGrid.innerHTML = data.meals.map(meal => `
          <div class="menu-card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="menu-img"/>
            <div class="menu-info">
              <h3>${meal.strMeal}</h3>
              <span class="price">$${(Math.random()*20+5).toFixed(2)}</span>
              <button class="order-btn" onclick='viewMeal(${meal.idMeal})'>Order Now</button>
            </div>
          </div>
        `).join("");
      } else {
        menuGrid.innerHTML = `<p>Error</p>`;
      }
    });
}
document.getElementById("searchInput").addEventListener("keyup", e => { if (e.key === "Enter") searchMeal(); });



  const themeToggle = document.getElementById("themeToggle");

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "🌙 Dark Mode";
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });