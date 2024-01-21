const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFileInfo() {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      const fileExtension = path.extname(file.name);

      const stats = await fs.stat(path.join(folderPath, file.name));

      if (stats.isFile()) {
        console.log(`${file.name}-${fileExtension}-${(stats.size / 1024).toFixed(3)}kb`);
      } else {
        console.error(`${file.name} is not a file. Skipping...`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

displayFileInfo();
