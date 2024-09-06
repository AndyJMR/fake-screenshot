To run this project, follow these steps:

1. **Install Dependencies**:
   Navigate to the project root directory and run:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   After installing the dependencies, start the development server with:
   ```bash
   npm run dev
   ```

3. **Build the Project**:
   To build the project for production, use:
   ```bash
   npm run build
   ```

4. **Preview the Build**:
   To preview the built project, run:
   ```bash
   npm run preview
   ```

5. **Run ESLint**:
   To check for linting issues, execute:
   ```bash
   npm run lint
   ```

These commands are defined in your `package.json` file:

```json
  "scripts": {
    "dev": "vite --open",
    "build": "tsc -b && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
```


Make sure you have Node.js and npm installed on your machine. If not, you can download and install them from [Node.js official website](https://nodejs.org/).