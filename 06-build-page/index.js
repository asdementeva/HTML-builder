const fs = require('fs/promises');
const path = require('path');

async function compileStyles() {
  try {
    const stylesFolder = path.join(__dirname, 'styles');
    const files = await fs.readdir(stylesFolder);

    const cssFiles = files.filter(file => path.extname(file) === '.css');

    const stylesArray = await Promise.all(cssFiles.map(async file => {
      const filePath = path.join(stylesFolder, file);
      return await fs.readFile(filePath, 'utf-8');
    }));

    const styleFilePath = path.join(__dirname, 'project-dist', 'style.css');
    await fs.writeFile(styleFilePath, stylesArray.join('\n'));

    console.log('Styles compiled successfully!');
  } catch (error) {
    console.error('Error compiling styles:', error.message);
  }
}

async function copyAssets() {
  try {
    const assetsSource = path.join(__dirname, 'assets');
    const assetsDest = path.join(__dirname, 'project-dist', 'assets');

    await fs.mkdir(assetsDest, { recursive: true });

    const files = await fs.readdir(assetsSource, { withFileTypes: true });

    await Promise.all(files.map(async (file) => {
      const sourcePath = path.join(assetsSource, file.name);
      const destPath = path.join(assetsDest, file.name);

      if (file.isDirectory()) {
        await copyDirectory(sourcePath, destPath);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
    }));

    console.log('Assets copied successfully!');
  } catch (error) {
    console.error('Error copying assets:', error.message);
  }
}

async function copyDirectory(source, destination) {
  const files = await fs.readdir(source, { withFileTypes: true });

  await fs.mkdir(destination, { recursive: true });

  await Promise.all(files.map(async (file) => {
    const sourcePath = path.join(source, file.name);
    const destPath = path.join(destination, file.name);

    if (file.isDirectory()) {
      await copyDirectory(sourcePath, destPath);
    } else {
      await fs.copyFile(sourcePath, destPath);
    }
  }));
}

async function buildPage() {
  try {
    const projectDistFolder = path.join(__dirname, 'project-dist');
    await fs.mkdir(projectDistFolder, { recursive: true });

    let templateContent = await fs.readFile(path.join(__dirname, 'template.html'), 'utf-8');

    const tags = templateContent.match(/{{\s*[\w\d]+\s*}}/g);

    if (tags) {
      for (const tag of tags) {
        const componentName = tag.replace(/{{\s*([\w\d]+)\s*}}/, '$1');
        const componentPath = path.join(__dirname, 'components', `${componentName}.html`);

        try {
          const componentContent = await fs.readFile(componentPath, 'utf-8');
          templateContent = templateContent.replace(tag, componentContent);
        } catch (componentError) {
          console.error(`Error reading component ${componentName}: ${componentError.message}`);
        }
      }

      const indexPath = path.join(projectDistFolder, 'index.html');
      await fs.writeFile(indexPath, templateContent);

      await compileStyles();

      await copyAssets();

      console.log('Page built successfully!');
    } else {
      console.error('No template tags found in template.html');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

buildPage();
