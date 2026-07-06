const ORDER_ID_KEY = "order_id";
const CART_ITEMS_KEY = "cart_items";
const CART_TOTAL_KEY = "cart_total";

function formatCurrency(amount) {
  const whole = Math.round(Number(amount) || 0);
  return "\u20A6" + whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateOrderId() {
  return `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
}

function renderOrderId() {
  const orderIdEl = document.getElementById("orderId");
  if (!orderIdEl) return;

  let orderId = localStorage.getItem(ORDER_ID_KEY);
  if (!orderId) {
    orderId = generateOrderId();
    localStorage.setItem(ORDER_ID_KEY, orderId);
  }

  if ("value" in orderIdEl) orderIdEl.value = orderId;
  else orderIdEl.textContent = orderId;
}

function renderOrderItems() {
  const listEl = document.getElementById("orderItemsList");
  const totalEl = document.getElementById("orderTotal");
  if (!listEl || !totalEl) return;

  const storedItems = localStorage.getItem(CART_ITEMS_KEY);
  const storedTotal = localStorage.getItem(CART_TOTAL_KEY);
  if (!storedItems) return;

  let items;
  try {
    items = JSON.parse(storedItems);
  } catch {
    return;
  }
  if (!Array.isArray(items) || items.length === 0) return;

  listEl.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "order_item";
    li.dataset.price = item.price ?? 0;

    const nameSpan = document.createElement("span");
    nameSpan.className = "order_item_name";
    nameSpan.textContent = item.name || "Item";

    if (item.qty) {
      const qtySpan = document.createElement("span");
      qtySpan.className = "order_item_qty";
      qtySpan.textContent = `\u00d7${item.qty}`;
      nameSpan.appendChild(qtySpan);
    }

    const priceSpan = document.createElement("span");
    priceSpan.className = "order_item_price";
    priceSpan.textContent = formatCurrency(item.price);

    li.append(nameSpan, priceSpan);
    listEl.appendChild(li);
  });

  const total = storedTotal
    ? Number(storedTotal)
    : items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  totalEl.textContent = formatCurrency(total);
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrderId();
  renderOrderItems();
});