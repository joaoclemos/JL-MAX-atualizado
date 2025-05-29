const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  console.log("✅ JSON válido!", data);
} catch (err) {
  console.error("❌ JSON inválido:", err.message);
}