import fs from 'fs';
import path from 'path';
import colors from 'colors';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { replaceInFile } from 'replace-in-file';

type PackageManager = 'npm' | 'yarn';

const main = async () => {
  const cwd = process.cwd();
  const res = execSync('npm list -g', { stdio: 'pipe' });

  const answers = await inquirer.prompt([
    {
      message: 'Name of your project:',
      name: 'projectName',
      default: 'my-twpx-app',
    },

    {
      message: 'Choose a template:',
      name: 'template',
      type: 'list',
      choices: [
        'vanilla',
        'vanilla-ts',
        'react',
        'react-ts',
        'next',
        'next-ts',
      ],
      default: 'vanilla',
    },

    {
      message: 'Install with:',
      name: 'pkgManager',
      type: 'list',
      choices: ['npm', 'yarn'],
      default: 'npm',
    },
  ]);

  const projectName = answers['projectName'];
  const pkgManager: PackageManager = answers['pkgManager'];
  let template = answers['template'];

  const useNpm = pkgManager === 'npm';

  const npmTemplate = `npm init vite@latest ${projectName} -- --template ${template}`;
  const yarnTemplate = `yarn create vite ${projectName} --template ${template}`;

  if (!useNpm && res.toString().includes('yarn@')) {
    console.log(colors.gray('\n→ Using yarn to install packages...'));
    execSync(yarnTemplate, { stdio: 'inherit' });
  } else if (useNpm) {
    console.log(colors.gray('\n→ Using npm to install packages...'));
    execSync(npmTemplate, { stdio: 'inherit' });
  } else {
    console.log(colors.gray('\n→ Cannot find yarn.'));
    console.log(colors.gray('→ Using npm to install packages...'));
    execSync(npmTemplate, { stdio: 'inherit' });
  }

  process.chdir(path.join(cwd, projectName));

  try {
    console.log(colors.gray('\n→ Installing dependencies & Tailwind CSS...'));

    let prefix = 'npm i';

    if (!useNpm) prefix = 'yarn add';
    execSync(
      `${prefix} -D tailwindcss@latest postcss@latest autoprefixer@latest`,
      { stdio: 'inherit' }
    );

    execSync(`npx tailwindcss init`, { stdio: 'inherit' });

    console.log(colors.green.bold('\n  [ Installed Successfully! ]'));
    console.log('\nGet Started, Run:'.gray);

    console.log(colors.yellow(`\ncd ${projectName}`));

    if (useNpm) console.log(colors.yellow('npm run dev'));
    else console.log(colors.yellow('yarn dev'));
  } catch (err) {
    console.log(err);
  }

  const projectDir = path.join(cwd, projectName);

  const tailwindConfig = {
    files: `${projectDir}/tailwind.config.js`,
    from: /content: \[]/g,
    to: "content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}']",
  };
  try {
    await replaceInFile(tailwindConfig);
    fs.writeFileSync(
      path.join(projectDir, 'src/index.css'),
      '@tailwind base;\n@tailwind components;\n@tailwind utilities;'
    );
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

main();
