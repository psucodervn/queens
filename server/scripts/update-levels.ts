#!/usr/bin/env bun

import { join } from "path";
import { tmpdir } from "os";
import { mkdtemp, rm } from "fs/promises";
import fs from "fs-extra";
import simpleGit from "simple-git";

// Default config (can be overridden by CLI args)
const DEFAULT_REPO = "https://github.com/samimsu/queens-game-linkedin.git";
const DEFAULT_FILES = [
  {
    src: "src/utils/levels.ts",
    dest: "levels.ts",
  },
  {
    src: "src/utils/types.ts",
    dest: "types.ts",
  },
  {
    src: "src/utils/colors.ts",
    dest: "colors.ts",
  },
  {
    src: "src/utils/levels/",
    dest: "levels/",
  },
];

// Parse CLI args
const args = process.argv.slice(2);
let repo = DEFAULT_REPO;
let files = [...DEFAULT_FILES];
let target = "./src/game";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--repo" && args[i + 1]) repo = args[++i];
  else if (args[i] === "--target" && args[i + 1]) target = args[++i];
}

async function main() {
  // 1. Create a temp dir
  const tempDir = await mkdtemp(join(tmpdir(), "update-levels-"));
  try {
    // 2. Clone repo
    const git = simpleGit();
    await git.clone(repo, tempDir);

    // 3. Copy files
    for (const file of files) {
      const src = join(tempDir, file.src);
      const dest = join(target, file.dest);
      // await fs.ensureDir(dest);
      if (!(await fs.pathExists(src))) {
        console.error(`File not found in repo: ${file.src}`);
        continue;
      }
      await fs.copy(src, dest);
      console.log(`Copied ${file.src} -> ${dest}`);
    }
  } finally {
    // 4. Cleanup
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
