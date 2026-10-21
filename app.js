
// Loads the herbs from data/herbs.json and shows each one as a card.

const list = document.querySelector("#herbs-list");
const count = document.querySelector(".count");
const favoritesList = document.querySelector("#favorites-list");
const favoritesEmpty = document.querySelector("#favorites-empty");
const favoritesStatus = document.querySelector("#favorites-status");
const favoritesKey = "little-herb-garden-favorites";
const herbThemes = {
  basil: "basil",
  spearmint: "spearmint",
  rosemary: "rosemary",
  thyme: "thyme",
  lavender: "lavender",
  sage: "sage",
  chamomile: "chamomile",
  chives: "chives",
};
const dialogBackdrop = document.querySelector("#herb-dialog-backdrop");
const dialog = document.querySelector("#herb-dialog");
const dialogContent = document.querySelector("#herb-dialog-content");
const dialogClose = document.querySelector("#herb-dialog-close");
let herbsById = new Map();
let favorites = readFavorites();
let dialogOpener = null;

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
    return Array.isArray(saved) ? saved.filter((id) => typeof id === "string") : [];
  } catch (error) {
    console.error("Could not read saved favorites.", error);
    return [];
  }
}

async function loadHerbs() {
  const response = await fetch("data/herbs.json");

  if (!response.ok) {
    throw new Error(
      `Could not load ${response.url}: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

function card(herb) {
  const item = element("li", "", "");

  const link = element("a", "card", "");
  link.href = `#${herb.id}`;
  // The link changes the address to #<id>; the router below opens the dialog.
  link.addEventListener("click", () => {
    dialogOpener = link;
  });

  link.append(
    element("h3", "name", herb.name),
    element("p", "latin", herb.latin),
    element("p", "use", herb.use),
    element("p", "life", herb.life)
  );

  item.append(link);
  return item;
}

function updateFavoriteButton(button, id) {
  const isFavorite = favorites.includes(id);
  button.textContent = isFavorite ? "♥ Favorited" : "♡ Add to favorites";
  button.setAttribute("aria-pressed", String(isFavorite));
  button.setAttribute(
    "aria-label",
    `${isFavorite ? "Remove" : "Add"} ${herbsById.get(id)?.name || id} ${isFavorite ? "from" : "to"} favorites`
  );
}

function renderFavorites() {
  if (!favoritesList || !favoritesEmpty) return;
  const favoriteHerbs = favorites
    .map((id) => herbsById.get(id))
    .filter(Boolean);

  favoritesList.replaceChildren(...favoriteHerbs.map(card));
  favoritesEmpty.hidden = favoriteHerbs.length > 0;
}

function toggleFavorite(id) {
  favorites = favorites.includes(id)
    ? favorites.filter((favoriteId) => favoriteId !== id)
    : [...favorites, id];

  try {
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    if (favoritesStatus) favoritesStatus.textContent = "";
  } catch (error) {
    console.error("Could not save favorites in this browser.", error);
    if (favoritesStatus) favoritesStatus.textContent = "Favorites could not be saved in this browser.";
  }

  renderFavorites();

  const dialogFavoriteButton = dialogContent?.querySelector("[data-favorite-id]");
  if (dialogFavoriteButton?.dataset.favoriteId === id) {
    updateFavoriteButton(dialogFavoriteButton, id);
  }
}

function renderHerbDetails(herb) {
  dialog.dataset.herbTheme = herbThemes[herb.id] || "default";
  dialogContent.replaceChildren();

  const heading = element("h2", "", herb.name);
  heading.id = "herb-dialog-title";
  const latin = element("p", "latin", herb.latin);
  const intro = element("p", "herb-dialog-description", herb.description);
  const favoriteButton = element("button", "favorite-button herb-favorite-toggle", "");
  favoriteButton.type = "button";
  favoriteButton.dataset.favoriteId = herb.id;
  favoriteButton.addEventListener("click", () => toggleFavorite(herb.id));
  updateFavoriteButton(favoriteButton, herb.id);
  dialogContent.append(heading, latin, intro, favoriteButton);


  if (herb.image) {
    const image = document.createElement("img");
    image.className = "herb-dialog-image";
    image.src = herb.image.src;
    image.alt = herb.image.alt;
    image.width = 800;
    image.height = 533;
    dialogContent.append(image);
  }

  if (herb.video) {
    const figure = element("figure", "herb-dialog-video", "");
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "none";
    video.src = herb.video.src;
    if (herb.image) video.poster = herb.image.src;
    figure.append(video, element("figcaption", "", herb.video.caption));
    dialogContent.append(figure);
  }

  function addSection(title, items, className, renderItem) {
    if (!items?.length) return;
    const section = element("section", className, "");
    section.append(element("h3", "", title));
    section.append(renderItem(items));
    dialogContent.append(section);
  }

  addSection("Quick facts", herb.quickFacts, "herb-dialog-section", (facts) => {
    const list = document.createElement("dl");
    list.className = "facts";
    facts.forEach((fact) => {
      const item = document.createElement("div");
      item.append(element("dt", "", fact.label), element("dd", "", fact.value));
      list.append(item);
    });
    return list;
  });

  addSection(`What is ${herb.name.toLowerCase()} good for?`, herb.uses, "herb-dialog-section", (uses) => {
    const list = document.createElement("ul");
    list.className = "react-list";
    uses.forEach((use) => {
      const item = document.createElement("li");
      item.append(element("strong", "", `${use.title}:`), document.createTextNode(` ${use.text}`));
      list.append(item);
    });
    return list;
  });

  addSection("Growing tips", herb.growingTips, "herb-dialog-section", (tips) => {
    const list = document.createElement("ul");
    list.className = "tips";
    tips.forEach((tip) => {
      const item = document.createElement("li");
      item.append(element("strong", "", tip.title), document.createTextNode(tip.text));
      list.append(item);
    });
    return list;
  });

  addSection("Explore the plant", herb.parts, "herb-dialog-section", (parts) => {
    const list = document.createElement("ul");
    list.className = "react-list";
    parts.forEach((part) => {
      const item = document.createElement("li");
      item.append(element("strong", "", `${part.name}:`), document.createTextNode(` ${part.text}`));
      list.append(item);
    });
    return list;
  });
}

async function openHerbDialog(id, opener) {
  if (!dialogBackdrop || !dialog || !dialogContent) return;
  dialogOpener = opener;
  dialogBackdrop.hidden = false;
  dialog.setAttribute("aria-busy", "true");
  dialogContent.replaceChildren(element("p", "count", "Loading herb details…"));
  document.body.classList.add("modal-open");
  dialogClose?.focus();

  try {
    const response = await fetch(`data/${encodeURIComponent(id)}.json`);
    if (!response.ok) {
      throw new Error(`Could not load herb data: ${response.status} ${response.statusText}`);
    }

    const herb = await response.json();
    renderHerbDetails(herb);
  } catch (error) {
    console.error(`Could not load details for "${id}".`, error);
    dialogContent.replaceChildren(
      element("h2", "", "Herb details unavailable"),
      element("p", "react-message", "We couldn't load this herb's information. Please check that the web server is running and try again.")
    );
  } finally {
    dialog.setAttribute("aria-busy", "false");
  }
}

function closeHerbDialog() {
  if (!dialogBackdrop || dialogBackdrop.hidden) return;
  dialogBackdrop.hidden = true;
  document.body.classList.remove("modal-open");
  // Remove #<id> from the address, so the same herb can be opened again.
  history.replaceState(null, "", location.pathname + location.search);
  dialogOpener?.focus();
}

dialogClose?.addEventListener("click", closeHerbDialog);
dialogBackdrop?.addEventListener("click", (event) => {
  if (event.target === dialogBackdrop) closeHerbDialog();
});
dialog?.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const focusable = [...dialog.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeHerbDialog();
});

async function show() {
  // Run the herb list only on pages that contain it.
  if (!list || !count) {
    return;
  }

  try {
    const herbs = await loadHerbs();

    herbsById = new Map(herbs.map((herb) => [herb.id, herb]));
    list.replaceChildren(...herbs.map(card));
    count.textContent = `${herbs.length} herbs grow here.`;
    renderFavorites();
  } catch (error) {
    console.error(error);
    count.textContent = "The herbs could not be loaded. Please try again.";
  }
}

show();

// NEW: Lavender growing-tip interaction.
const tipButton = document.querySelector("#tip-button");
const lavenderTip = document.querySelector("#lavender-tip");

if (tipButton && lavenderTip) {
  tipButton.addEventListener("click", () => {
    const isHidden = lavenderTip.hidden;

    lavenderTip.hidden = !isHidden;

    tipButton.setAttribute("aria-expanded", String(isHidden));

    tipButton.innerHTML = isHidden
      ? 'Hide growing tip <span aria-hidden="true">↑</span>'
      : 'Reveal a growing tip <span aria-hidden="true">✿</span>';
  });
}

// Lavender plant explorer: show a story for the part that was chosen.
const parts = {
  flowers: ["Flowers", "The purple spikes open from June to August. They hold the scent and the oil, and bees visit them all day."],
  stem: ["Stems", "Thin, stiff and square-ish. Cut them just as the first buds open to get the best scent for drying."],
  leaves: ["Leaves", "Narrow, silver-green and slightly hairy. The hairs keep water in, which is why lavender survives dry summers."],
  roots: ["Roots", "Deep and woody. They need soil that drains well; wet feet are the quickest way to lose a lavender plant."],
  bee: ["Bee", "Lavender is a favourite of bees. One bush can feed hundreds of them in a summer afternoon."]
};

const info = document.querySelector("#lavender-info");

if (info) {
  document.querySelectorAll(".part").forEach((part) => {
    const choose = () => {
      const [title, text] = parts[part.dataset.part];
      document.querySelectorAll(".part.active").forEach((p) => p.classList.remove("active"));
      part.classList.add("active");
      info.replaceChildren(element("h3", "", title), element("p", "", text));
    };

    part.addEventListener("click", choose);
    part.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        choose();
      }
    });
  });
}


// Day 3: read which herb is in the address, e.g. index.html#basil → "basil"
function herbFromAddress() {
  return location.hash.slice(1).toLowerCase();
}

// The place on the page where a herb (or a message) is shown.
function herbView() {
  let view = document.querySelector("#herb-view");

  if (!view) {
    view = document.createElement("section");
    view.id = "herb-view";
    view.tabIndex = -1;                      // so keyboard focus can move here
    view.setAttribute("aria-live", "polite"); // screen readers announce changes
    document.querySelector("main").prepend(view);
  }

  return view;
}

// Hide the herb dialog without changing the address (used by the router).
function hideHerbDialog() {
  if (!dialogBackdrop || dialogBackdrop.hidden) return;
  dialogBackdrop.hidden = true;
  document.body.classList.remove("modal-open");
}

// Show a friendly message instead of a herb.
function showMessage(text) {
  hideHerbDialog();
  const view = herbView();
  view.replaceChildren(element("p", "message", text));
  view.focus();
}

// Load data/<id>.json and cope when something is missing.
async function loadHerb(id) {
  let herbs;

  try {
    herbs = await loadHerbs();
  } catch (error) {
    showMessage("The garden could not be loaded. Please open the site through a web server (npx serve), not by double-clicking the file.");
    return;
  }

  // 1. Unknown herb: it is not in data/herbs.json
  if (!herbs.some((herb) => herb.id === id)) {
    showMessage(`We don't grow "${id}" in this garden (yet).`);
    return;
  }

  // Known herb: open its details. The dialog copes with a missing file.
  document.querySelector("#herb-view")?.remove();
  openHerbDialog(id, dialogOpener);
}

function onAddressChange() {
  const id = herbFromAddress();

  // These are normal sections of the start page, not herbs.
  if (["", "herbs", "favorites", "visit", "about"].includes(id)) {
    document.querySelector("#herb-view")?.remove();
    hideHerbDialog();
    return;
  }

  loadHerb(id);
}

window.addEventListener("hashchange", onAddressChange);
onAddressChange();