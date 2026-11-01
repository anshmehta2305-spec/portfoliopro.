const fs = require('fs');

const historyPath = 'C:\\Users\\Admin\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\History';
const tempHistory = 'scripts/temp_history.db';

try {
  fs.copyFileSync(historyPath, tempHistory);
  const buffer = fs.readFileSync(tempHistory);
  const text = buffer.toString('binary');
  const regex = /http:\/\/localhost:[0-9]+[a-zA-Z0-9_\-\/\.\?\=\&\%]*/g;
  const matches = text.match(regex);
  if (matches) {
    const unique = Array.from(new Set(matches));
    console.log('Recent localhost URLs in Chrome history (' + unique.length + ' found):');
    unique.slice(-30).forEach(u => console.log('  ->', u));
  } else {
    console.log('No matches found');
  }
  fs.unlinkSync(tempHistory);
} catch (e) {
  console.error(e);
}
