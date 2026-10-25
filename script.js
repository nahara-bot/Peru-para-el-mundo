document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const cards = [...document.querySelectorAll(".destination-card")];
  const searchInput = document.querySelector("#destination-search");
  const noResults = document.querySelector("#no-results");
  let activeFilter = "todos";

  function updateDestinations() {
    const term = (searchInput?.value || "").trim().toLocaleLowerCase("es");
    let visibleCount = 0;

    cards.forEach(card => {
      const categories = (card.dataset.category || "").split(/\s+/);
      const searchable = `${card.dataset.name || ""} ${card.textContent || ""}`.toLocaleLowerCase("es");
      const matchesFilter = activeFilter === "todos" || categories.includes(activeFilter);
      const matchesSearch = !term || searchable.includes(term);
      const visible = matchesFilter && matchesSearch;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });

    if (noResults) noResults.hidden = visibleCount !== 0;
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "todos";
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      updateDestinations();
    });
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });

  searchInput?.addEventListener("input", updateDestinations);

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Degradación elegante: si una foto externa falla, se mantiene un fondo neutro.
  document.querySelectorAll(".card-image img").forEach(img => {
    img.addEventListener("error", () => {
      img.style.display = "none";
      img.parentElement.style.background = "linear-gradient(135deg, #c8d1c2, #748c7c)";
      img.parentElement.setAttribute("aria-label", `Imagen no disponible: ${img.alt}`);
    }, { once: true });
  });
});
