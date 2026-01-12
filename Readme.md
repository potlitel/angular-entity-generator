# Angular Entity Generator Script

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![VS Code](https://img.shields.io/badge/VS_Code-1.85+-blue)](https://code.visualstudio.com/)
[![Angular](https://img.shields.io/badge/Angular-15+-red)](https://angular.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Un script TypeScript para generar automáticamente módulos de entidades Angular completos directamente desde Visual Studio Code. Este script crea toda la estructura necesaria para una entidad: componentes, servicios, modelos, GraphQL e internacionalización.

## ✨ Características

-   🚀 Generación con un comando - Crea estructuras de entidades completas desde VS Code
    
-   📁 Estructura de carpetas completa - Todos los directorios y archivos necesarios
    
-   📝 Plantillas preconfiguradas - Componentes listos para usar
    
-   🌍 Soporte i18n integrado - Archivos de localización automáticos
    
-   🗃️ Listo para GraphQL - Repository, queries y mutations
    
-   🎨 Estilos SCSS - Arquitectura CSS moderna
    
-   🔧 TypeScript completo - Totalmente tipado y seguro
    
-   ⌨️ Integración VS Code - Tasks y atajos de teclado
    

## 📦 Requisitos Previos

-   [Node.js](https://nodejs.org/) 18 o superior
    
-   [TypeScript](https://www.typescriptlang.org/) 5.0 o superior
    
-   [Visual Studio Code](https://code.visualstudio.com/) 1.85 o superior
    
-   Proyecto Angular 15+ con estructura de módulos
    

## 🚀 Configuración Rápida

### 1\. Instalar dependencias

```bash
npm install --save-dev typescript @types/node
npm install -g ts-node  # o localmente: npm install --save-dev ts-node
```

### 2\. Copiar el script

Coloca el archivo `create-entity.ts` en la carpeta `tools/` de tu proyecto Angular:

```text
tu-proyecto-angular/
├── tools/
│   └── create-entity.ts    # ← Este script
├── src/
│   └── app/
├── .vscode/               # ← Carpeta de configuración VS Code
└── package.json
```

### 3\. Configurar VS Code

Crea o edita el archivo `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "📁 Crear Entidad Angular",
      "type": "shell",
      "command": "npx ts-node tools/create-entity.ts ${input:entityName} --confirm",
      "group": {
        "kind": "build",
        "isDefault": false
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": false,
        "clear": true
      },
      "problemMatcher": [],
      "detail": "Genera una nueva entidad Angular completa con todos sus componentes"
    }
  ],
  "inputs": [
    {
      "id": "entityName",
      "type": "promptString",
      "description": "📝 Nombre de la entidad (ej: user, product, user_role):",
      "default": "user"
    }
  ]
}

```

### 4\. Configurar atajos de teclado (opcional)

Añade a `.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+e",
    "command": "workbench.action.tasks.runTask",
    "args": "📁 Crear Entidad Angular",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+alt+e",
    "command": "workbench.action.tasks.runTask",
    "args": "🔧 Ejecutar TSC (TypeScript Compiler)",
    "when": "editorTextFocus"
  }
]
```

## 📝 Uso

### Método 1: Desde VS Code (Recomendado)

1.  Presiona `Ctrl+Shift+P` (Windows/Linux) o `Cmd+Shift+P` (Mac)
    
2.  Escribe "Tasks: Run Task"
    
3.  Selecciona "📁 Crear Entidad Angular"
    
4.  Ingresa el nombre de la entidad cuando se solicite
    
5.  Confirma la creación
    

### Método 2: Desde la terminal

```bash
# Usando ts-node directamente
npx ts-node tools/create-entity.ts user

# O compilando primero
npx tsc tools/create-entity.ts --outDir dist --module commonjs --target es2020
node dist/create-entity.js user
```

### Método 3: Desde la Terminal de VS Code

1.  Abre la Terminal en VS Code (\`Ctrl+\`\`)
    
2.  Ejecuta:

```bash
npm run generate -- user
```

## 📁 Estructura Generada

Para una entidad llamada `user`, el script crea:

```bash
src/app/modules/user/
├── _graphql/
│   └── user-operations.graphql          # Queries y mutations GraphQL
├── component/
│   ├── user_form/
│   │   ├── user.component.html          # Template del formulario
│   │   ├── user.component.scss          # Estilos del formulario
│   │   └── user.component.ts            # Lógica del formulario
│   └── user_list/
│       ├── user-list.component.html     # Template de la lista
│       ├── user-list.component.scss     # Estilos de la lista
│       └── user-list.component.ts       # Lógica de la lista
├── i18n/
│   └── locale.ts                        # Traducciones ES/EN
├── model/
│   ├── user.schema.ts                   # Esquema de validación
│   └── user.types.ts                    # Tipos TypeScript
├── service/
│   └── user.graphql.repository.ts       # Servicio GraphQL
├── routes.ts                            # Rutas del módulo
└── user-management.page.ts              # Página principal
```

## 🎯 Ejemplos de Uso

### Ejemplo 1: Entidad simple "user"


```text
Nombre de la entidad: user
```

Resultado:

-   Archivos GraphQL: `getUser`, `getUsers`
    
-   Servicio: `UserGraphqlRepository`
    
-   Componentes: `UserFormComponent`, `UserListComponent`
    
-   Tipos: `UserQuery`, `UsersQuery`
    
-   Constantes: `USER_MANAGEMENT_LOCALE_ES`, `USER_MANAGEMENT_LOCALE_EN`
    

### Ejemplo 2: Entidad "category"

```text
Nombre de la entidad: category
```

Resultado:

-   Archivos GraphQL: `getCategory`, `getCategories`
    
-   Servicio: `CategoryGraphqlRepository`
    
-   Componentes: `CategoryFormComponent`, `CategoryListComponent`
    
-   Tipos: `CategoryQuery`, `CategoriesQuery`
    
-   Constantes: `CATEGORY_MANAGEMENT_LOCALE_ES`, `CATEGORY_MANAGEMENT_LOCALE_EN`

### Ejemplo 3: Entidad "product"


```text
Nombre de la entidad: product
```

Resultado:

-   Archivos GraphQL: `getProduct`, `getProducts`
    
-   Servicio: `ProductGraphqlRepository`
    
-   Componentes: `ProductFormComponent`, `ProductListComponent`
    
-   Tipos: `ProductQuery`, `ProductsQuery`
    
-   Constantes: `PRODUCT_MANAGEMENT_LOCALE_ES`, `PRODUCT_MANAGEMENT_LOCALE_EN`

### Ejemplo 4: Entidad compuesta "user\_role"

```text
Nombre de la entidad: user_role
```

Resultado:

-   Archivos GraphQL: `getUserRole`, `getUserRoles`
    
-   Servicio: `UserRoleGraphqlRepository`
    
-   Componentes: `UserRoleFormComponent`, `UserRoleListComponent`
    
-   Tipos: `UserRoleQuery`, `UserRolesQuery`
    
-   Constantes: `USER_ROLE_MANAGEMENT_LOCALE_ES`, `USER_ROLE_MANAGEMENT_LOCALE_EN`
    

### Ejemplo 5: Entidad con nombre complejo "shopping\_cart\_item"

```text
Nombre de la entidad: shopping_cart_item
```

Resultado:

-   Archivos GraphQL: `getShoppingCartItem`, `getShoppingCartItems`
    
-   Servicio: `ShoppingCartItemGraphqlRepository`
    
-   Componentes: `ShoppingCartItemFormComponent`, `ShoppingCartItemListComponent`
    
-   Tipos: `ShoppingCartItemQuery`, `ShoppingCartItemsQuery`
    

## 🔧 Personalización

### Cambiar la ruta base

Edita la línea en `create-entity.ts`:

```bash
// Línea ~17 del script
const basePath = path.join("src/app/modules", entityName);
// Cambiar a:
const basePath = path.join("src/app/features", entityName);
// o
const basePath = path.join("src/app/components/entities", entityName);
```

### Plantillas personalizadas

Puedes modificar los templates directamente en el script. Cada sección de creación de archivos está claramente marcada con comentarios.

## 🐛 Solución de Problemas

### Error: "Cannot find module 'typescript'"

```bash
npm install --save-dev typescript
```

### Error: "ts-node no se reconoce"

```bash
# Instalar ts-node globalmente
npm install -g ts-node

# O usar npx
npx ts-node tools/create-entity.ts user
```

### Error: Permisos en Windows

```bash
# Ejecutar VS Code como administrador
# O en PowerShell:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Task de VS Code no funciona

1.  Verifica que `ts-node` esté instalado
    
2.  Asegúrate que la ruta al script es correcta
    
3.  Revisa la consola de VS Code para mensajes de error
    

## 📄 Scripts NPM Recomendados

Añade estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "generate": "ts-node tools/create-entity.ts",
    "generate:user": "ts-node tools/create-entity.ts user",
    "generate:product": "ts-node tools/create-entity.ts product",
    "generate:category": "ts-node tools/create-entity.ts category",
    "tsc:check": "tsc --noEmit",
    "tsc:build": "tsc tools/create-entity.ts --outDir dist --module commonjs --target es2020"
  }
}
```

## 📊 Características de Nombrado Automático

El script transforma automáticamente los nombres:

| Entrada | camelCase | PascalCase | Plural | UPPERCASE |
| --- | --- | --- | --- | --- |
| `user` | `user` | `User` | `users` | `USER` |
| `user_role` | `userRole` | `UserRole` | `userRoles` | `USER_ROLE` |
| `category` | `category` | `Category` | `categories` | `CATEGORY` |
| `product` | `product` | `Product` | `products` | `PRODUCT` |

## 🤝 Contribuir al Script

1.  Fork el repositorio
    
2.  Crea una rama de características (`git checkout -b feature/nueva-caracteristica`)
    
3.  Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
    
4.  Push a la rama (`git push origin feature/nueva-caracteristica`)
    
5.  Abre un Pull Request
    

## 📞 Soporte

-   Problemas: Revisa la sección de Solución de Problemas arriba
    
-   Sugerencias: Modifica directamente las plantillas en el script
    
-   Personalización: Adapta las constantes y rutas según tu proyecto
    

## 🎉 Consejos de Uso

1.  Backup: Siempre haz commit de tus cambios antes de generar nuevas entidades
    
2.  Revisión: Revisa los archivos generados y ajústalos según tus necesidades específicas
    
3.  Consistencia: Usa el mismo patrón de nombres en todas tus entidades
    
4.  Integración: Agrega las nuevas rutas a tu módulo principal de Angular
    

* * *

Hecho con ❤️ para la comunidad Angular

\*Script mantenido y mejorado continuamente - Última actualización: Enero 2024\*

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
