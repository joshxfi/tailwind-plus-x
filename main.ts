import path from 'path';
import colors from 'colors';
import inquirer from 'inquirer';
import { execSync } from 'child_process';

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
        'react',
        'react-ts',
        'next',
        'next-ts',
        'vanilla',
        'vanilla-ts',
      ],
      default: 'react',
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
  
  const useNpm = pkgManager === 'npm'

  const npmTemplate = `npm init vite@latest ${projectName} -- --template ${template}`;
  const yarnTemplate = `yarn create vite ${projectName} --template ${template}`;

  if (!useNpm && res.toString().includes('yarn@')) {
    console.log(colors.gray('\n→ Using yarn to install packages.'));
    execSync(yarnTemplate, { stdio: 'inherit' });
  } else if (useNpm) {
    console.log(colors.gray('\n→ Using npm to install packages.'));
    execSync(npmTemplate, { stdio: 'inherit' });
  } else {
    console.log(colors.gray('\n→ Cannot find yarn.'));
    console.log(colors.gray('→ Using npm to install packages.'));
    execSync(npmTemplate, { stdio: 'inherit' });
  }

  process.chdir(path.join(cwd, projectName));

  try {
    console.log(colors.gray('\n→ Installing Tailwind CSS...'));

    let prefix = 'npm install'

    if (!useNpm) prefix = 'yarn add' 
    execSync(prefix.concat(' -D tailwindcss@latest postcss@latest autoprefixer@latest'), { stdio: 'inherit' });

    console.log(colors.green.bold('\n  [ Installed Successfully! ]'));
    console.log('\n→ cd to your project & run the dev server.'.gray);

    console.log(colors.yellow(`\ncd ${projectName}`));

    if (useNpm) console.log(colors.yellow('npm run dev'));
    else console.log(colors.yellow('yarn dev'));
  } catch (err) {
    console.log(err);
  }

};

main();
