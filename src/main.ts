#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import colors from 'colors';
import fs from 'fs';

if (process.argv.length < 3) {
  console.log('\n⩺ You forgot to name your project.'.red);
  console.log('\n⩺ example ↴'.brightGreen);
  console.log('⩺ npx vr2t my-app'.brightGreen);
  process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const gitRepo = 'https://github.com/joshxfi/vr2t-boilerplate.git';

try {
  fs.mkdirSync(projectPath);
} catch (err) {
  err.code === 'EEXIST'
    ? console.log(
        `\nThe folder ${projectName} already exists, please use a different name for your project.`
          .red
      )
    : console.log(err);

  process.exit(1);
}

const main = async () => {
  try {
    console.log('\n⩺ Downloading files...'.bgGreen.black);
    execSync(`git clone --depth 1 ${gitRepo} ${projectPath}`);

    process.chdir(projectPath);

    console.log('\n⩺ Installing dependencies...'.bgYellow.black);
    execSync('yarn install');

    console.log('\n⩺ Removing unnecessary files...'.bgBrightRed.black);
    execSync('npx rimraf ./.git');

    console.log(
      '\n⩺ The installation is complete!\n⩺ cd your-project-name\n⩺ yarn dev'
        .green.bold
    );
  } catch (err) {
    console.log(err);
  }
};
main();
