import VersionManager from './version-manager.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const manager = new VersionManager();

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  while (true) {
    console.log('\nVersion Management System');
    console.log('1. Create new version');
    console.log('2. List versions');
    console.log('3. Restore version');
    console.log('4. Exit');

    const choice = await question('\nSelect an option (1-4): ');

    switch (choice) {
      case '1': {
        const name = await question('Enter version name: ');
        const description = await question('Enter version description (optional): ');
        await manager.createSnapshot(name, description);
        break;
      }
      case '2': {
        const versions = manager.listVersions();
        console.log('\nAvailable versions:');
        versions.forEach((version, index) => {
          console.log(`\n${index + 1}. ${version.name}`);
          console.log(`   Created: ${version.created}`);
          console.log(`   Description: ${version.description || 'N/A'}`);
          console.log(`   Directory: ${version.directory}`);
        });
        break;
      }
      case '3': {
        const versions = manager.listVersions();
        console.log('\nAvailable versions:');
        versions.forEach((version, index) => {
          console.log(`${index + 1}. ${version.name} (${version.created})`);
        });
        const versionIndex = parseInt(await question('\nSelect version to restore (number): ')) - 1;
        
        if (versionIndex >= 0 && versionIndex < versions.length) {
          const confirm = await question(
            `Are you sure you want to restore "${versions[versionIndex].name}"? This will overwrite current files (y/N): `
          );
          
          if (confirm.toLowerCase() === 'y') {
            await manager.restoreVersion(versions[versionIndex].directory);
          }
        } else {
          console.log('Invalid version selected');
        }
        break;
      }
      case '4': {
        rl.close();
        return;
      }
      default: {
        console.log('Invalid option');
      }
    }
  }
}

main().catch(console.error);