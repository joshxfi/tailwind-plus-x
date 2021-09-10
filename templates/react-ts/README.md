# VR2T Boilerplate Generator 💨

VR2T [ *VR-TT* ] stands for [Vite](https://github.com/vitejs/vite) - [React](https://github.com/microsoft/TypeScript) - [TypeScript](https://github.com/microsoft/TypeScript) - [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)

![](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Installation
```shell
npx vr2t
```
---
- You can also directly specify the project name.
- Replace the `project-name` with the title of your project —
```shell
npx vr2t project-name
```
---
- VR2T uses `yarn` as default to install dependencies.
- If you want to use `npm` instead of `yarn` —
```shell
npx vr2t project-name --npm
```
---
```js
📂 your-project
├─ 📂 src
│  ├─ 📂 components
│  ├─ 📂 types
│  │  ├─ 📄 main.d.ts
│  └─ └─ 📄 props.d.ts
├─ 📄 .gitignore
├─ 📄 .prettierrc
├─ 📄 index.html
├─ 📄 package.json
├─ 📄 postcss.config.js
├─ 📄 tailwind.config.js
├─ 📄 tsconfig.json
└─ 📄 vite.config.json
```
- Customize the `.prettierrc` to your liking.
- Delete the types &/ components folder if you don't need them.
