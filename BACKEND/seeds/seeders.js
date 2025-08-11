import bcrypt from 'bcrypt'
import config from '../config.js'
import { connection } from '../models/connection.js'

const { admin_user, admin_password, admin_email } = config

async function seed() {
  try {
    console.log('🌱 Iniciando seed de base de datos...')

    const checkAdmin = await connection.query("SELECT * FROM usuario WHERE rol = 'admin' LIMIT 1")

    if (checkAdmin.rows.length > 0) {
      console.log('⚠️ Admin ya existe. Seed cancelado.')
      process.exit(0)
    }

    // 2️⃣ Crear persona
    const person = {
      ci: 123321456,
      nombres: 'ignaccio7',
      paterno: 'ignaccio7',
      materno: 'ignaccio7',
      telefono: 76757643,
      correo: admin_email,
      avatar: '',
      avatar_id: '',
    }

    await connection.query(
      `INSERT INTO persona (ci, nombres, paterno, materno, telefono, correo, avatar, avatar_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        person.ci,
        person.nombres,
        person.paterno,
        person.materno,
        person.telefono,
        person.correo,
        person.avatar,
        person.avatar_id,
      ]
    )

    const hashedPass = await bcrypt.hash(admin_password, 10)
    const resultUser = await connection.query(
      `INSERT INTO usuario (persona_ci, usuario, pass, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id_usuario`,
      [person.ci, admin_user, hashedPass, 'admin']
    )

    const adminId = resultUser.rows[0].id_usuario

    // 4️⃣ Crear nota de ejemplo
    const note = await connection.query(
      `INSERT INTO notas (usuario_id_usuario, titulo, descripcion, fechapost, jsondata)
       VALUES ($1, $2, $3, CURRENT_DATE, $4)
       RETURNING id_nota`,
      [
        adminId,
        'Bienvenido',
        'Esta es la nota de ejemplo del admin',
        JSON.stringify({ ejemplo: true }),
      ]
    )

    const noteId = note.rows[0].id_nota

    // 5️⃣ Publicar la nota
    const pub = await connection.query(
      `INSERT INTO notas_publicadas (notas_id_nota, usuario_id_usuario, fechapub)
       VALUES ($1, $2, CURRENT_DATE)
       RETURNING id_publicacion`,
      [noteId, adminId]
    )

    const pubId = pub.rows[0].id_publicacion

    // 6️⃣ Agregar comentario de ejemplo
    await connection.query(
      `INSERT INTO comentarios (id_publicacion, id_usuario, comment)
       VALUES ($1, $2, $3)`,
      [pubId, adminId, 'Primer comentario de prueba']
    )

    // 7️⃣ Agregar popularidad (like)
    await connection.query(
      `INSERT INTO popularidad (id_publicacion, id_usuario)
       VALUES ($1, $2)`,
      [pubId, adminId]
    )

    console.log('✅ Seed ejecutado con éxito.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error en seed:', err)
    process.exit(1)
  }
}

seed()
