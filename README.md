# The Little Herb Garden

A small website about eight garden herbs: what they look like, what they are
good for and how to grow them. Made by group **Herbs-Lavender** for
*Internet Technologies – Client Side* (CZU Prague, 2026).

**Live site:** https://nardahgit.github.io/culs-frontend-day1/

## Project goal

The goal is a small, real website that a beginner can read, run and change:
no framework is needed for the main page, only HTML, CSS and JavaScript.
A visitor should be able to

1. see all herbs at a glance,
2. find one quickly (search and filters),
3. learn about it (facts, uses, growing tips, photo, Wikipedia summary),
4. keep the ones they like (favorites), and
5. **check what they learned** in a short quiz about that herb.

The project also had to show the course topics: meaningful content, visual
design, interaction, application state, JSON data, network communication,
accessibility and a clean Git history.

## Existing problem and our solution

The project started from a starter page ("a little herb garden, broken on
purpose", commit `7bb5602`). We began with a page that showed no styles and no
herbs, and we turned it into a complete site.

| Existing problem | Our solution |
|---|---|
| The page showed no CSS and no herbs: wrong file paths (`css/style.css`, `herb.json`, `logo.svg`, `garden.png`), an unclosed `<a>` tag, ids in the HTML that did not match the ids in the JavaScript | Paths, ids and tags corrected; error messages when the herbs cannot be loaded (Day 1) |
| Only one herb (lavender) had a page of its own, as a separate HTML file | One page for all herbs: every card opens a details dialog and gets its own address (`index.html#basil`) |
| Herb texts were written into the HTML or the JavaScript, so adding a herb meant changing code | One JSON file per herb in one documented format; adding a herb means adding a file |
| A plain list of cards, nothing to do on it | Search while you type, All / Annual / Perennial filter, "Herb of the day", favorites, Wikipedia summary, and a quiz per herb |
| The look was not consistent and the menu did not fit on phones | One design with a colour theme per herb, responsive layout, a burger menu (☰) |
| A visitor could only read, not check what they learned | The "🌿 I'm interested" button opens a 5-question quiz made from the herb's own data, with a score and a message at the end |
| The code of different people lived in different folders and branches | Merged into one project; the history shows who did what |

## How it works (flow)

1. **Open the site.** `app.js` loads `data/herbs.json` with `fetch()` and draws one card per herb. If loading fails, a friendly message is shown instead.
2. **Find a herb.** Type in the search box or press All / Annual / Perennial (`extras.js`). The list changes while you type. "🎲 Herb of the day" opens the same herb for everyone on that day.
3. **Open a herb.** A click on a card changes the address to `#<id>`. The router in `app.js` listens to `hashchange`, loads `data/<id>.json` and opens the details dialog in the herb's own colours. The same address works when someone opens it directly or shares it. An unknown id (`#banana`) shows a friendly message.
4. **Learn.** The dialog shows quick facts, uses, growing tips, a photo and a short summary from Wikipedia. Lavender also has a plant explorer (click a part of the plant) and a video.
5. **Keep it.** "♡ Add to favorites" saves the herb in the browser (`localStorage`); the Favorites section shows them. `community.js` counts visits and likes shared between all visitors.
6. **Test yourself.** "🌿 I'm interested" opens a quiz (`interest.js`): 5 questions, one at a time, with instant feedback (right answer green, wrong answer red, one sentence of explanation). The end screen shows the score and percentage:
   - 5 of 5: 🏆 *Congratulations!*
   - 3 or 4 of 5: 🌿 *Well done!*
   - 0 to 2 of 5: 🌱 *Try again!*

   The best score is remembered per herb. **Try again** gives new questions in a new order.

## Features

| Course requirement | How this project meets it |
|---|---|
| Meaningful content | 8 herbs (basil, spearmint, rosemary, thyme, lavender, sage, chamomile, chives), each with a description, 5 quick facts, uses, growing tips and a photo; lavender also has plant parts and a video |
| Intentional visual design | one colour theme per herb (`theme` in its JSON file), responsive layout (CSS grid and flexbox), a burger menu (☰), visible keyboard focus |
| Interaction | a search box filters the herbs while you type; All / Annual / Perennial filter buttons; "🎲 Herb of the day"; herb cards open a details dialog; close with × or Escape; favorites button; **the herb quiz** |
| Application state | the search text, the chosen filter and the list of matching herbs; the open herb lives in the address (`index.html#basil`); favorites and best quiz scores are kept in JavaScript and saved in `localStorage`; the quiz keeps its current question and score while you play |
| Data | one JSON file per herb in `data/`, one shared format (see below); the quiz questions are built from the same files |
| Shared data | `community.js` counts visits and how many people liked each herb, stored on a free online counter service ([Abacus](https://abacus.jasoncameron.dev)) and read with `fetch()`; if the service is down, the counts are simply not shown; a pop-up notification welcomes each visitor and confirms each like |
| Network communication | `fetch()` loads `data/herbs.json` and `data/<id>.json` from our server, and asks Wikipedia's public API (`/api/rest_v1/page/summary/`) for a short summary of each herb; friendly messages when a herb is unknown, a file is missing, there is no server or Wikipedia cannot be reached |
| Accessibility | works with the keyboard alone (Tab, Enter, Escape); dialogs keep focus inside and give it back; answers and results are announced to screen readers (`role="status"`); images have alt text; animations are switched off for users who prefer reduced motion |
| Git history | every change is a commit with a message; see the commit list on GitHub |
| Documentation | this README and `group.md` (who did what) |

## Tech stack and why we used it

| Technology | What we used it for | Why |
|---|---|---|
| **HTML5** (semantic tags, `<dialog>`) | the only page `index.html`; dialogs for the herb and the quiz | screen readers understand semantic tags; `<dialog>` keeps keyboard focus inside and closes with Escape without extra code |
| **CSS3** (custom properties, grid, flexbox, media queries) | design, one colour theme per herb, responsive layout, burger menu, quiz animations | no framework needed; one set of variables (`--herb-accent`, `--herb-light`) re-colours a whole dialog; works on phones and desktops |
| **JavaScript** (plain, no framework) | rendering, search, filter, `#hash` router, favorites, quiz | the course teaches the browser itself; plain JS keeps the project small and readable for beginners |
| `fetch()` and **async/await** | loading JSON, Wikipedia, visit and like counters | the standard way to talk to a server; `try/catch` gives friendly error messages |
| **JSON** | one file per herb, one shared format | content is separated from code, so a herb can be added or corrected without touching JavaScript, and the quiz can read the same data |
| **localStorage** | favorites, best quiz scores | keeps the visitor's choices after a reload without a server or an account |
| **React 18 + Vite** | a second, component-based version of the herb browser in `react/` | to compare it with plain JavaScript; Vite builds it into a folder that works without any build step for the visitor |
| **Wikipedia API**, **Abacus counter** | herb summaries, shared visit and like counts | free public services, no account and no private server needed |
| **Git and GitHub**, **GitHub Pages** | teamwork, history, merging, hosting the live site | every member's work is visible in the history; Pages publishes the site for free |
| **VS Code + Live Server / `npx serve`** | local development | `fetch()` needs a web server; opening the file by double-click does not work |

## Run it locally

You need [Node.js](https://nodejs.org/) (LTS). In the project folder:

```sh
npx serve
```

Open the address it prints, usually <http://localhost:3000>. Stop it with `Ctrl+C`.
(In VS Code the *Live Server* extension works too.)

Do not open `index.html` by double-clicking it: `fetch()` needs a web server.

## Try it

- `index.html` – the start page with all herbs
- `index.html#basil` – opens basil (works for every herb id), then press **🌿 I'm interested** for the quiz
- `index.html#banana` – an unknown herb shows a friendly message
- `herb-profiles/react/` – the React version (opened by its address; it is not in the menu)

## Team

Group **Herbs-Lavender**. The "Main work" column comes from the commits of each
member (see `git log`) and from `group.md`.

| Participant | GitHub account | Role | Main work |
|---|---|---|---|
| **Fiderana Nardah Mamelphina** | `Fiderana Nardah Mamelphina`, `nardahGit` | **Group leader** | See the detailed list below the table |
| Magadeline Ndlovu | `selinah3005` | JSON data, JavaScript, integration | Last commits (22 Oct): **final fixes** (burger menu on small screens in the main site and in React, herb colour themes used in the dialog, lavender parts restored, accessibility fix, `group.md`); **removed the old unused React build files**; applied Monika's herb dialog design (coloured close button, smaller photo, tips in two columns). Before that: **JSON data** for all 8 herbs and its format in this README (14–15 Oct, `lavender.json` first); photos and the image and video file names; the **`#hash` router** (cards link to `#id`, the herb is read from the address) with friendly errors for an unknown herb, a missing file and no server; **herb search** and the **Wikipedia summary** (`app.js`); **shared likes and visits** (`community.js`); the first version of the **"I'm interested" pop-up** (`interest.js`); **herb of the day** and the **annual / perennial filter** (`extras.js`); unpacked Beqa's React version and connected it (dialog, favorites, lavender rendered from JSON); connected Beqa's burger menu (`menu.js`) |
| Beqa Davitashvili | `beqdavita` | Lavender page, dialog, React, burger menu | **React Version 2.0** (21 Oct, the project that became `react/`: search by common or Latin name, favorites, herb details with `useState` and `useEffect`); the **herb details dialog** and **favorites** (saved in `localStorage`); the **burger menu** (`menu.js`, branch *Burger-patch-V1.0*), shown on all screen sizes in the last version; the **lavender page** with the clickable plant explorer (Day 2, merged on 13 Oct) |
| Monika Tasheva | `Monika`, `monica` | CSS design and colours | Last commits (22 Oct): **colour theme for every herb** added to `data/<id>.json` (`theme.light`, `theme.dark`) and the lavender illustration `images/lavander.svg`; the **React herb profile CSS** written out on separate lines so it can be read and edited; **close-button design** of the herb pop-up, smaller image and the tips grid; earlier: the participant list and task table in `group.md` |

### Fiderana Nardah Mamelphina – group leader

As leader, Fiderana split the work between the four members, tracked who was
doing what in `group.md`, tested every member's commits (pulled them from the
forked repository and checked the workflow), merged the branches, and made the
final push to the main repository and GitHub Pages.

Her own commits and the work behind them:

| Date | Commit | Work |
|---|---|---|
| 12 Oct | `1998320` Fix bugs, add hero image description, optimize layout | Found and fixed the "broken on purpose" starter: the stylesheet path (`css/style.css` → `style.css`), the unclosed `<a>` tag, the garden image (`.png` → `.svg`) and the `dispaly: grid` typo in the CSS; matched the ids between HTML and JavaScript (`herbs-list`); added `try/catch` with an error message when the herbs cannot be loaded; put the hero image and its description in one container |
| 13 Oct | `cfaf145` Complete Day 1 project changes | Corrected the fetch path (`data/herb.json` → `data/herbs.json`), the logo file name and the nav link (`#visit`); added the missing call that starts the page; added `group.md` with the participants and the Day 1 notes |
| 13 Oct | `0b86032` Updated file from beqa | Merged Beqa's lavender page into the project: `levandule.html`, the clickable lavender plant explorer, the growing-tips list; made `app.js` run only on pages that contain the herb list and show a clear error when loading fails; formatted the code |
| 14 Oct | `1205201` Make herb cards links, restyle site, improve lavender page | Made the whole herb card a link; restyled the site (about 290 lines of `style.css`: header, navigation, layout, cards, footer, lavender page, keyboard focus); improved the lavender page |
| 22 Oct | final polish | Replaced the e-mail form of the "I'm interested" button with the **herb quiz** (`interest.js`, questions built from each herb's JSON file, instant feedback, score, congratulations / try again, best score saved); removed the menu item that led to the separate React layout, so the main page is the one entry point; rewrote this README |

## Project structure

```text
index.html       the only page; JavaScript renders everything else
style.css        the design (themes, layout, burger menu, dialogs, quiz)
app.js           rendering, search, #hash router, fetch, dialog, favorites, Wikipedia summary
community.js     shared visit and like counts (online counter service)
interest.js      "I'm interested" button and the herb quiz
extras.js        All / Annual / Perennial filter and "Herb of the day"
menu.js          burger menu (☰)
data/            herbs.json (the list) + one <id>.json per herb
images/          logo and herb photos
videos/          lavender video
react/           React source code (Vite)
herb-profiles/   the built React version (works without npm)
group.md         team members and who did what
```

## Herb details and favorites

On the home page, select any herb card (or open `index.html#<id>`, for example
`index.html#basil`) to see its details in a dialog. The dialog shows quick
facts, uses, growing tips, and plant parts when provided by the herb's JSON
file. Close it with the × button or the Escape key.

Every herb can be added to **My favorites**. Favorites are saved in the
browser (`localStorage`).

## Herb quiz

`interest.js` adds an "I'm interested" section to every herb dialog. The quiz
has no server and collects no personal data.

- The questions are **built from the herb's own JSON file**: life cycle, origin,
  bloom time, height and what the herb likes. The three wrong answers come
  from the other herbs, so the quiz changes when somebody edits the data.
- Each quiz has 5 questions in a random order; answers are shuffled.
- After each answer the right option turns green, a wrong pick turns red, and
  one sentence tells the correct fact.
- The result screen shows the score, the percentage and a message
  (*Congratulations!*, *Well done!* or *Try again!*).
- The best score per herb is saved in `localStorage` under
  `little-herb-garden-quiz`.

To make the quiz ask about a new fact, add it to `quickFacts` in the herb files
and add one `makeQuestion(...)` line in `buildQuestions()` in `interest.js`.

## React version

The `react/` folder contains a React version of the herb browser (search by
common or Latin name, favorites, herb details). It reads the same
`data/<id>.json` files. The main site (`index.html`) does not need it and does
not link to it.

The built version is in `herb-profiles/` and works with `npx serve` and on
GitHub Pages without any build step: open `herb-profiles/react/`.

To change the React code and rebuild it:

```sh
cd react
npm install
npm run dev     # develop: open /react/ at the address Vite prints
npm run build   # writes the finished site to ../herb-profiles
```

## Herb data format

Every herb has its own file in `data/`, named after its id: `data/<id>.json`
(for example `data/basil.json`). The page `index.html#basil` loads `data/basil.json`.

`data/herbs.json` is the list of all herbs for the start page. Each entry has an
`id` that matches the name of the herb's file.

Every herb file uses the same format:

| Key | Type | Required | Meaning |
|---|---|---|---|
| `id` | text | yes | lowercase name, same as the file name (`"basil"`) |
| `name` | text | yes | name shown on the page (`"Basil"`) |
| `latin` | text | yes | Latin name |
| `family` | text | yes | plant family |
| `life` | text | yes | `"annual"` or `"perennial"` |
| `description` | text | yes | one or two sentences about the herb |
| `quickFacts` | list of `{ "label", "value" }` | yes | always 5 facts: Life cycle, Origin, Blooms, Height, Likes (the quiz uses them) |
| `uses` | list of `{ "title", "text" }` | yes | what the herb is used for |
| `growingTips` | list of `{ "title", "text" }` | yes | how to grow it |
| `theme` | `{ "light", "dark" }` | no | the herb's colours (hex, e.g. `"#ddebd5"`): background and accent lines of its dialog and quiz |
| `image` | `{ "src", "alt" }` | no | a photo; only herbs with a photo have it |
| `parts` | list of `{ "id", "name", "text" }` | no | plant parts for the explorer drawing (lavender only) |
| `video` | `{ "src", "caption" }` | no | a short video (lavender only) |

Example (shortened):

```json
{
  "id": "basil",
  "name": "Basil",
  "latin": "Ocimum basilicum",
  "family": "Lamiaceae (mint family)",
  "life": "annual",
  "description": "A soft, bright-green herb with a sweet, peppery smell.",
  "quickFacts": [
    { "label": "Life cycle", "value": "Annual" }
  ],
  "uses": [
    { "title": "Kitchen", "text": "Pesto, tomato salads, pizza and pasta." }
  ],
  "growingTips": [
    { "title": "Sun", "text": "Plant it outside only after the last frost." }
  ]
}
```

To add a herb: create `data/<id>.json` in this format and add an entry with the
same `id` to `data/herbs.json`. It gets a card, its own address, a colour
theme and a quiz automatically.
