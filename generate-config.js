// generate-config.js
const fs = require('fs');
const apiUrl = process.env.API_URL;

if (!apiUrl) {
  console.error('API_URL não definida!');
  process.exit(1);
}

const configContent = `window.API_URL = '${apiUrl}';\n`;
fs.writeFileSync('config.js', configContent);
console.log('Arquivo config.js gerado com sucesso!'); 