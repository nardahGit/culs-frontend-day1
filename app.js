
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
  const item = element("li", "card", "");

  item.append(
    element("h3", "name", herb.name),
    element("p", "latin", herb.latin),
    element("p", "use", herb.use),
    element("p", "life", herb.life)
  );

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
