const POSTS = [
  {
    slug: "mariadb-migrasjon",
    title: "Fra SQLite til <em>MariaDB</em>",
    date: "2025-11-02",
    tag: "kode",
    excerpt:
      "Notater fra å migrere Section-prosjektet til MariaDB med en dual-comment-strategi for eksamen.",
    body: `
            <p>Da eksamen nærmet seg, måtte Section-prosjektet kunne kjøre mot MariaDB i tillegg til SQLite. Løsningen ble en dual-comment-strategi: begge versjonene av spørringene ligger i koden side om side, kommentert ut etter behov.</p>
            <h2>Hva som faktisk endret seg</h2>
            <p>De fleste forskjellene var små, men avgjørende. Parameterplassholdere gikk fra <code>?</code> til <code>%s</code>, og konflikthåndtering ved innsetting gikk fra <code>ON CONFLICT</code> til <code>ON DUPLICATE KEY UPDATE</code>.</p>
            <h3>Filer som ble berørt</h3>
            <ul>
              <li><code>app.py</code> — ruter og spørringer</li>
              <li><code>auth.py</code> — innlogging og sesjonshåndtering</li>
              <li><code>models.py</code> — skjema og databasetilkobling</li>
            </ul>
            <p>Resultatet er en kodebase som kan veksle mellom de to databasene avhengig av miljø, uten å måtte skrive om logikken hver gang.</p>
          `,
  },
  {
    slug: "view-transitions",
    title: "Myke sideoverganger med <em>View Transitions API</em>",
    date: "2025-10-14",
    tag: "kode",
    excerpt:
      "Hvordan jeg fikk native cross-document animasjoner til å fungere på justaleks.no uten et rammeverk.",
    body: `<p>Dette er et eksempel-innlegg i demoen — i den ekte siten limer du inn din egen tekst her.</p>`,
  },
  {
    slug: "minecraft-server-tunneling",
    title: "Jakten på en gratis <em>tunnel</em>",
    date: "2025-09-01",
    tag: "prosjekt",
    excerpt:
      "ngrok traff båndbreddetaket. Her er hva jeg prøvde i stedet for mc.justaleks.no.",
    body: `<p>Dette er et eksempel-innlegg i demoen — i den ekte siten limer du inn din egen tekst her.</p>`,
  },
];

const listView = document.getElementById("listView");
const postView = document.getElementById("postView");
const list = document.getElementById("postList");
const postRoot = document.getElementById("postRoot");

function formDataLabel(post) {
  return new Date(post.date).toLocaleDateString("no-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderList(filter = "all") {
  list.innerHTML = "";
  const items =
    filter === "all" ? POSTS : POSTS.filter((p) => p.tag === filter);
  const sorted = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) {
    const empty = document.createElement("div");
    empty.className = "post-empty";
    empty.textContent = "Ingen innlegg i denne kategorien ennå.";
    list.appendChild(empty);
    return;
  }

  sorted.forEach((post) => {
    const row = document.createElement("div");
    row.className = "post-row";
    row.innerHTML = `
        <span class="post-date mono">${formDataLabel(post)}</span>
        <div class="post-main">
            <h2 class="post-title">${post.title}</h2>
            <p class="post-excerpt">${post.excerpt}</p>
        </div>
        <span class="post-tag">[ ${post.tag} ]</span>
    `;
    row.addEventListener("click", () => openPost(post.slug));
    list.appendChild(row);
  });
}

function openPost(slug) {
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return;
  postRoot.innerHTML = `
        <article>
            <header class="post-article-header">
                <div class="post-article-meta>
                    <span class="label">[ ${post.tag} ]</span>
                    <span class="post-date mono">${formDataLabel(post)}</span>
                </div>
                <h1 class="post-article-title">${post.title}</h1>
                <p class="post-article-excerpt">${post.excerpt}</p>
            </header>
            <div class="post-article-body">${post.body}</div>
        </article>
    `;
  listView.style.display = "none";
  postView.style.display = "block";
  window.scrollTo({ top: 0 });
}

document.getElementById("backToList").addEventListener("click", (e) => {
  e.preventDefault();
  postView.style.display = "none";
  listView.style.display = "block";
  window.scroll({ top: 0 });
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderList(btn.dataset.filter);
  });
});

renderList();
