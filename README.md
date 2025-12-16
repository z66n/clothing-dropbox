# clothing-dropbox
Interactive Leaflet map showing active clothing drop-box locations in the City of Toronto.

## ✨ Features

- **Interactive map** using Leaflet
- **Local GeoJSON data** (downloadable from City of Toronto Open Data)
- **Walking routes** (OpenRouteService Directions) from your location to a selected drop box
- **Catppuccin** color palette for consistent styling

## 🚀 Quickstart

1. Clone the repo:

   ```bash
   git clone https://github.com/z66n/clothing-dropbox
   cd clothing-dropbox
   ```

2. Fetch the latest dataset (saves to `data/clothing-dropboxes.geojson`):

   ```bash
   npm run fetch-data
   ```

3. Serve the project with a static server (the app must be served over HTTP/HTTPS for fetch and geolocation to work):

   - Using `serve` (recommended):
     ```bash
     npx serve . -p 5000
     ```

   - Or with Python:
     ```bash
     python -m http.server 5000
     ```

4. Open your browser to `http://localhost:5000` and allow location access when prompted.

## 🔧 Configuration

- **OpenRouteService API key**: The routing feature requires an OpenRouteService API key.
  - Set the key as an environment variable `ORS_API_KEY` and use the included **Netlify serverless function** at `netlify/functions/getRoute.js`. The client calls `/.netlify/functions/getRoute` (see `script.js`) and the function injects the secret into the outbound ORS request so the key never lands in client-side code. (See **Development notes** for local testing with Netlify CLI.)

- **Data file**: `data/clothing-dropboxes.geojson` — updated by `npm run fetch-data`.

## 🛠️ Development notes

- Main files:
  - `index.html` — main page and Leaflet includes
  - `script.js` — map setup, data loading, marker/popup behavior, and routing logic
  - `fetch-data.js` — helper script to download the GeoJSON from City of Toronto Open Data
  - `netlify/functions/getRoute.js` — Netlify serverless function that proxies requests to OpenRouteService and reads `ORS_API_KEY` from environment variables

- Marker styling and palette live in `script.js` (the `catppuccin` object).
- Clicking a marker uses the browser's Geolocation API to get your location and requests a walking route from OpenRouteService (the client calls the serverless function at `/.netlify/functions/getRoute`).

> Privacy note: Your geolocation is used only locally in your browser to request routes and show a marker; it is not sent to this repository or stored by this project.

## 🐞 Troubleshooting

- Map not appearing: ensure `#map` has CSS height (the provided `index.html` sets `#map { height: 100vh; }`).
- Geolocation errors: ensure you access the site over `http://localhost` or `https://` (browsers block geolocation on `file://` pages) and allow location access.
- CORS/network errors fetching the GeoJSON: make sure you are serving the repo on a local server (see Quickstart) and that the `data/clothing-dropboxes.geojson` file exists.
- Routing errors: confirm your OpenRouteService API key is valid and not rate-limited.

## 📦 Data Source

- Source: City of Toronto Open Data — Clothing Drop Box Locations
- Original dataset URL used by `fetch-data.js`:
  `https://open.toronto.ca/dataset/clothing-drop-box-locations/`

## Automated data updates 🔁

The City's dataset is refreshed monthly. To keep `data/clothing-dropboxes.geojson` up to date automatically, you can set up an automated trigger:

- **Netlify build hook**: create a build hook in Netlify (Site settings → Build & deploy → Build hooks) and copy the hook URL. Schedule periodic POST requests (e.g., monthly) to that URL to trigger a new build that pulls the latest dataset during the build step.
- **cron-job.org**: create a job that sends an HTTP POST to your Netlify build hook URL on a monthly schedule (or choose another cadence).

When Netlify rebuilds, the updated GeoJSON is included and the live site/functions will use the latest data.

## Contributing

Contributions are welcome! Please open issues or PRs. Do not include API keys or other secrets in commits.

## License

This project is licensed under the **MIT License** — see the `LICENSE` file for details.
