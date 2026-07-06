import fs from 'fs';
const content = fs.readFileSync('d:\\Meetify\\frontend\\src\\styles\\global.css', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('border') || line.includes('shadow') || line.includes('background')) {
    console.log(`${index + 1}: ${line}`);
  }
});
