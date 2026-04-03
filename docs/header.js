const hamburger = document.querySelector(".header-hamburger");
const mobileNav = document.getElementById("mobile-nav");
hamburger.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", String(open));
  mobileNav.setAttribute("aria-hidden", String(!open));
});
