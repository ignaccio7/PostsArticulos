# Para la configuracion del proyecto con husky biome y commitlint

## Biome <- Que usamos en el backend

Para explicar un poco la diferencia entre un linter y un formateador de codigo, en el linter nos aseguramos que nuestro codigo cumple con ciertas reglas, mientras que en el formateador nos aseguramos que el codigo quedara en un formato especifico.

Siguiendo la guia de instalacion de [biiome](https://github.com/biomejs/biome) 
Para la configuracion en nuestro proyecto hicimos lo siguiente:

```bash
npm install --save-dev --save-exact @biomejs/biome
npx @biomejs/biome init
```

Y luego para las reglas de nuestro linter y formateador de codigo nuestro archivo `biome.json` se ve asi:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": false,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["node_modules/**", "dist/**", "build/**", "*.min.js"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "noConstAssign": "error",
        "noUndeclaredVariables": "warn"
      },
      "style": {
        "useConst": "error",
        "noVar": "error",
        "useTemplate": "warn"
      },
      "suspicious": {
        "noConsoleLog": "warn",
        "noDebugger": "error",
        "noDoubleEquals": "warn"
      },
      "complexity": {
        "noUselessFragments": "error",
        "useOptionalChain": "warn",
        "noStaticOnlyClass": "off",
        "noForEach": "off"
      },
      "performance": {
        "noDelete": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "es5",
      "bracketSpacing": true
    }
  }
}
```

Y en el package.json se agrego los siguientes scripts:

```json
// Scripts de verificación (solo revisar, no modificar)
"check": "biome check .",              // Verifica reglas de linting
"format:check": "biome format .",      // Verifica formato sin modificar
"validate": "npm run check && npm run format:check", // Verifica AMBOS: linting + formato

// Scripts de corrección (modifican el código)
"check:fix": "biome check --apply .",  // Corrige errores de linting automáticamente
"format": "biome format --write .",    // Aplica formato automáticamente
"fix": "npm run check:fix && npm run format", // Corrige TODO: linting + formato
```

## Para Husky con Commitling

Para explicar un poco la diferencia entre husky y commitlint, es que con ayuda de [husky](https://github.com/typicode/husky) podemos automatizar tareas en nuestro proyecto, como por ejemplo, ejecutar un script antes de cada commit, o antes de cada push, o antes de cada pull request, etc.

Y con [commitlint](https://github.com/conventional-changelog/commitlint) podemos configurar reglas de formato de commits, como por ejemplo, que los mensajes de commit tengan un formato específico, o que los mensajes de commit no tengan caracteres especiales, etc.

Adicional a eso estamos usando [lint-staged](https://github.com/lint-staged/lint-staged) que nos permite ejecutar estas validaciones en solo archivos JavaScript que están en staging area (git add).

```bash
npm install --save-dev husky @commitlint/config-conventional @commitlint/cli lint-staged
```

Posterior a eso ejecutamos

```bash
npx husky init
```

Y creamos los siguientes archivos con el siguiente contenido:

`.lintstagedrc.json`
```json
{
  // Solo archivos JavaScript/TypeScript que están en staging area (git add)
  "*.{js,jsx,ts,tsx}": [
    // 1. Primero verifica reglas de linting (sin corregir)
    "npx biome check --no-errors-on-unmatched",
    // 2. Luego verifica formato (sin corregir)  
    "npx biome format --no-errors-on-unmatched"
  ]
}

// ¿Por qué --no-errors-on-unmatched?
// Si no hay archivos JS/TS en el commit, no falla el proceso
// Ejemplo: si solo commiteas un README.md, no da error

// ¿Por qué lint-staged?
// - Solo revisa archivos que vas a commitear (más rápido)
// - No revisa todo el proyecto en cada commit
// - Evita conflictos con código de otros developers
```

`commitlint.config.js`
```js
module.exports = {
  // Extiende la configuración convencional de commits
  // Esto incluye reglas estándar como feat:, fix:, docs:, etc.
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    // Define QUÉ tipos de commit son válidos
    'type-enum': [
      2,        // Nivel de error: 2=error, 1=warning, 0=off
      'always', // Cuándo aplicar: always=siempre, never=nunca
      [
        'feat',     // Nueva funcionalidad para el usuario
        'fix',      // Corrección de un bug
        'docs',     // Solo cambios en documentación
        'style',    // Cambios que no afectan lógica (espacios, formato)
        'refactor', // Cambio de código que no es bug ni feature
        'perf',     // Cambio que mejora performance
        'test',     // Agregar tests faltantes o corregir existentes
        'chore',    // Cambios en build, herramientas, librerías
        'ci',       // Cambios en archivos de CI (GitHub Actions, etc.)
        'build',    // Cambios que afectan build system
        'revert'    // Revierte un commit anterior
      ]
    ],
    
    // El tipo debe estar en minúsculas: "feat" ✅, "Feat" ❌
    'type-case': [2, 'always', 'lower-case'],
    
    // El tipo no puede estar vacío: "feat: algo" ✅, ": algo" ❌
    'type-empty': [2, 'never'],
    
    // El scope (ámbito) debe estar en minúsculas: "feat(api): algo" ✅
    'scope-case': [2, 'always', 'lower-case'],
    
    // El subject no puede usar estos casos:
    // "feat: Agregar login" ❌ (sentence-case)
    // "feat: agregar login" ✅ (lower-case está bien)
    'subject-case': [
      2, 
      'never', 
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
    ],
    
    // El subject no puede estar vacío: "feat: " ❌
    'subject-empty': [2, 'never'],
    
    // El subject no puede terminar con punto: "feat: algo." ❌
    'subject-full-stop': [2, 'never', '.'],
    
    // Header completo máximo 100 caracteres
    'header-max-length': [2, 'always', 100],
    
    // Body debe tener línea en blanco antes
    'body-leading-blank': [1, 'always'],
    
    // Líneas del body máximo 100 caracteres
    'body-max-line-length': [2, 'always', 100],
    
    // Footer debe tener línea en blanco antes
    'footer-leading-blank': [1, 'always'],
    
    // Líneas del footer máximo 100 caracteres  
    'footer-max-line-length': [2, 'always', 100]
  }
};

/*
EJEMPLOS DE COMMITS VÁLIDOS:

✅ feat: agregar autenticación JWT
✅ fix: corregir validación de email en registro
✅ docs: actualizar README con instrucciones de instalación
✅ refactor(api): optimizar queries de base de datos
✅ test: agregar tests para módulo de usuarios

❌ Feat: Agregar Login (tipo en mayúscula, subject en sentence-case)
❌ fix (falta el subject)
❌ feat: agregar sistema de login super complejo que permite autenticación. (termina en punto)
*/
```

``
```bash

```


``
```bash

```