#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const colors = require('colors');
const fs = require('fs');

if (process.argv.length < 3) {
  console.log(colors.red('\n→ You forgot to name your project.'));
  console.log('\nExample:'.green);
  console.log('└─ npx vr2t my-app'.green);
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
    console.log('\n→ Downloading files...'.green);
    execSync(`git clone --depth 1 ${gitRepo} ${projectPath}`);

    process.chdir(projectPath);

    console.log('→ Removing the remote repository...'.red);
    execSync('npx rimraf ./.git');

    console.log('\n[ Installed Successfully! ]'.bold.green);

    console.log('\n→ Install the dependencies & run the dev server'.magenta)

    console.log('\nfor yarn:'.green, '\n├─ yarn or yarn install\n└─ yarn dev'.yellow);
    console.log('\nfor npm:'.green, '\n├─ npm i or npm install\n└─ npm run dev'.yellow);
    
  } catch (err) {
    console.log(err);
  }
};
main();
