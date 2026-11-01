/**
 * Database Provider Switcher
 * Usage:
 *   node scripts/switch-db.js postgresql
 *   node scripts/switch-db.js sqlite
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const target = process.argv[2]?.toLowerCase();
const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
const pgSchemaPath = path.resolve(__dirname, '../prisma/schema.postgresql.prisma');

if (target !== 'postgresql' && target !== 'sqlite') {
  console.log('Usage: node scripts/switch-db.js [postgresql | sqlite]');
  process.exit(1);
}

if (target === 'postgresql') {
  console.log('Switching Prisma schema to PostgreSQL (Supabase / AWS RDS / Neon)...');
  const pgContent = fs.readFileSync(pgSchemaPath, 'utf8');
  fs.writeFileSync(schemaPath, pgContent, 'utf8');
  console.log('Updated prisma/schema.prisma with provider = "postgresql".');
} else {
  console.log('Switching Prisma schema to SQLite (Local Development)...');
  let content = fs.readFileSync(schemaPath, 'utf8');
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, content, 'utf8');
  console.log('Updated prisma/schema.prisma with provider = "sqlite".');
}

try {
  console.log('Regenerating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log(`Database provider successfully set to ${target.toUpperCase()}!`);
} catch (err) {
  console.error('Failed to regenerate prisma client:', err.message);
}

