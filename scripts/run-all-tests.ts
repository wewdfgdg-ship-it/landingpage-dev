import { readdirSync } from 'fs';
import { join } from 'path';

async function runAll() {
  const dir = join(process.cwd(), 'scripts');
  const files = readdirSync(dir).filter(f => f.startsWith('test-') && f.endsWith('.ts'));

  const failed = [];
  
  for (const file of files) {
    if (file === 'test-all-templates.ts' || file === 'test-pipeline.ts' || file === 'test-renderers.ts' || file.includes('e2e')) {
        continue; // skip meta tests
    }
    
    try {
      console.log(`[BUILD] Running ${file}...`);
      await import(`./${file}`);
    } catch (e) {
      console.error(`[ERROR] Failed to run ${file}:`, e);
      failed.push(file);
    }
  }
  
  console.log('\\n✅ All test scripts processed!');
  if (failed.length > 0) {
      console.log('Failed:', failed);
  }
}

runAll();
