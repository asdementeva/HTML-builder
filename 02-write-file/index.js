const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const writableStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.on('line', (input) => {
  writableStream.write(input + '\n');

  rl.prompt();
})

rl.prompt();

rl.on('close', () => {
  console.log('Goodbye! Program is closing.');
  process.exit();
});