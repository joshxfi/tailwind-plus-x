<div align=center>
  
# Tailwind Plus X
 ![example workflow](https://github.com/joshxfi/tailwind-plus-x/actions/workflows/codeql-analysis.yml/badge.svg)
 [![npm version](https://badge.fury.io/js/twpx.svg)](https://badge.fury.io/js/twpx)
 ![license](https://img.shields.io/badge/license-MIT-brightgreen?style=flat)
 
</div>

A boilerplate generator that automatically configures the latest [`Tailwind CSS`](https://github.com/tailwindlabs/tailwindcss) version for you. [`Vite`](https://github.com/vitejs/vite) is used for most of the templates. See available templates below. 

## Installation
- If you are using `npm` to install a template, make sure to have `v7.x` (do `npm -v` to check version)
- Go to the directory where you want to store your project:
```sh
$ cd <your_directory>
```
- Running the command below will walk you through an interactive installation process:
```sh
$ npx twpx
```
- You can also directly generate it by doing:
```sh
# NOTE: to use npm, remove the yarn flag
$ npx twpx <project_name> --template <template> --yarn

# shorthand version:
$ npx twpx <project_name> -t <template> -y
```
- NOTE: some terminals like `git bash` will not work well with the interactive installation (use the other installation instead)

## How It Works
- For example, you named your project `hello-world` & chose `react-ts` template with `yarn`. The generator will execute:
```ruby
$ yarn create vite hello-world --template react-ts
$ cd hello-world
$ yarn add -D tailwindcss@latest postcss@latest autoprefixer@latest
```
- A script is then executed to replace the content of the main css file with tailwindcss directives:
```ruby
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