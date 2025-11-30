import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🔍 Save Point Backend - Setup Verification\n');

// Required files check
const requiredFiles = [
  'package.json',
  '.env',
  'src/server.js',
  'src/config/database.js',
  'src/models/User.js',
  'src/models/Habit.js',
  'src/models/Task.js',
  'src/models/Achievement.js',
  'src/controllers/authController.js',
  'src/controllers/habitController.js',
  'src/controllers/taskController.js',
  'src/routes/authRoutes.js',
  'src/routes/habitRoutes.js',
  'src/routes/taskRoutes.js',
  'src/middleware/auth.js',
  'src/middleware/errorHandler.js',
  'src/services/gamificationService.js'
];

console.log('📁 Checking required files...\n');

let missingFiles = 0;
requiredFiles.forEach(file => {
  const filePath = join(__dirname, file);
  const exists = existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file}`);
  if (!exists) missingFiles++;
});

// Check package.json
console.log('\n📦 Checking package.json...\n');

const packageJsonPath = join(__dirname, 'package.json');
if (existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  const requiredDeps = [
    'express',
    'mongoose',
    'dotenv',
    'bcrypt',
    'jsonwebtoken',
    'cors',
    'helmet'
  ];

  let missingDeps = 0;
  requiredDeps.forEach(dep => {
    const exists = packageJson.dependencies && packageJson.dependencies[dep];
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${dep}`);
    if (!exists) missingDeps++;
  });

  if (missingDeps > 0) {
    console.log('\n⚠️  Missing dependencies. Run: npm install\n');
  }
} else {
  console.log('❌ package.json not found!\n');
}

// Check .env file
console.log('\n⚙️  Checking environment variables...\n');

const envPath = join(__dirname, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');

  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'CLIENT_URL'
  ];

  let missingVars = 0;
  requiredVars.forEach(varName => {
    const exists = envContent.includes(`${varName}=`);
    const status = exists ? '✅' : '❌';
    console.log(`${status} ${varName}`);
    if (!exists) missingVars++;
  });

  if (missingVars > 0) {
    console.log('\n⚠️  Missing environment variables in .env file\n');
  }

  // Check for default JWT_SECRET
  if (envContent.includes('your-super-secret-jwt-key-change-in-production')) {
    console.log('\n⚠️  WARNING: Using default JWT_SECRET! Change this for production.\n');
  }
} else {
  console.log('❌ .env file not found!\n');
}

// Check node_modules
console.log('\n📚 Checking node_modules...\n');

const nodeModulesPath = join(__dirname, 'node_modules');
if (existsSync(nodeModulesPath)) {
  console.log('✅ node_modules exists\n');
} else {
  console.log('❌ node_modules not found! Run: npm install\n');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Verification Summary:\n');

if (missingFiles === 0) {
  console.log('✅ All required files present');
} else {
  console.log(`❌ ${missingFiles} file(s) missing`);
}

if (!existsSync(nodeModulesPath)) {
  console.log('❌ Dependencies not installed');
  console.log('\n💡 Next step: Run "npm install"\n');
} else if (!existsSync(envPath)) {
  console.log('❌ Environment file missing');
  console.log('\n💡 Next step: Create .env file\n');
} else {
  console.log('✅ Dependencies installed');
  console.log('✅ Environment configured');
  console.log('\n🚀 Ready to start! Run "npm run dev"\n');
  console.log('📝 Don\'t forget to:');
  console.log('   1. Start MongoDB');
  console.log('   2. Run "npm run seed" to load achievements');
  console.log('   3. Test with: http://localhost:5000/api/health\n');
}

console.log('='.repeat(50) + '\n');
