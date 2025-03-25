import PocketBase from "pocketbase";
import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;
const utilsPath = path.join(__dirname, "../queens-game-linkedin/src/utils");

// cleanup all files in data folder
fs.rmSync(path.join(__dirname, "data"), { recursive: true, force: true });

// create data folder
fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });

// copy levels.js to ./data
const levelsPath = path.join(__dirname, "data", "levels.js");
fs.copyFileSync(path.join(utilsPath, "levels.js"), levelsPath);

// copy colors.js to ./data
const colorsPath = path.join(__dirname, "data", "colors");
fs.copyFileSync(path.join(utilsPath, "colors.js"), colorsPath);

// copy levels folder to ./data
const levelsFolderPath = path.join(__dirname, "data", "levels");
fs.cpSync(path.join(utilsPath, "levels"), levelsFolderPath, {
  recursive: true,
});

const pb = new PocketBase(process.env.PB_URL);
await pb
  .collection("_superusers")
  .authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD);

// save all levels in levels folder to pocketbase
const levels = fs.readdirSync(levelsFolderPath);

for (const level of levels) {
  // import level from level.js
  const levelData = await import(path.join(levelsFolderPath, level));
  const levelName = level.replace(".js", "");
  if (levelName === "level-sample") {
    continue;
  }

  const existingLevels = await pb
    .collection("levels")
    .getFullList({ filter: `name="${levelName}"` });
  if (existingLevels.length > 0) {
    console.log(`Level ${levelName} already exists`);
    continue;
  }

  await pb.collection("levels").create({
    name: levelName,
    ...levelData.default,
  });
}

console.log("Levels imported successfully");
