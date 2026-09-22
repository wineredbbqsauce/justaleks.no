/* ══════════ SPILL DATA ══════════ */
/* Sett GAMES til [] eller null når ingen spill er lagt ut ennå — */
/* siden viser da "Kommer senere…" automatisk i stedet for gridet. */
const GAMES = [
  // {
  //   src: "../assets/spill/placeholders/spill_placeholder-notext.jpg",
  //   title: "Vraket",
  //   desc: "Naviger gjennom et sunket skipsvrak før luften tar slutt. Bygget som en helgs eksperiment med lyssetting og lyd.",
  //   category: "arkade",
  //   url: "#",
  // },
];
/* ══════════ RENDER SPILL ══════════ */
const grid = document.getElementById("gamesGrid");
const emptyState = document.getElementById("gamesEmpty");
const filterBar = document.getElementById("filterBar");
let currentFilter = "all";
let lightboxIndex = -1;
let filteredItems = [];

function renderGames(filter = "all") {
  // Ingen spill lagt ut ennå
  if (!GAMES || GAMES.length === 0) {
    grid.style.display = "none";
    filterBar.style.display = "none";
    emptyState.style.display = "flex";
    return;
  }

  grid.style.display = "grid";
  filterBar.style.display = "flex";
  emptyState.style.display = "none";

  grid.innerHTML = "";
  const items =
    filter === "all" ? GAMES : GAMES.filter((item) => item.category === filter);

  filteredItems = items;

  items.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "games-item";
    div.style.animationDelay = `${i * 60}ms`;
    div.dataset.category = item.category;
    div.onclick = () => openLightbox(i);

    div.innerHTML = `
                    <img src="${item.src}" alt="${item.title}" loading="lazy" onerror="this.style.background='linear-gradient(160deg,#201c17,#0f0f0f)'; this.removeAttribute('src')">
                    <div class="item-overlay">
                        <div class="item-info">
                            <p class="item-title">${item.title}</p>
                            <p class="item-meta">${item.category}</p>
                        </div>
                        <a class="item-play" href="${item.url}" onclick="event.stopPropagation()">Spill her →</a>
                    </div>
                `;

    grid.appendChild(div);
  });
}

/* ══════════ FILTER ══════════ */
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderGames(currentFilter);
  });
});

/* ══════════ LIGHTBOX ══════════ */
function fillLightbox(item) {
  document.getElementById("lightboxImg").src = item.src;
  document.getElementById("lightboxCategory").textContent =
    `[ ${item.category} ]`;
  document.getElementById("lightboxCaption").textContent = item.title;
  document.getElementById("lightboxDesc").textContent = item.desc;
  document.getElementById("lightboxPlay").href = item.url;
}

function openLightbox(index) {
  lightboxIndex = index;
  fillLightbox(filteredItems[index]);
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
  lightboxIndex = -1;
}

function navigateLightbox(direction) {
  if (lightboxIndex === -1) return;
  lightboxIndex += direction;

  if (lightboxIndex < 0) lightboxIndex = filteredItems.length - 1;
  if (lightboxIndex >= filteredItems.length) lightboxIndex = 0;

  const img = document.getElementById("lightboxImg");
  img.style.opacity = "0";
  setTimeout(() => {
    fillLightbox(filteredItems[lightboxIndex]);
    img.style.opacity = "1";
  }, 150);
}

// Lukk lightbox med Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") navigateLightbox(-1);
  if (e.key === "ArrowRight") navigateLightbox(1);
});

// Klikk utenfor panelet for å lukke
document.getElementById("lightbox").addEventListener("click", function (e) {
  if (e.target === this) closeLightbox();
});

/* ══════════ INIT ══════════ */
renderGames();
