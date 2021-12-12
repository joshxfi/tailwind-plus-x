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

  const projectName: string = answers['projectName'];
  const pkgManager: PackageManager = answers['pkgManager'];
  let template: string = answers['template'];

  const useNpm = pkgManager === 'npm';
  const useYarn = !useNpm && res.toString().includes('yarn@');

  const npmTemplate = `npm init vite@latest ${projectName} -- --template ${template}`;
  const yarnTemplate = `yarn create vite ${projectName} --template ${template}`;

  const nextTsFlag = template === 'next-ts' ? '--ts' : '';

  const nextNpmTemplate = `npx create-next-app@latest ${projectName} ${nextTsFlag}`;
  const nextYarnTemplate = `yarn create next-app ${projectName} ${nextTsFlag}`;

  const yarnNotFound = (cmd: string) => {
    console.log(colors.gray('\n→ Cannot find yarn.'));
    console.log(colors.gray('→ Using npm to install packages...'));
    return execSync(cmd, { stdio: 'inherit' });
  };

  if (template.includes('next')) {
    if (useYarn) execSync(nextYarnTemplate, { stdio: 'inherit' });
    else if (useNpm) execSync(nextNpmTemplate, { stdio: 'inherit' });
    else yarnNotFound(nextNpmTemplate);
  } else {
    if (useYarn) {
      console.log(colors.gray('\n→ Using yarn to install packages...'));
      execSync(yarnTemplate, { stdio: 'inherit' });
    } else if (useNpm) {
      console.log(colors.gray('\n→ Using npm to install packages...'));
      execSync(npmTemplate, { stdio: 'inherit' });
    } else yarnNotFound(npmTemplate);
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

    console.log(colors.green.bold('\n[ Installed Successfully! ]'));
    console.log('\nGet Started, Run:'.gray);

    console.log(colors.yellow(`\ncd ${projectName}`));

    if (useNpm) console.log(colors.yellow('npm run dev'));
    else console.log(colors.yellow('yarn dev'));
  } catch (err) {
    console.log(err);
  }

  const projectDir = path.join(cwd, projectName);

  const useTwConfig = () => {
    let content: string;

    if (template.includes('next'))
      content = "'./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'";
    else if (template.includes('vanilla')) content = "'./index.html'";
    else content = "'./index.html', './src/**/*.{js,ts,jsx,tsx}'";

    return `content: [${content}]`;
  };

  const useTwPath = () => {
    switch (template) {
      case 'next':
      case 'next-ts':
        return 'styles/globals.css';

      case 'vanilla':
        return 'style.css';

      case 'vanilla-ts':
        return 'src/style.css';

      default:
        return 'src/index.css';
    }
  };

  const tailwindConfig = {
    files: `${projectDir}/tailwind.config.js`,
    from: /content: \[]/g,
    to: useTwConfig(),
  };
  try {
    await replaceInFile(tailwindConfig);
    fs.writeFileSync(
      path.join(projectDir, useTwPath()),
      '@tailwind base;\n@tailwind components;\n@tailwind utilities;'
    );
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

main();
