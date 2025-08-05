const apiKey = "e8e356d8c1b24337866570c344a7a88f";
const menuDiv = document.getElementById("menu-api");

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
      <button class="order-btn">Order Now</button>
    </div>
    </div>
  </div>
`;
        div.style = `
          flex: 0 0 250px;
          scroll-snap-align: center;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: transform 0.3s;
        `;

      menuDiv.appendChild(div);
    });
  })
  .catch(err => {
    menuDiv.innerHTML = "<p> Check your internet connection and try again.</p>";
    console.error(err);
  });

   function scrollCarousel(direction) {
    const container = document.getElementById("menu-api");
    container.scrollBy({ left: direction * 300, behavior: "smooth" });
  }