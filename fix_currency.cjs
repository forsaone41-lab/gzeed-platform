const fs = require('fs');

let c = fs.readFileSync('src/pages/StoreBuilder.tsx', 'utf8');

// 1. Add state variable
c = c.replace(
  /const \[storeLang, setStoreLang\] = useState\('fr'\);/,
  "const [storeLang, setStoreLang] = useState('fr');\n  const [storeCurrency, setStoreCurrency] = useState('MAD');"
);

// 2. Add receiver for storeCurrency
c = c.replace(
  /if \(payload\.storeLang\) setStoreLang\(payload\.storeLang\);/,
  "if (payload.storeLang) setStoreLang(payload.storeLang);\n          if (payload.storeCurrency) setStoreCurrency(payload.storeCurrency);"
);

// 3. Replace static ' MAD' with ' ${storeCurrency}' in JSX
// Wait, if I just replace ' MAD', it will break string templates and normal strings.
// Let's replace ' MAD</p>' with ' {storeCurrency}</p>'
// Let's replace ' MAD</span>' with ' {storeCurrency}</span>'
// Let's replace ' MAD</div>' with ' {storeCurrency}</div>'
// Let's replace ' MAD' when it's inside a template string:  `... MAD` -> `... ${storeCurrency}`
// Or I can do it safely.

c = c.replace(/ MAD<\/p>/g, " {storeCurrency}</p>");
c = c.replace(/ MAD<\/span>/g, " {storeCurrency}</span>");
c = c.replace(/ MAD<\/div>/g, " {storeCurrency}</div>");
c = c.replace(/ MAD\`/g, " ${storeCurrency}`");
c = c.replace(/ MAD',/g, " ${storeCurrency}',");

fs.writeFileSync('src/pages/StoreBuilder.tsx', c, 'utf8');
console.log("Successfully updated currency in StoreBuilder.tsx");
