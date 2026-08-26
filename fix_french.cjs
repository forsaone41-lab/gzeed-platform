const fs = require('fs');

const targetFile = 'src/pages/GZeedBuilder.tsx';
let c = fs.readFileSync(targetFile, 'utf8');

const replacements = {
  'Ã‰diteur Visuel': 'Éditeur Visuel',
  'En-tÃªte': 'En-tête',
  'BanniÃ¨re HÃ©ro': 'Bannière Héro',
  'Grille de CatÃ©gories': 'Grille de Catégories'
};

for (const [broken, fixed] of Object.entries(replacements)) {
  const regex = new RegExp(broken, 'g');
  c = c.replace(regex, fixed);
}

fs.writeFileSync(targetFile, c, 'utf8');
console.log('Fixed French encoding in GZeedBuilder.tsx');
