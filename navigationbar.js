function initMenuButton() {
  const menuButton = document.querySelector(".button-menu");
  if (!menuButton) return;

  menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("is-open");
  });
}

initMenuButton();