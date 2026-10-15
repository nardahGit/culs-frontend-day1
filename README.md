# The Little Herb Garden

A small website for day 1 of **Frontend Development**.

It is broken. Your job is to find out why, and to repair it.

## What you need

- a GitHub account
- Git
- an editor
- a browser (Firefox recommended)
- [Node.js](https://nodejs.org/) (the LTS version), which brings `npx`

## Get your copy

1. **Fork** this repository to your GitHub account.
2. **Clone your fork**, not this repository:

   ```sh
   git clone https://github.com/<your-name>/culs-frontend-day1.git
   cd culs-frontend-day1
   ```

## Run it

Start a small web server in the project folder:

```sh
npx serve
```

The first time, `npx` asks whether to install `serve`. Answer `y`.

Then open the address it prints, usually <http://localhost:3000>.
Stop the server with `Ctrl+C`.

Do not open `index.html` by double-clicking it. A `file://` page is not the Web.

## Your mission

Something is wrong. Several things, in fact.

1. Inspect before you change anything: the page, the Console, the Network panel, the Inspector.
2. Pick one problem and find out why it happens.
3. Fix it, reload, verify.
4. Commit that one fix, with a message that says what you fixed.
5. Repeat.

You are done when:

- the Console shows no unexplained errors
- the Network panel shows no missing files
- every link on the page goes where it says
- `git status` is clean, and `git push` has sent your commits to GitHub

## The project

```text
index.html    the page
style.css     how it looks
app.js        what it does
data/         the herbs, as JSON
images/       the logo and a picture
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
