console.log("step1");
const menuBtn = document.querySelector(".menu__hamburger");
const navMenu = document.querySelector(".menu__list");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  navMenu.classList.toggle("active");
});

console.log("step2");
