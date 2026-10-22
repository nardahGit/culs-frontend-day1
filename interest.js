// "I'm interested" button in the herb dialog. It opens a small pop-up
// window with a form (name, email, consent).
// The name and email are sent privately (POST) to Formspree, a free form
// service; they arrive in the group's inbox and are never shown on the site.
//
// This file only ADDS the form. If sending fails, the user gets a friendly
// message and the rest of the site works as before.

// Paste the group's Formspree form ID here (it looks like "xyzabcd").
const formspreeId = "YOUR_FORM_ID";

const interestKey = "little-herb-garden-interest";

// Which herbs this browser already signed up for: { basil: "Anna", ... }
function readSignups() {
  try {
    const saved = JSON.parse(localStorage.getItem(interestKey) || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch (error) {
    return {};
  }
}

function saveSignup(herbId, name) {
  try {
    const signups = readSignups();
    signups[herbId] = name;
    localStorage.setItem(interestKey, JSON.stringify(signups));
  } catch (error) {
    // Storage blocked: the signup was still sent, we just can't remember it.
  }
}

// Small helper to create an element with a class and text.
function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function thanks(name, herbName) {
  return make("p", "interest-thanks", `✓ Thanks, ${name}! You're on the list for ${herbName}.`);
}

// One labelled field with a place for its error message.
function field(id, labelText, type) {
  const wrapper = make("div", "interest-field");
  const label = make("label", "", labelText);
  label.htmlFor = id;
  const input = document.createElement("input");
  input.id = id;
  input.type = type;
  input.autocomplete = type === "email" ? "email" : "name";
  const error = make("p", "interest-error");
  error.id = `${id}-error`;
  input.setAttribute("aria-describedby", error.id);
  wrapper.append(label, input, error);
  return { wrapper, input, error };
}

function showError(input, error, message) {
  error.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

// The part inside the herb dialog: a button, or "thanks" if already signed up.
function buildInterestSection(herbId, herbName) {
  const section = make("section", "herb-dialog-section interest");
  section.append(make("h3", "", `Interested in ${herbName}?`));

  const signedUpAs = readSignups()[herbId];
  if (signedUpAs) {
    section.append(thanks(signedUpAs, herbName));
    return section;
  }

  const openButton = make("button", "favorite-button", "✉ I'm interested");
  openButton.type = "button";
  openButton.addEventListener("click", () => {
    openInterestPopup(herbId, herbName, (name) => {
      // After sending: replace the button with the thank-you line,
      // and give keyboard focus back to the herb dialog.
      openButton.replaceWith(thanks(name, herbName));
      document.querySelector("#herb-dialog-close")?.focus();
    });
  });
  section.append(openButton);
  return section;
}

// The pop-up window with the form. It uses the HTML <dialog> element:
// showModal() keeps keyboard focus inside it and Escape closes it.
function openInterestPopup(herbId, herbName, onSent) {
  const popupWindow = document.createElement("dialog");
  popupWindow.className = "interest-popup";
  popupWindow.setAttribute("aria-labelledby", "interest-title");

  const closeButton = make("button", "modal-close", "×");
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close the form");
  closeButton.addEventListener("click", () => popupWindow.close());

  const title = make("h2", "", `Interested in ${herbName}?`);
  title.id = "interest-title";

  popupWindow.append(
    closeButton,
    title,
    make("p", "", "Leave your name and email and we will tell you when it grows in the garden.")
  );

  // Escape closes only this pop-up, not the herb dialog behind it.
  popupWindow.addEventListener("keydown", (event) => {
    if (event.key === "Escape") event.stopPropagation();
  });
  // Clicking the dark area around the pop-up closes it.
  popupWindow.addEventListener("click", (event) => {
    if (event.target === popupWindow) popupWindow.close();
  });
  popupWindow.addEventListener("close", () => popupWindow.remove());

  const form = document.createElement("form");
  form.noValidate = true; // we check the fields ourselves, with friendly messages

  const name = field("interest-name", "Name", "text");
  const email = field("interest-email", "Email", "email");

  const consentWrapper = make("div", "interest-field interest-consent");
  const consent = document.createElement("input");
  consent.type = "checkbox";
  consent.id = "interest-consent";
  const consentLabel = make("label", "", "I agree that the group may email me about this herb.");
  consentLabel.htmlFor = consent.id;
  const consentError = make("p", "interest-error");
  consentError.id = "interest-consent-error";
  consent.setAttribute("aria-describedby", consentError.id);
  consentWrapper.append(consent, consentLabel, consentError);

  const button = make("button", "favorite-button", "Send");
  button.type = "submit";

  const status = make("p", "interest-status");
  status.setAttribute("role", "status");

  form.append(name.wrapper, email.wrapper, consentWrapper, button, status);
  popupWindow.append(form);
  document.body.append(popupWindow);
  popupWindow.showModal();
  name.input.focus();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";

    // 1. Check the input.
    const nameValue = name.input.value.trim();
    const emailValue = email.input.value.trim();
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    showError(name.input, name.error, nameValue ? "" : "Please enter your name.");
    showError(email.input, email.error, emailLooksValid ? "" : "Please enter a valid email, e.g. anna@example.com.");
    showError(consent, consentError, consent.checked ? "" : "Please tick the box so we may email you.");

    const firstProblem = [name.input, email.input, consent]
      .find((input) => input.getAttribute("aria-invalid") === "true");
    if (firstProblem) {
      firstProblem.focus();
      return;
    }

    // 2. Is the form connected to Formspree yet?
    if (!/^[A-Za-z0-9]+$/.test(formspreeId) || formspreeId === "YOUR_FORM_ID") {
      status.textContent = "This form is not connected yet. The group still has to add its Formspree form ID.";
      return;
    }

    // 3. Send it to the server.
    button.disabled = true;
    button.textContent = "Sending…";

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          herb: herbName,
          name: nameValue,
          email: emailValue,
          _subject: `New interest in ${herbName}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Formspree answered ${response.status}`);
      }

      saveSignup(herbId, nameValue);
      popupWindow.close();
      onSent(nameValue);
      // Confirmation as a pop-up notification (from community.js), if available.
      if (typeof popup === "function") {
        popup(`✓ Thanks, ${nameValue}! You're on the list for ${herbName}.`);
      }
    } catch (error) {
      console.error("Could not send the interest form.", error);
      status.textContent = "Sorry, your message could not be sent. Please try again later.";
      button.disabled = false;
      button.textContent = "Send";
      button.focus();
    }
  });
}

// app.js builds the herb dialog. Watch it, and add the form once for each
// new herb (each new dialog has a new favorite button).
const interestDialogArea = document.querySelector("#herb-dialog-content");

if (interestDialogArea) {
  new MutationObserver(() => {
    const button = interestDialogArea.querySelector("[data-favorite-id]");
    if (!button || button.dataset.interestShown) return;
    button.dataset.interestShown = "yes";

    const herbId = button.dataset.favoriteId;
    const herbName = interestDialogArea.querySelector("h2")?.textContent || herbId;
    interestDialogArea.append(buildInterestSection(herbId, herbName));
  }).observe(interestDialogArea, { childList: true });
}
