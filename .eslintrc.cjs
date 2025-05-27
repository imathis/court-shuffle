module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended", // 👈 Add TypeScript recommended rules
  ],
  parser: "@typescript-eslint/parser", // 👈 Use TypeScript parser
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json", // 👈 Point to tsconfig for type-aware linting
    tsconfigRootDir: __dirname,
  },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "@typescript-eslint"], // 👈 Add TypeScript plugin
  rules: {
    "react-refresh/only-export-components": "warn",
    // Optionally disable conflicting rules
    "react/prop-types": "off", // 👈 Disable prop-types since TypeScript handles this
  },
};
