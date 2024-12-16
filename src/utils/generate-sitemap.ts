import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemap } from './sitemapGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate env name to prevent directory traversal
const isValidEnv = (env: string): boolean => {
  const validEnvs = ['development', 'staging', 'production'];
  return validEnvs.includes(env);
};

// Get absolute path with validation
const getEnvPath = (env: string): string => {
  if (!isValidEnv(env)) {
    throw new Error(`Invalid environment: ${env}`);
  }
  return path.resolve(__dirname, `../../.env.${env}`);
};

async function main() {
  try {
    const mode = process.env.MODE || process.env.NODE_ENV || 'production';
    const gitBranch = process.env.GITHUB_REF_NAME || mode;
    type BranchEnv = 'main' | 'staging' | 'development';
    const envMap: Record<BranchEnv, string> = {
      main: 'production',
      staging: 'staging',
      development: 'development',
    };

    const env =
      mode === 'production'
        ? 'production'
        : envMap[gitBranch as BranchEnv] || 'development';
    const envPath = getEnvPath(env);

    // These files are within our app directory and only accessed during build
    /* eslint-disable security/detect-non-literal-fs-filename */
    const envConfig = fs.existsSync(envPath)
      ? Object.fromEntries(
          fs
            .readFileSync(envPath, 'utf-8')
            .split('\n')
            .filter(Boolean)
            .map((line) => line.split('=')),
        )
      : {};
    /* eslint-enable security/detect-non-literal-fs-filename */

    const baseUrl = envConfig.VITE_PUBLIC_URL;
    const sitemap = await generateSitemap(baseUrl);
    const sitemapPath = path.resolve(__dirname, '../../public/sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`Sitemap generated for ${env} environment`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

main();
