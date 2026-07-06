

/* Checkout */
const check_Btn = document.getElementById("check_Btn");

function parseCurrency(value) {
  return Number(String(value).replace(/[₦,]/g, "")) || 0;
}

function getCartItems() {
  const items = [];
  document.querySelectorAll("#cart_items_list .cart_item").forEach((itemEl) => {
    const name = itemEl.querySelector(".cart_item_name")?.textContent?.trim();
    const qtyText = itemEl.querySelector(".cart_item_qty")?.textContent?.trim() || "";
    const priceText = itemEl.querySelector(".cart_item_price")?.textContent?.trim() || "";

    if (!name) return;

    const qty = Number(qtyText.replace(/[^0-9]/g, "")) || 0;
    const price = parseCurrency(priceText);

    items.push({ name, qty, price });
  });
  return items;
}

function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

if (check_Btn) {
  check_Btn.addEventListener("click", () => {
    const cartItems = getCartItems();
    const cartTotal = getCartTotal(cartItems);

    if (cartItems.length === 0 || cartTotal === 0) {
      alert("Your cart is empty. Please add items to your cart before proceeding to checkout.");
      return;
    }

    localStorage.setItem("cart_items", JSON.stringify(cartItems));
    localStorage.setItem("cart_total", cartTotal.toFixed(2));
    window.location.href = "checkout.html";
  });
}

