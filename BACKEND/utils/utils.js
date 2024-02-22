import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
export const readJSON = (p) => require(path.join(process.cwd(), p))
