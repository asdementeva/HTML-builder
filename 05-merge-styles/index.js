const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  try {
    const stylesFolder = path.join(__dirname, 'styles');
    const files = await fs.readdir(stylesFolder);

    const cssFiles = files.filter(file => path.extname(file) === '.css');

    const stylesArray = await Promise.all(cssFiles.map(async file => {
      const filePath = path.join(stylesFolder, file);
      return await fs.readFile(filePath, 'utf-8');
    }));

    const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
    await fs.writeFile(bundlePath, stylesArray.join('\n'));

    console.log('Styles merged successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

mergeStyles();
