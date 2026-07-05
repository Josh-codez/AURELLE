/*slider*/
const slider_track = document.querySelector(".orderSlider");
const slide_cards = slider_track.querySelectorAll(".food_card-slider");
const template_card = slide_cards[0];
let no_slides = slide_cards.length;

class Slider_cards {
  constructor(category, image, name, price, rate_val) {
    this.category = category;
    this.image = image;
    this.name = name;
    this.price = price;
    this.rate_val = rate_val;
  }
}

const card1 = new Slider_cards("STARTER", "assets/image/combo (1).jpg", "BreakFast Pack", "8,500", 4.8);
const card2 = new Slider_cards("STARTER", "assets/image/combo (3).jpg", "Lobster bisque", "9,500", 4.9);
const card3 = new Slider_cards("MAIN", "assets/image/combo (2).jpg", "Duck à l'orange", "58", 4.9);
const card4 = new Slider_cards("MAIN", "assets/img/filet.jpg", "Filet mignon", "86", 5.0);
const card5 = new Slider_cards("DESSERT", "assets/img/brulee.jpg", "Crème brûlée", "18", 4.8);
const card6 = new Slider_cards("DESSERT", "assets/img/souffle.jpg", "Soufflé au chocolat", "22", 4.9);

const all_cards = [card1, card2, card3, card4, card5, card6];

function renderRating(card_el, rating_value) {
  const rating_stars = card_el.querySelectorAll(".star");
  const filled_count = Math.round(rating_value);

  rating_stars.forEach((star, index) => {
    if (index < filled_count) {
      star.classList.add("filled");
    } else {
      star.classList.remove("filled");
    }
  });
}

function fill_card(card_el, data) {
  const img_el   = card_el.querySelector(".card_img img");
  const name_el  = card_el.querySelector(".card_txt p");
  const price_el = card_el.querySelector(".price p");

  if (img_el) {
    img_el.setAttribute("src", data.image);
    img_el.setAttribute("alt", data.name);
  }
  if (name_el)  name_el.textContent = data.name;
  if (price_el) price_el.textContent = `₦${data.price}.00`;

  renderRating(card_el, data.rate_val);
}

function add_slide_cards(data) {
  const new_card = template_card.cloneNode(true);
  new_card.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  fill_card(new_card, data);
  slider_track.appendChild(new_card);
  no_slides++;
  return new_card;
}

fill_card(template_card, all_cards[0]);

for (let i = 1; i < all_cards.length; i++) {
  add_slide_cards(all_cards[i]);
}

/*auto move*/
let isDragging = false;
let isHovering = false;
let startX = 0;
let scrollLeft = 0;
let autoScroll = null;
var animationId = null;

function getCardFootprint(card_el) {
  const style = getComputedStyle(card_el);
  const marginLeft = parseFloat(style.marginLeft) || 0;
  const marginRight = parseFloat(style.marginRight) || 0;
  return card_el.offsetWidth + marginLeft + marginRight;
}

function cycleFirstCardToBack() {
  const first_card = slider_track.querySelector(".food_card-slider");
  if (!first_card) return;

  const footprint = getCardFootprint(first_card);

  slider_track.appendChild(first_card);

  requestAnimationFrame(() => {
    slider_track.style.scrollBehavior = "auto";
    slider_track.scrollLeft -= footprint;
    requestAnimationFrame(() => {
      slider_track.style.scrollBehavior = "smooth";
    });
  });
}



function AutoScroll() {
  if (!isDragging && !isHovering) {
    const first_card = slider_track.querySelector(".food_card-slider");

    if (first_card) {
      const footprint = getCardFootprint(first_card);
      const maxScroll = slider_track.scrollWidth - slider_track.clientWidth;

      if (maxScroll > 0) {
        if (slider_track.scrollLeft >= Math.min(footprint, maxScroll)) {
          cycleFirstCardToBack();
        } else {
          slider_track.scrollLeft += 1;
        }
      }
    }
  }

  animationId = requestAnimationFrame(AutoScroll);
}

function startAutoScroll() {
  if (!animationId) {
    animationId = requestAnimationFrame(AutoScroll);
  }
}

function stopAutoScroll() {
  cancelAnimationFrame(animationId);
  animationId = null;
}

startAutoScroll();

slider_track.addEventListener("mouseenter", () => {
  isHovering = true;
});

slider_track.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.pageX - slider_track.offsetLeft;
  scrollLeft = slider_track.scrollLeft;
  stopAutoScroll();
});

slider_track.addEventListener("mouseleave", () => {
  isDragging = false;
  isHovering = false;
  startAutoScroll();
});

slider_track.addEventListener("mouseup", () => {
  isDragging = false;
  startAutoScroll();
});

slider_track.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - slider_track.offsetLeft;
  const walk = (x - startX) * 2;
  slider_track.scrollLeft = scrollLeft - walk;
});


/* static cards */
const menu_cont = document.querySelector(".menu_cont");
let stat_cards = menu_cont.querySelectorAll(".food_card");
const template_statCard = stat_cards[0];
let no_cards = stat_cards.length;

class Static_cards {
  constructor(category, image, name, price, rate_val) {
    this.category = category;
    this.image = image;
    this.name = name;
    this.price = price;
    this.rate_val = rate_val;
  }
}

const cardST1  = new Static_cards("MAIN", "assets/image/afang.jpg", "Afang and Fufu", "6,750", 4.6);
const cardST2  = new Static_cards("STARTER", "assets/image/chin chin.jpg", "Chin Chin", "1,600", 4.5);
const cardST3  = new Static_cards("MAIN", "assets/image/fish.jpg", "Grilled salmon", "16,200", 4.8);
const cardST4  = new Static_cards("MAIN", "assets/image/rice.jpg", "Jellof Rice", "5,200", 4.6);
const cardST5  = new Static_cards("MAIN", "assets/image/rotisery.jpg", "Rotisery Chicken", "17,400", 4.9);
const cardST6  = new Static_cards("DESSERT", "assets/image/pancakes.jpg", "Pancakes", "10,000", 4.7);
const cardST7  = new Static_cards("DESSERT", "assets/image/brownie.jpg", "French Brownie", "17", 4.5);
const cardST8  = new Static_cards("DRINKS", "assets/image/cocktail.jpg", "Garden mocktail", "12", 4.3);
const cardST9  = new Static_cards("DRINKS", "assets/image/matcha.jpg", "Matcha", "14", 4.4);
const cardST10 = new Static_cards("MAIN", "assets/image/rice2.jpg", "Carabian Rice", "15", 4.5);
const cardST11 = new Static_cards("MAIN", "assets/image/ribs.jpg", "Ribeye steak", "82", 4.9);
const cardST12 = new Static_cards("DESSERT", "assets/image/mousse.jpg", "Chocolate mousse", "18", 4.6);
const cardST13 = new Static_cards("DRINKS", "assets/image/espresso.jpg", "Double espresso", "9", 4.4);

const all_statCards = [
  cardST1, cardST2, cardST3, cardST4, cardST5,
  cardST6, cardST7, cardST8, cardST9, cardST10,
  cardST11, cardST12, cardST13
];

function add_static_cards(data) {
  const new_card = template_statCard.cloneNode(true);
  new_card.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  fill_card(new_card, data);
  menu_cont.appendChild(new_card);
  no_cards++;
  return new_card;
}

fill_card(template_statCard, all_statCards[0]);

for (let i = 1; i < all_statCards.length; i++) {
  add_static_cards(all_statCards[i]);
}

stat_cards = document.querySelectorAll(".food_card");


/*filter*/
const All = document.getElementById("all_btn");
const Appetizer = document.getElementById("appetizers_btn");
const Mains = document.getElementById("mains_btn");
const Dessert = document.getElementById("desserts_btn");
const Drinks = document.getElementById("drinks_btn");

let current_filter = "ALL";

function applyFilter(category) {
  current_filter = category;

  stat_cards.forEach((card_el, index) => {
    const data = all_statCards[index];
    if (!data) return;

    const matches = category === "ALL" || data.category === category;
    card_el.style.display = matches ? "" : "none";
  });

  if (slider_track) {
    slider_track.style.display = category === "ALL" ? "" : "none";
  }
}

All.addEventListener("click", () => applyFilter("ALL"));
Appetizer.addEventListener("click", () => applyFilter("STARTER"));
Mains.addEventListener("click", () => applyFilter("MAIN"));
Dessert.addEventListener("click", () => applyFilter("DESSERT"));
Drinks.addEventListener("click", () => applyFilter("DRINKS"));


/* Add to cart */
let in_cart = [];
let cart_total = 0;

function parsePrice(text) {
  return Number(String(text).replace(/[₦,]/g, ""));
}

function addTo_cart(card_el) {
  const name_el  = card_el.querySelector(".card_txt p");
  const price_el = card_el.querySelector(".price p");
  if (!name_el || !price_el) return;

  const name = name_el.textContent;
  const price = parsePrice(price_el.textContent);

  const existing = in_cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    in_cart.push({ name, price, qty: 1 });
  }

  cart_total = in_cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  renderCart();
}

document.querySelectorAll(".add_cart_btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card_el = e.currentTarget.closest(".food_card, .food_card-slider");
    if (card_el) addTo_cart(card_el);
  });
});


/* Cart popup */
const cart_btn = document.getElementById("cart_btn");
const cart_popup = document.getElementById("cart_popup");
const cart_items_list = document.getElementById("cart_items_list");
const cart_total_el = document.getElementById("cart_total");
const cart_count_el = document.getElementById("cart_count");

function removeFrom_cart(name) {
  const index = in_cart.findIndex(item => item.name === name);
  if (index === -1) return;

  if (in_cart[index].qty > 1) {
    in_cart[index].qty -= 1;
  } else {
    in_cart.splice(index, 1);
  }

  cart_total = in_cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  renderCart();
}

function renderCart() {
  if (!cart_items_list) return;

  cart_items_list.innerHTML = "";

  if (in_cart.length === 0) {
    cart_items_list.innerHTML = `<li class="cart_empty">Your cart is empty</li>`;
  } else {
    in_cart.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart_item";
      li.innerHTML = `
        <span class="cart_item_name">${item.name}</span>
        <span class="cart_item_qty">x${item.qty}</span>
        <span class="cart_item_price">₦${(item.price * item.qty).toFixed(2)}</span>
        <button class="cart_remove_btn" data-name="${item.name}" aria-label="Remove ${item.name}">&#x2715;</button>
      `;
      cart_items_list.appendChild(li);
    });

    cart_items_list.querySelectorAll(".cart_remove_btn").forEach((btn) => {
      btn.addEventListener("click", () => removeFrom_cart(btn.dataset.name));
    });
  }

  if (cart_total_el) cart_total_el.textContent = `₦${cart_total.toFixed(2)}`;
  if (cart_count_el) cart_count_el.textContent = in_cart.reduce((sum, i) => sum + i.qty, 0);
}

if (cart_btn && cart_popup) {
  cart_btn.addEventListener("click", (e) => {
    e.stopPropagation();
    cart_popup.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!cart_popup.contains(e.target) && !cart_btn.contains(e.target)) {
      cart_popup.classList.remove("open");
    }
  });
}

renderCart();


/* Search */
const Search_in = document.getElementById("search");

function search(input) {
  const query = input.trim().toLowerCase();

  stat_cards.forEach((card_el, index) => {
    const data = all_statCards[index];
    if (!data) return;

    const matches = data.name.toLowerCase().includes(query);
    card_el.style.display = matches ? "" : "none";
  });
}

if (Search_in) {
  Search_in.addEventListener("input", (e) => search(e.target.value));
}