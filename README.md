# clothing-dropbox

Interactive Leaflet map showing active clothing drop-box locations in the City of Toronto.

## ✨ Features

* **Interactive map** with Leaflet
* **Local GeoJSON data** from City of Toronto Open Data
* **Walking routes** using OpenRouteService Directions

## 🚀 Quickstart

1. Clone the repo:

```bash
git clone https://github.com/z66n/clothing-dropbox
cd clothing-dropbox
```

2. Fetch the latest dataset:

```bash
npm run fetch-data
```

3. Serve the project (must use HTTP/HTTPS for fetch and geolocation):

```bash
npx serve . -p 5000
# or
python -m http.server 5000
```

4. Open your browser at `http://localhost:5000` and allow location access.

## 🔧 Configuration

* **OpenRouteService API key**:
  Set `ORS_API_KEY` in your environment and use the included Netlify serverless function (`netlify/functions/getRoute.js`). The frontend calls `/.netlify/functions/getRoute` to request routes securely.

* **Data file**: `data/clothing-dropboxes.geojson` — updated via `npm run fetch-data`.

## 🛠 Development Notes

* Key files:

  * `index.html` — main page
  * `script.js` — map setup, data loading, marker/popup behavior, and routing calls
  * `fetch-data.js` — downloads the GeoJSON dataset
  * `netlify/functions/getRoute.js` — serverless function for secure routing

> **Privacy:** Your geolocation is only used locally to calculate routes; it is not stored or sent to this repository.

## 🐞 Notes
- Make sure to serve the site via HTTP/HTTPS to enable geolocation and fetch.
- Verify your OpenRouteService API key is valid.

## 📦 Data Source

* **[City of Toronto Open Data — Clothing Drop Box Locations](https://open.toronto.ca/dataset/clothing-drop-box-locations/)**

## 🔁 Automated Data Updates

* The dataset is refreshed monthly.
* You can trigger Netlify rebuilds via a **build hook** to fetch the latest data automatically.

## Contributing

Contributions are welcome! Open issues or PRs, but **do not include API keys or secrets**.

## License

This project is licensed under the **MIT License** — see the `LICENSE` file.