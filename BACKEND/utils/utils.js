import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
export const readJSON = (p) => require(path.join(process.cwd(), p))

export function getFilters ({ filters, fechaPost }) {
  let sql = ''; const values = []

  Object.entries(filters).forEach(([a, b]) => {
    if (b) {
      sql += ` AND n.${a} LIKE ?`
      values.push(`%${b}%`)
    }
  })

  if (fechaPost.init && fechaPost.end) {
    sql += ' AND fechaPost BETWEEN ? AND ?'
    values.push(fechaPost.init)
    values.push(fechaPost.end)
  }

  return { sql, values }
}
