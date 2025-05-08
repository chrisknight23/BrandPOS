#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create directory structure
const createDirectories = () => {
  if (!fs.existsSync('src/screens/tipping')) {
    fs.mkdirSync('src/screens/tipping', { recursive: true });
    console.log('Created src/screens/tipping directory');
  }
};

// Copy files with updated imports
const copyFileWithImportUpdates = (sourceFile, targetFile) => {
  let content = fs.readFileSync(sourceFile, 'utf8');
  
  // Update import paths for moved files
  content = content.replace(
    /from ['"]\.\.\/\.\.\/components\//g, 
    'from \'../components/'
  );
  
  content = content.replace(
    /from ['"]\.\.\/\.\.\/context\//g, 
    'from \'../context/'
  );
  
  content = content.replace(
    /from ['"]\.\.\/\.\.\/hooks\//g, 
    'from \'../hooks/'
  );
  
  content = content.replace(
    /from ['"]\.\.\/\.\.\/types\//g, 
    'from \'../types/'
  );
  
  content = content.replace(
    /from ['"]\.\.\/\.\.\/assets\//g, 
    'from \'../assets/'
  );
  
  // Special case for tipping folder
  if (targetFile.includes('tipping/')) {
    content = content.replace(
      /from ['"]\.\.\/components\//g, 
      'from \'../../components/'
    );
    
    content = content.replace(
      /from ['"]\.\.\/context\//g, 
      'from \'../../context/'
    );
    
    content = content.replace(
      /from ['"]\.\.\/hooks\//g, 
      'from \'../../hooks/'
    );
    
    content = content.replace(
      /from ['"]\.\.\/types\//g, 
      'from \'../../types/'
    );
    
    content = content.replace(
      /from ['"]\.\.\/assets\//g, 
      'from \'../../assets/'
    );
  }
  
  fs.writeFileSync(targetFile, content);
  console.log(`Copied and updated: ${sourceFile} -> ${targetFile}`);
};

// Create the root index.ts file
const createIndexFile = () => {
  const content = `import { Home } from './Home';
import { Cart } from './Cart';
import { Payment } from './Payment';
import { Auth } from './Auth';
import { Tipping } from './tipping/Tipping';
import { CustomTip } from './tipping/CustomTip';
import { Cashback } from './Cashback';
import { Cashout } from './Cashout';
import { End } from './End';

export {
  Home,
  Cart,
  Payment,
  Auth,
  Tipping,
  Cashback,
  CustomTip,
  Cashout,
  End,
};`;

  fs.writeFileSync('src/screens/index.ts', content);
  console.log('Created src/screens/index.ts');
};

// Main restructuring function
const restructureScreens = () => {
  console.log('Starting screens restructuring...');
  
  createDirectories();
  
  // Copy auth screen
  copyFileWithImportUpdates(
    'src/screens/auth/Auth.tsx',
    'src/screens/Auth.tsx'
  );
  
  // Copy checkout screens
  const checkoutFiles = [
    'Home.tsx',
    'Cart.tsx',
    'Payment.tsx',
    'Cashback.tsx',
    'Cashout.tsx',
    'End.tsx'
  ];
  
  checkoutFiles.forEach(file => {
    copyFileWithImportUpdates(
      `src/screens/checkout/${file}`,
      `src/screens/${file}`
    );
  });
  
  // Copy tipping-related screens
  copyFileWithImportUpdates(
    'src/screens/checkout/Tipping.tsx',
    'src/screens/tipping/Tipping.tsx'
  );
  
  copyFileWithImportUpdates(
    'src/screens/checkout/CustomTip.tsx',
    'src/screens/tipping/CustomTip.tsx'
  );
  
  // Create index file
  createIndexFile();
  
  // Update MainView.tsx import
  const mainViewPath = 'src/components/MainView.tsx';
  let mainViewContent = fs.readFileSync(mainViewPath, 'utf8');
  mainViewContent = mainViewContent.replace(
    /import \* as screens from ['"]\.\.\/screens\/checkout['"]/,
    'import * as screens from \'../screens\''
  );
  fs.writeFileSync(mainViewPath, mainViewContent);
  console.log('Updated MainView.tsx imports');
  
  console.log('Restructuring complete! Please test the application to ensure everything works.');
  console.log('If there are any issues, you can revert with: git checkout -- src/');
};

restructureScreens(); 