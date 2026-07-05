const nav_bar = document.querySelector(".nav_bar");
const main_cont = document.querySelector(".main_cont");
const scroll_el = main_cont || window;

let last_scroll = 0;
let scroll_timer = null;
let is_tapping = false;

nav_bar.addEventListener("pointerdown", () => {
  is_tapping = true;
});

nav_bar.addEventListener("pointerup", () => {
  setTimeout(() => { is_tapping = false; }, 300);
});

function on_scroll() {
  if (is_tapping) return;

  const current_scroll = scroll_el === window
    ? window.scrollY
    : scroll_el.scrollTop;

  const delta = current_scroll - last_scroll;

  if (current_scroll <= 40) {
    nav_bar.classList.remove("nav--hidden");
  } else if (delta > 6) {
    nav_bar.classList.add("nav--hidden");
  } else if (delta < -6) {
    nav_bar.classList.remove("nav--hidden");
  }

  last_scroll = Math.max(0, current_scroll);

  clearTimeout(scroll_timer);
  scroll_timer = setTimeout(() => {
    nav_bar.classList.remove("nav--hidden");
  }, 1500);
}

scroll_el.addEventListener("scroll", on_scroll, { passive: true });