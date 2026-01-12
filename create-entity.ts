import * as fs from "fs";
import * as path from "path";

const entityName = process.argv[2];

if (!entityName) {
  console.error("❌ Debes proporcionar el nombre de la entidad");
  console.error("👉 Ejemplo: node tools/create-entity.js user");
  process.exit(1);
}

const basePath = path.join("src/app/modules", entityName);

const structure = [
  "_graphql",
  "component",
  `component/${entityName}_form`,
  `component/${entityName}_list`,
  "i18n",
  "model",
  "service"
];

function createFolder(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`📁 creada: ${folderPath}`);
  }
}

function createFile(filePath: string, content = "") {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`📄 creado: ${filePath}`);
  }
}

console.log(`\n🚀 Generando estructura para entidad: ${entityName}\n`);

structure.forEach(folder => createFolder(path.join(basePath, folder)));

createFile(path.join(basePath, "routes.ts")) // routes for ${entityName});
const fileName = `${entityName}-management.page.ts`;
createFile(path.join(basePath, fileName));

console.log("\n✅ Finalizado correctamente!\n");
