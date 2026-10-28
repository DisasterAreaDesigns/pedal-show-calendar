# Pedal Show Calendar

A simple calendar website listing guitar effects pedal shows, expos and meetups.

It's a plain static site — no build step. Events live in [`data/events.json`](data/events.json) and are rendered client-side by [`app.js`](app.js).

## Run locally

The page loads its data with `fetch`, so serve it over HTTP rather than opening the file directly:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Adding a show

Add an object to `data/events.json`:

| Field     | Required | Notes                                  |
|-----------|----------|----------------------------------------|
| `id`      | yes      | Unique slug, e.g. `my-show-2027`       |
| `name`    | yes      | Show name                              |
| `start`   | yes      | `YYYY-MM-DD`                           |
| `end`     | no       | `YYYY-MM-DD`; defaults to `start`      |
| `venue`   | no       |                                        |
| `city`    | no       |                                        |
| `region`  | no       | State / province                       |
| `country` | no       |                                        |
| `url`     | no       | Official show page                     |
| `tags`    | no       | e.g. `["expo", "boutique"]`            |
| `notes`   | no       | Not displayed yet                      |

The entries currently in the file are placeholders.

## Deploying

Any static host works. For GitHub Pages: push to GitHub, then Settings → Pages → deploy from the `main` branch root.
