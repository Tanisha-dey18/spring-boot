# ⌨️ Type Sprint

A minimal typing speed test that runs entirely in the browser. No dependencies, no build step.

## Features

- **15s / 30s / 60s** test lengths
- Live **WPM** and **accuracy** while you type
- Words turn green or red as you go, and the current word shows typos instantly
- Saves your **personal best** for each test length in your browser
- Press **Esc** to restart anytime

## Run it

Open `index.html` in a browser. Or serve it locally:

```bash
python -m http.server 8000
```

then visit http://localhost:8000.

## How WPM is calculated

Uses the standard formula: correctly typed characters (including spaces) ÷ 5, divided by minutes elapsed.

## Deploy on GitHub Pages

1. Go to **Settings → Pages** in this repo.
2. Under **Source**, pick the `main` branch and `/ (root)`, then save.
3. The site will be live at `https://<your-username>.github.io/<repo-name>/`.

## License

[MIT](LICENSE)
