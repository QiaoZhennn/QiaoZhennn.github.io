const root = document.documentElement;
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const toast = document.querySelector(".toast");

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

root.dataset.mode = "technical";

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    projectCards.forEach((card) => {
      card.classList.toggle("is-hidden", card.dataset.category !== filter);
    });

    showToast(`Showing ${button.textContent.trim()}.`);
  });
});

document.querySelectorAll(".project-details").forEach((details) => {
  details.addEventListener("toggle", () => {
    if (details.open) {
      details.animate(
        [
          { transform: "translateY(-4px)", opacity: 0.88 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        { duration: 180, easing: "ease-out" }
      );
    }
  });
});
