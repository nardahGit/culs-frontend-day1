
// Loads the herbs from data/herbs.json and shows each one as a card.

const list = document.querySelector("#herbs-list");
const count = document.querySelector(".count");

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

  // The whole card is one link. Only lavender has a page for now.
  const link = element("a", "card", "");
  link.href = herb.name === "Lavender" ? "levandule.html" : "#";

  link.append(
    element("h3", "name", herb.name),
    element("p", "latin", herb.latin),
    element("p", "use", herb.use),
    element("p", "life", herb.life)
  );

  item.append(link);
  return item;
}

async function show() {
  // Run the herb list only on pages that contain it.
  if (!list || !count) {
    return;
  }

  try {
    const herbs = await loadHerbs();

    list.replaceChildren(...herbs.map(card));
    count.textContent = `${herbs.length} herbs grow here.`;
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
