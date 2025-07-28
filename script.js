const foodItems = [
  {
    name: "Jollof Rice",
    description: "Spicy rice with beef and fried plantain",
    price: 1500,
    image: "images/jollof_rice.jpg"
  },
  {
    name: "Egusi Soup & Pounded Yam",
    description: "Thick melon seed soup with assorted meat",
    price: 2000,
    image: "images/Egwusi_soup.jpg"
  },
  {
    name: "Amala & Ewedu Soup",
    description: "A blend of yam flour with smooth jute leaf soup",
    price: 1800,
    image: "images/Amala_ewedu_soup.jpeg"
  },
  {
    name: "Beans and Plantain Porridge",
    description: "A mixture of beans and ripe plantain porridge",
    price: 1700,
    image: "images/beans.jpg"
  }, 
    {
    name: "Roasted Yam & Fish",
    description: "A combination of roasted yam and grilled fish",
    price: 1700,
    image: "images/roasted_yam.webp"
  }
];

const refreshments = [
  {
    name: "Zobo",
    description: "Chilled hibiscus drink",
    price: 500,
    image: "images/zobo.jpg"
  },
  {
    name: "Puff-puff",
    description: "Sweet fried dough balls",
    price: 300,
    image: "images/puff_puff.jpg"
  },
  {
    name: "Chapman",
    description: "Classic Nigerian cocktail",
    price: 700,
    image: "images/chapman.jpg"
  },
  {
    name: "Bread",
    description: "Freshly baked bread",
    price: 600,
    image: "images/bread.jpeg"
  },
  {
    name: "Meat Pie",
    description: "Savory pastry filled with minced meat and vegetables",
    price: 1200,
    image: "images/meatpie.webp"
  },
  {
    name: "Coffee",
    description: "Rich brewed coffee with a hint of chocolate",
    price: 800,
    image: "images/coffee.jpeg"
  }
];

// Cart object to hold items uniquely
let cart = {};

const menu = document.getElementById('menu');
const refreshmentMenu = document.getElementById('refreshment-menu');
const cartItems = document.getElementById('cart-items');
const totalEl = document.getElementById('total');

// Load cart from localStorage on page load
window.onload = function () {
  loadCartFromLocalStorage();
};

// Display Food Items
foodItems.forEach((item, index) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${item.image}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <p>₦${item.price}</p>
    <input type="number" id="qty-food-${index}" value="1" min="1" style="width: 60px;" />
    <button onclick="addToCart(${index}, 'food')">Add to Plate</button>
  `;
  menu.appendChild(card);
});

// Display Refreshments
refreshments.forEach((item, index) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${item.image}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <p>₦${item.price}</p>
    <input type="number" id="qty-refreshment-${index}" value="1" min="1" style="width: 60px;" />
    <button onclick="addToCart(${index}, 'refreshment')">Add to Plate</button>
  `;
  refreshmentMenu.appendChild(card);
});

// Add to Cart
function addToCart(index, type) {
  const item = type === 'food' ? foodItems[index] : refreshments[index];
  const inputId = type === 'food' ? `qty-food-${index}` : `qty-refreshment-${index}`;
  const qtyInput = document.getElementById(inputId);
  const quantity = parseInt(qtyInput.value);

  if (cart[item.name]) {
    cart[item.name].quantity += quantity;
  } else {
    cart[item.name] = {
      name: item.name,
      price: item.price,
      quantity: quantity
    };
  }

  updateCart();
  saveCartToLocalStorage();
}

// Update Cart UI
function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;

  Object.values(cart).forEach(item => {
    const itemTotal = item.price * item.quantity;
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.quantity} - ₦${itemTotal}`;
    cartItems.appendChild(li);
    total += itemTotal;
  });

  totalEl.textContent = total;
}

// Save Cart to Local Storage
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Load Cart from Local Storage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// Submit Button Logic
document.getElementById('submit-btn').addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    alert("Please add at least one item to your plate!");
    return;
  }

  const loader = document.getElementById('loader');
  loader.style.display = 'block';

  setTimeout(() => {
    loader.style.display = 'none';
    alert("✅ Order Submitted Successfully!\nEstimated delivery: 20–30 minutes.");
    cart = {};
    updateCart();
    saveCartToLocalStorage();
  }, 2000);
});

// Print Button Logic
document.getElementById('print-btn').addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    alert("Nothing to print. Your plate is empty.");
    return;
  }

  let printContent = "🧾 Order Summary:\n\n";
  let total = 0;

  Object.values(cart).forEach(item => {
    const itemTotal = item.price * item.quantity;
    printContent += `${item.name} x${item.quantity} - ₦${itemTotal}\n`;
    total += itemTotal;
  });

  printContent += `\nTotal: ₦${total}\nEstimated delivery: 20–30 minutes`;

  const printWindow = window.open('', '', 'height=500,width=400');
  printWindow.document.write('<pre>' + printContent + '</pre>');
  printWindow.document.close();
  printWindow.print();
});
