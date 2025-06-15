# Librerias utilizadas
standard
    `npm install standard -D`
express
    `npm install express -E`
zod
    `npm install zod -E`
dotenv
    `npm install dotenv --save`
nodemon
    `npm i nodemon -D`
mysql2
    `npm i mysql2 -E`
jwt
    `npm install jsonwebtoken -E`
cors
    `npm install cors -E`
cloudinary
    `npm i cloudinary -E`
multer
    `npm i multer -E`
bcrypt
    `npm i bcrypt -E`

# Para la configuracion del proyecto con husky biome y commitlint

## Biome

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

```bash

```

```bash

```

```bash

```

```bash

```

---



https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

nodemailer <- para envio de correo
