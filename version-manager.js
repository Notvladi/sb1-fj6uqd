import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class VersionManager {
  constructor() {
    this.versionsDir = path.join(__dirname, 'versions');
    this.ensureVersionsDirectory();
  }

  ensureVersionsDirectory() {
    if (!fs.existsSync(this.versionsDir)) {
      fs.mkdirSync(this.versionsDir, { recursive: true });
    }
  }

  async createSnapshot(name, description = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const versionDir = path.join(this.versionsDir, `${timestamp}_${name}`);
    
    // Create version directory
    fs.mkdirSync(versionDir, { recursive: true });

    // Create metadata file
    const metadata = {
      name,
      description,
      timestamp,
      created: new Date().toISOString()
    };
    fs.writeFileSync(
      path.join(versionDir, 'version.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Copy source files
    const srcDir = path.join(__dirname, 'src');
    await this.copyDirectory(srcDir, path.join(versionDir, 'src'));

    // Copy configuration files
    const configFiles = [
      'package.json',
      'vite.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'jsconfig.json'
    ];

    for (const file of configFiles) {
      if (fs.existsSync(path.join(__dirname, file))) {
        fs.copyFileSync(
          path.join(__dirname, file),
          path.join(versionDir, file)
        );
      }
    }

    console.log(`Created version snapshot: ${name} (${timestamp})`);
    return versionDir;
  }

  async copyDirectory(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  listVersions() {
    if (!fs.existsSync(this.versionsDir)) {
      return [];
    }

    return fs.readdirSync(this.versionsDir)
      .filter(dir => {
        const versionJsonPath = path.join(this.versionsDir, dir, 'version.json');
        return fs.existsSync(versionJsonPath);
      })
      .map(dir => {
        const versionJsonPath = path.join(this.versionsDir, dir, 'version.json');
        const metadata = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
        return {
          directory: dir,
          ...metadata
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  async restoreVersion(versionDir) {
    const srcVersionDir = path.join(this.versionsDir, versionDir);
    
    if (!fs.existsSync(srcVersionDir)) {
      throw new Error(`Version ${versionDir} not found`);
    }

    // Restore source files
    await this.copyDirectory(
      path.join(srcVersionDir, 'src'),
      path.join(__dirname, 'src')
    );

    // Restore configuration files
    const configFiles = [
      'package.json',
      'vite.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'jsconfig.json'
    ];

    for (const file of configFiles) {
      const srcFile = path.join(srcVersionDir, file);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.join(__dirname, file));
      }
    }

    console.log(`Restored version: ${versionDir}`);
  }
}

export default VersionManager;