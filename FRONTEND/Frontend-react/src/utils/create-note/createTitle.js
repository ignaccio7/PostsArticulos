// FUNCION PARA AÑADIR UNA NUEVA ETIQUETA - titulo EN EL FORMULARIO
export const createTitle = (formRef) => {
  const nroTitles = formRef.current.querySelectorAll('input[data-title]').length + 1

  const $newTitle = document.createElement('input')
  // ATTRIBUTES
  $newTitle.setAttribute('data-title', 'true')
  $newTitle.setAttribute('name', `T${nroTitles}`)
  $newTitle.setAttribute('id', `T${nroTitles}`)
  $newTitle.setAttribute('type', 'text')
  $newTitle.setAttribute('placeholder', 'Titulo: Novedad JS, Nueva etiqueta Search, ....')
  // STYLES 'outline-none text-step3 bg-transparent focus:border-b focus:border-gray'
  $newTitle.style.outline = 'none'
  $newTitle.style.fontSize = 'var(--step-3)'
  $newTitle.style.backgroundColor = 'transparent'

  // Estilos para focus
  $newTitle.addEventListener('focus', () => {
    $newTitle.style.borderBottom = '1px solid var(--color-gray)'
  })

  // Limpiar estilos cuando pierde el foco
  $newTitle.addEventListener('blur', () => {
    $newTitle.style.borderBottom = 'none'
  })
  // outline-none text-step3 bg-transparent focus:border-b focus:border-gray
  // CLASES
  $newTitle.classList.add('new-element')
  // Forzar repaint y añadir la clase final
  requestAnimationFrame(() => {
    $newTitle.classList.add('visible')
  })

  formRef.current.appendChild($newTitle)
  $newTitle.focus()
}
