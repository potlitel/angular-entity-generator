import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

const entityName = process.argv[2];
const shouldConfirm = process.argv[3] === "--confirm";

if (!entityName) {
  console.error("❌ Debes proporcionar el nombre de la entidad");
  console.error("👉 Ejemplo: node tools/create-entity.js user");
  process.exit(1);
}

// Función para preguntar confirmación
async function confirmCreation(entityName: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`¿Confirmar creación de la entidad '${entityName}'? (sí/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'sí' || answer.toLowerCase() === 'si');
    });
  });
}

async function main() {
  if (!entityName) {
    console.error("❌ Debes proporcionar el nombre de la entidad");
    console.error("👉 Ejemplo: node tools/create-entity.js user");
    process.exit(1);
  }

  if (shouldConfirm) {
    const confirmed = await confirmCreation(entityName);
    if (!confirmed) {
      console.log("❌ Creación cancelada por el usuario");
      process.exit(0);
    }
  }

  // Resto de tu código aquí...
  console.log(`🚀 Generando estructura para entidad: ${entityName}\n`);

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

// Función para capitalizar la primera letra
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para convertir a camelCase
function toCamelCase(str: string): string {
  if (!str || typeof str !== 'string') return '';

  // Eliminar underscores iniciales y convertir a camelCase
  return str
    .toLowerCase()
    .replace(/^_+|_+$/g, '') // Eliminar underscores al inicio y final
    .replace(/_+([a-z])/g, (match: string, letter: string): string => {
      return letter ? letter.toUpperCase() : '';
    })
    .replace(/_+/g, ''); // Eliminar cualquier underscore restante
}

// Función para convertir a PascalCase
function toPascalCase(str: string): string {
  const camelCase = toCamelCase(str);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

// Función para pluralizar (reglas básicas)
function pluralize(str: string): string {
  const singular = toCamelCase(str);
  const pascal = toPascalCase(str);

  // Reglas básicas de pluralización en inglés
  if (singular.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(singular.charAt(singular.length - 2))) {
    return singular.slice(0, -1) + 'ies';
  } else if (singular.endsWith('s') || singular.endsWith('x') || singular.endsWith('z') ||
             singular.endsWith('ch') || singular.endsWith('sh')) {
    return singular + 'es';
  } else {
    return singular + 's';
  }
}

// Función para pluralizar en PascalCase
function pluralizePascal(str: string): string {
  const singular = toPascalCase(str);
  const plural = pluralize(str);
  return plural.charAt(0).toUpperCase() + plural.slice(1);
}

console.log(`\n🚀 Generando estructura para entidad: ${entityName}\n`);

// Crear carpetas
structure.forEach(folder => createFolder(path.join(basePath, folder)));

// Archivos principales
createFile(path.join(basePath, "routes.ts")); // routes for ${entityName}
const fileName = `${entityName}-management.page.ts`;
createFile(path.join(basePath, fileName));

// Obtener nombres transformados
const entityNameCamel = toCamelCase(entityName);
const entityNamePascal = toPascalCase(entityName);
const entityNameUpper = entityName.toUpperCase();
const entityNamePlural = pluralize(entityName);
const entityNamePluralPascal = pluralizePascal(entityName);

// 1. _graphql/entity-operations.graphql
const graphqlContent = `query get${entityNamePluralPascal}(
  $page: Int
  $itemsPerPage: Int
  $name: String
  $order: [${entityNamePascal}Filter_order]
  $active: Boolean
) {
  ${entityNamePlural}(
    page: $page
    name: $name
    order: $order
    itemsPerPage: $itemsPerPage
    active: $active
  ) {
    paginationInfo {
      itemsPerPage
      lastPage
      totalCount
    }
    collection {
      id
      name
      active
      roles
    }
  }
}

query get${entityNamePascal}($id: ID!) {
  ${entityNameCamel}(id: $id) {
    id
    name
    roles
    active
  }
}

mutation create${entityNamePascal}($input: ${entityNamePascal}Input!) {
  create${entityNamePascal}(input: $input) {
    ${entityNameCamel} {
      id
      name
      active
      roles
    }
  }
}

mutation update${entityNamePascal}($id: ID!, $input: ${entityNamePascal}Input!) {
  update${entityNamePascal}(id: $id, input: $input) {
    ${entityNameCamel} {
      id
      name
      active
      roles
    }
  }
}

mutation delete${entityNamePascal}($id: ID!) {
  delete${entityNamePascal}(id: $id) {
    success
  }
}

mutation toggle${entityNamePascal}Active($id: ID!, $active: Boolean!) {
  toggle${entityNamePascal}Active(id: $id, active: $active) {
    ${entityNameCamel} {
      id
      active
    }
  }
}`;

createFile(
  path.join(basePath, "_graphql", `${entityName}-operations.graphql`),
  graphqlContent
);

// 2. component/entity_name-form files
const formComponentPath = path.join(basePath, `component/${entityName}_form`);

// entity_name.component.ts
const formComponentTs = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-${entityNameCamel}-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './${entityName}.component.html',
  styleUrls: ['./${entityName}.component.scss']
})
export class ${entityNamePascal}FormComponent {
  ${entityNameCamel}Form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.${entityNameCamel}Form = this.fb.group({
      name: ['', Validators.required],
      active: [true]
    });
  }

  onSubmit() {
    if (this.${entityNameCamel}Form.valid) {
      console.log('Form submitted:', this.${entityNameCamel}Form.value);
    }
  }
}`;
createFile(
  path.join(formComponentPath, `${entityName}.component.ts`),
  formComponentTs
);

// entity_name.component.html
const formComponentHtml = `<div class="${entityNameCamel}-form-container">
  <h2>{{ '${entityNameUpper}.LABEL.SINGULAR' | translate }}</h2>

  <form [formGroup]="${entityNameCamel}Form" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="name">{{ '${entityNameUpper}.FIELD.NAME' | translate }}</label>
      <input
        type="text"
        id="name"
        formControlName="name"
        class="form-control"
        [class.is-invalid]="${entityNameCamel}Form.get('name')?.invalid && ${entityNameCamel}Form.get('name')?.touched">
      <div *ngIf="${entityNameCamel}Form.get('name')?.invalid && ${entityNameCamel}Form.get('name')?.touched" class="invalid-feedback">
        {{ '${entityNameUpper}.FIELD.NAME' | translate }} es requerido
      </div>
    </div>

    <div class="form-group">
      <label for="active">{{ '${entityNameUpper}.FIELD.ACTIVE' | translate }}</label>
      <input
        type="checkbox"
        id="active"
        formControlName="active">
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" [disabled]="${entityNameCamel}Form.invalid">
        Guardar
      </button>
      <button type="button" class="btn btn-secondary">
        Cancelar
      </button>
    </div>
  </form>
</div>`;
createFile(
  path.join(formComponentPath, `${entityName}.component.html`),
  formComponentHtml
);

// entity_name.component.scss
const formComponentScss = `.${entityNameCamel}-form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 2rem;
    color: #333;
    text-align: center;
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
      }

      &.is-invalid {
        border-color: #dc3545;
      }
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &-primary {
        background-color: #007bff;
        color: white;

        &:hover:not(:disabled) {
          background-color: #0056b3;
        }

        &:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
      }

      &-secondary {
        background-color: #6c757d;
        color: white;

        &:hover {
          background-color: #545b62;
        }
      }
    }
  }
}`;
createFile(
  path.join(formComponentPath, `${entityName}.component.scss`),
  formComponentScss
);

// 3. component/entity_name-list files
const listComponentPath = path.join(basePath, `component/${entityName}_list`);

// entity_name-list.component.ts
const listComponentTs = `import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ${entityNamePascal}GraphqlRepository } from '../../service/${entityName}.graphql.repository';

@Component({
  selector: 'app-${entityNameCamel}-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${entityName}-list.component.html',
  styleUrls: ['./${entityName}-list.component.scss']
})
export class ${entityNamePascal}ListComponent implements OnInit {
  ${entityNamePlural}: any[] = [];
  loading = false;

  constructor(private ${entityNameCamel}Repository: ${entityNamePascal}GraphqlRepository) {}

  ngOnInit(): void {
    this.load${entityNamePluralPascal}();
  }

  load${entityNamePluralPascal}(): void {
    this.loading = true;
    // Implementar la lógica de carga aquí
    setTimeout(() => {
      this.${entityNamePlural} = [
        { id: '1', name: '${entityNamePascal} 1', active: true },
        { id: '2', name: '${entityNamePascal} 2', active: false }
      ];
      this.loading = false;
    }, 1000);
  }

  toggleActive(id: string, currentValue: boolean): void {
    this.${entityNameCamel}Repository.toggleState(id, currentValue).subscribe();
  }

  delete${entityNamePascal}(id: string): void {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      this.${entityNameCamel}Repository.deleteInstance(id).subscribe();
    }
  }
}`;
createFile(
  path.join(listComponentPath, `${entityName}-list.component.ts`),
  listComponentTs
);

// entity_name-list.component.html
const listComponentHtml = `<div class="${entityNameCamel}-list-container">
  <h2>{{ '${entityNameUpper}.LIST.TITLE' | translate }}</h2>

  <div *ngIf="loading" class="loading-spinner">
    Cargando...
  </div>

  <div *ngIf="!loading">
    <table class="${entityNameCamel}-table">
      <thead>
        <tr>
          <th>{{ '${entityNameUpper}.FIELD.NAME' | translate }}</th>
          <th>{{ '${entityNameUpper}.FIELD.ACTIVE' | translate }}</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of ${entityNamePlural}">
          <td>{{ item.name }}</td>
          <td>
            <span [class.active]="item.active" [class.inactive]="!item.active">
              {{ item.active ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td class="actions">
            <button class="btn btn-sm btn-primary" (click)="toggleActive(item.id, item.active)">
              {{ item.active ? 'Desactivar' : 'Activar' }}
            </button>
            <button class="btn btn-sm btn-danger" (click)="delete${entityNamePascal}(item.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div *ngIf="${entityNamePlural}.length === 0" class="no-data">
      No hay ${entityNamePlural} registrados
    </div>
  </div>
</div>`;
createFile(
  path.join(listComponentPath, `${entityName}-list.component.html`),
  listComponentHtml
);

// entity_name-list.component.scss
const listComponentScss = `.${entityNameCamel}-list-container {
  padding: 2rem;

  h2 {
    margin-bottom: 2rem;
    color: #333;
  }

  .loading-spinner {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  .${entityNameCamel}-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);

    thead {
      background-color: #f8f9fa;

      th {
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #495057;
        border-bottom: 2px solid #dee2e6;
      }
    }

    tbody {
      tr {
        &:hover {
          background-color: #f8f9fa;
        }

        td {
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
          color: #212529;

          span {
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.875rem;

            &.active {
              background-color: #d4edda;
              color: #155724;
            }

            &.inactive {
              background-color: #f8d7da;
              color: #721c24;
            }
          }
        }
      }
    }

    .actions {
      display: flex;
      gap: 0.5rem;

      .btn {
        padding: 0.375rem 0.75rem;
        border: none;
        border-radius: 4px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: opacity 0.2s;

        &-sm {
          padding: 0.25rem 0.5rem;
        }

        &-primary {
          background-color: #007bff;
          color: white;

          &:hover {
            opacity: 0.9;
          }
        }

        &-danger {
          background-color: #dc3545;
          color: white;

          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
  }

  .no-data {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
    background: #fff;
    border-radius: 8px;
    margin-top: 1rem;
  }
}`;
createFile(
  path.join(listComponentPath, `${entityName}-list.component.scss`),
  listComponentScss
);

// 4. i18n/locale.ts
const i18nContent = `import { ICrudLocale } from '../../../i18n/interface';

export const ${entityNameUpper}_MANAGEMENT_LOCALE_ES: ICrudLocale = {
  ${entityNameUpper}: {
    FIELD: {
      NAME: 'Nombre',
      ACTIVE: 'Activo',
      ROLES: 'Roles',
    },
    LABEL: {
      SINGULAR: '${entityNamePascal}',
      PLURAL: '${entityNamePluralPascal}',
    },
    LIST: {
      TITLE: 'Listado de ${entityNamePlural}',
    },
  },
};

export const ${entityNameUpper}_MANAGEMENT_LOCALE_EN: ICrudLocale = {
  ${entityNameUpper}: {
    FIELD: {
      NAME: 'Name',
      ACTIVE: 'Active',
      ROLES: 'Roles',
    },
    LABEL: {
      SINGULAR: '${entityNamePascal}',
      PLURAL: '${entityNamePluralPascal}',
    },
    LIST: {
      TITLE: 'List of ${entityNamePlural}',
    },
  },
};`;
createFile(
  path.join(basePath, "i18n", "locale.ts"),
  i18nContent
);

// 5. model/entity_name.schema.ts
const schemaContent = `import { type } from 'arktype';

export const ${entityNameCamel}MutationSchema = type({
  'id?': 'string',
  name: 'string',
  roles: 'string[]',
  active: 'boolean = true',
  '+': 'delete',
});`;
createFile(
  path.join(basePath, "model", `${entityName}.schema.ts`),
  schemaContent
);

// 6. model/entity_name.types.ts
const typesContent = `import { Get${entityNamePascal}Query, Get${entityNamePluralPascal}Query } from '@graphql-types';
import { InferQueryType } from '../../../shared/types/graphql';

export const ${entityNamePascal}ApiResourceName = '${entityNamePascal}' as const;

export type ${entityNamePascal}Query = InferQueryType<Get${entityNamePascal}Query['${entityNameCamel}']>;
export type ${entityNamePluralPascal}Query = InferQueryType<Get${entityNamePluralPascal}Query['${entityNamePlural}']>;`;
createFile(
  path.join(basePath, "model", `${entityName}.types.ts`),
  typesContent
);

// 7. service/entity_name.graphql.repository.ts
const repositoryContent = `import {
  Delete${entityNamePascal}Input,
  Get${entityNamePluralPascal}Document,
  Update${entityNamePascal}Input,
} from '@graphql-types';
import { GraphqlCRUDTableService } from '@shared/crud-table/services/graphql.crud.table.service';
import type { WatchQueryOptionsExtendedType } from '@shared/crud-table/services/graphql.table.service';
import {
  ApolloMutationResult,
  MUTATION_ACTION,
} from '../../../shared/services/apollo-helper.service';
import { ${entityNamePascal}ApiResourceName, ${entityNamePluralPascal}Query } from '../model/${entityName}.types';

export class ${entityNamePascal}GraphqlRepository extends GraphqlCRUDTableService<${entityNamePluralPascal}Query> {
  configureQueryOptions(): WatchQueryOptionsExtendedType {
    return {
      query: Get${entityNamePluralPascal}Document,
    };
  }

  deleteInstance(id: string): Promise<ApolloMutationResult> {
    return this.mutate<Delete${entityNamePascal}Input>({
      action: MUTATION_ACTION.delete,
      instance: ${entityNamePascal}ApiResourceName,
      enabledSecurity: true,
      variables: { id },
    });
  }

  toggleState(id: string, currentValue: boolean) {
    return this.mutate<Update${entityNamePascal}Input>({
      action: MUTATION_ACTION.update,
      instance: ${entityNamePascal}ApiResourceName,
      variables: { id, active: currentValue },
      isLoading$: this.isLoading$,
      enabledSecurity: true,
    });
  }
}`;
createFile(
  path.join(basePath, "service", `${entityName}.graphql.repository.ts`),
  repositoryContent
);

console.log("\n✅ Finalizado correctamente! Todos los archivos han sido creados.\n");
console.log(`📊 Resumen de nombres generados:`);
console.log(`  • Singular (camelCase): ${entityNameCamel}`);
console.log(`  • Singular (PascalCase): ${entityNamePascal}`);
console.log(`  • Plural: ${entityNamePlural}`);
console.log(`  • Plural (PascalCase): ${entityNamePluralPascal}`);
console.log(`  • Constante: ${entityNameUpper}`);

}

// Ejecutar
main().catch(console.error);
