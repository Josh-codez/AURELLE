function updateNavActiveState() {
  const navItems = document.querySelectorAll(".nav_bar .navli_cont li, .nav_top_links li");
  const path = window.location.pathname.split("/").pop().toLowerCase() || "index.html";
  const hash = window.location.hash.toLowerCase();

  navItems.forEach(item => {
    item.classList.remove("active");
    const link = item.querySelector("a");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    const [linkPath, linkHash] = href.split("#");
    const normalizedLinkPath = (linkPath || "index.html").toLowerCase();

    const isSamePage = normalizedLinkPath === path || (normalizedLinkPath === "index.html" && path === "");
    const isHashMatch = linkHash && `#${linkHash.toLowerCase()}` === hash;
    const isPageWithHashMatch = isSamePage && isHashMatch;

    if (isSamePage || isHashMatch || isPageWithHashMatch) {
      item.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavActiveState();
  window.addEventListener("hashchange", updateNavActiveState);
});
