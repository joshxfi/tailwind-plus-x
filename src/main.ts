#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import colors from 'colors';
import fs from 'fs';

if (process.argv.length < 3) {
  console.log(colors.red('\n→ You forgot to name your project.'));
  console.log('\nExample:'.green, '\n└─ npx vr2t my-app'.yellow);
  process.exit(1);
}

const projectName: string = process.argv[2];
const currentPath: string = process.cwd();
const projectPath: string = path.join(currentPath, projectName);
const gitRepo: string = 'https://github.com/joshxfi/vr2t-boilerplate.git';

// package manager flag -> ex: --npm
const pmFlag: string = process.argv[3];

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
    console.log('\n→ Downloading files...'.green);
    execSync(`git clone --depth 1 ${gitRepo} ${projectPath}`);

    process.chdir(projectPath);

    console.log('\n→ Removing the remote repository...'.red);
    execSync('npx rimraf ./.git');
    
    console.log('\n→ Installing the dependencies...'.yellow);
    if (pmFlag === '--npm') {
      console.log('detected --npm flag, installing with npm...'.gray);
      execSync('npm i');
    } else {
      console.log('no flag detected, installing with yarn...'.gray);
      execSync('yarn');
    }

    console.log('\n[ Installed Successfully! ]'.green.bold);

    console.log('\n→ cd to your project & run the dev server.'.magenta);

    console.log(`\ncd ${projectName}`.yellow);

    console.log(
      '\nfor yarn:'.green,
      '\n├─ yarn or yarn install\n└─ yarn dev'.yellow
    );
    console.log(
      '\nfor npm:'.green,
      '\n├─ npm i or npm install\n└─ npm run dev'.yellow
    );
  } catch (err) {
    console.log(err);
  }
};
main();
