const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  try {
    const targetFolder = path.join(__dirname, 'files-copy');
    await fs.mkdir(targetFolder, { recursive: true });

    const files = await fs.readdir(path.join(__dirname, 'files'));

    for (const file of files) {
      await fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(targetFolder, file)
      );
    }

    console.log('Directory copied successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

copyDir();
