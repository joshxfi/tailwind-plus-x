<div align=center>
  
# Tailwind Plus X
 
</div>

A boilerplate generator that automatically configures the latest [`Tailwind CSS`](https://github.com/tailwindlabs/tailwindcss) version for you. We use [`Vite`](https://github.com/vitejs/vite) for most of the templates. See available templates below. 

## Installation
- Some terminals like `git bash` will not work (you can use `powershell` as an alternative if you're on windows)
- If you are using `npm` to install a template, make sure to have `v7.x` (`npm -v` to check version, `npm i -g npm@latest` to upgrade)
- Go to the directory where you want to store your project:
```sh
$ cd your_directory
```
- Running the command below will walk you through an interactive installation process:
```sh
$ npx twpx
```

## How It Works
- For example, you chose `react-ts` template with `yarn`. The generator will execute:
```sh
$ yarn create vite projectName --template react-ts
$ cd projectName
$ yarn add -D tailwindcss@latest postcss@latest autoprefixer@latest
```
- A command is then executed to replace the content of the main css file with tailwindcss directives:
```js
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Templates Available
```js
vanilla
vanilla-ts
react
react-ts
next
next-ts
```

## Contributing
- [Report bugs or feature requests.](https://github.com/joshxfi/tailwind-plus-x/issues)
- Submit your pull request on the `dev` branch.
- To test locally, run:
```sh
# make sure you have ts-node installed (npm i -g ts-node)
$ cd your_cloned_fork
$ ts-node main
```

## License
This [repository](https://github.com/joshxfi/tailwind-plus-x) is licensed under the [MIT license.](https://github.com/joshxfi/trackAsOne/blob/main/LICENSE)
