# The Little Herb Garden

A small website about eight garden herbs: what they look like, what they are
good for and how to grow them. Made by group **Herbs-Lavender** for
*Internet Technologies – Client Side* (CZU Prague, 2026).

**Live site:** https://nardahgit.github.io/culs-frontend-day1/

## Features

| Course requirement | How this project meets it |
|---|---|
| Meaningful content | 8 herbs (basil, spearmint, rosemary, thyme, lavender, sage, chamomile, chives), each with a description, 5 quick facts, uses, growing tips and a photo; lavender also has plant parts and a video |
| Intentional visual design | one colour theme per herb, responsive layout (CSS grid and flexbox), visible keyboard focus |
| Interaction | a search box filters the herbs while you type; herb cards open a details dialog; close with × or Escape; favorites button |
| Application state | the search text and the list of matching herbs; the open herb lives in the address (`index.html#basil`); favorites are kept in a JavaScript array and saved in `localStorage` |
| Data | one JSON file per herb in `data/`, one shared format (see below) |
| Network communication | `fetch()` loads `data/herbs.json` and `data/<id>.json` from our server, and asks Wikipedia's public API (`/api/rest_v1/page/summary/`) for a short summary of each herb; friendly messages when a herb is unknown, a file is missing, there is no server or Wikipedia cannot be reached |
| Accessibility | works with the keyboard alone (Tab, Enter, Escape); the dialog keeps focus inside and returns it to the card; images have alt text |
| Git history | every change is a commit with a message; see the commit list on GitHub |
| Documentation | this README and `group.md` (who did what) |

## Run it locally

You need [Node.js](https://nodejs.org/) (LTS). In the project folder:

```sh
npx serve
```

Open the address it prints, usually <http://localhost:3000>. Stop it with `Ctrl+C`.

Do not open `index.html` by double-clicking it: `fetch()` needs a web server.

## Try it

- `index.html` – the start page with all herbs
- `index.html#basil` – opens basil (works for every herb id)
- `index.html#banana` – an unknown herb shows a friendly message
- **Herb profiles (React)** in the menu – the React version

## Project structure

```text
index.html       the only page; JavaScript renders everything else
style.css        the design
app.js           rendering, search, #hash router, fetch, dialog, favorites, Wikipedia summary
data/            herbs.json (the list) + one <id>.json per herb
images/          logo and herb photos
videos/          lavender video
react/           React source code (Vite)
herb-profiles/   the built React version (works without npm)
group.md         team members and who did what
```

## Team

| Member | Main work |
|---|---|
| Fiderana Nardah Mamelphina | group management, testing and merging, site restyle, GitHub Pages |
| Magadeline Ndlovu | JSON data for all herbs and its format, photos, #hash router with `fetch()` and error messages, integration of the dialog and React version |
| Beqa Davitashvili | lavender page (day 2), herb details dialog, favorites, React version |
| Monika Tasheva | CSS design |

## Herb details and favorites

On the home page, select any herb card (or open `index.html#<id>`, for example
`index.html#basil`) to see its details in a dialog. The dialog shows quick
facts, uses, growing tips, and plant parts when provided by the herb's JSON
file. Close it with the × button or the Escape key.

Every herb can be added to **My favorites**. Favorites are saved in the
browser (`localStorage`).

## React version

The `react/` folder contains a React version of the herb browser (search by
common or Latin name, favorites, herb details). It reads the same
`data/<id>.json` files.

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
| `quickFacts` | list of `{ "label", "value" }` | yes | always 5 facts: Life cycle, Origin, Blooms, Height, Likes |
| `uses` | list of `{ "title", "text" }` | yes | what the herb is used for |
| `growingTips` | list of `{ "title", "text" }` | yes | how to grow it |
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
same `id` to `data/herbs.json`.
