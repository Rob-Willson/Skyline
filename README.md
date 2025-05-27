
# Skyline

This project is a mixture between a portfolio showoff and relearning exercice, for Angular 19 and data visualisation using D3.js.

## Demo

https://rob-willson.github.io/Skyline/


## How to Run Locally

1. Prerequisites:
- Node.js (v21 or higher recommended)
- npm (comes bundled with Node.js)

2. Clone or download this repository.

3. Open a terminal and navigate to the project folder:
```bash
cd path/to/project
```

4. Install project dependencies:
```bash
npm install
```

5. Start locally:
```bash
ng serve
```

6. Open your browser and visit:
```bash
http://localhost:4200
```

The app will automatically reload when you make changes to source files.


## How to Update Demo on GitHub Pages

1. Make production build:
```bash
ng build --configuration production
```

2. Deploy to GitHub Pages:
```bash
npx angular-cli-ghpages --dir=dist/skyline-app/browser
```
