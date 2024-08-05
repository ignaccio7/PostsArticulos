export const createSubtitle = (formRef) => {
  const nroSubtitles = formRef.current.querySelectorAll('input[data-subtitle]').length + 1

  const $newSubtitle = document.createElement('input')
  // ATTRIBUTES
  $newSubtitle.setAttribute('data-subtitle', 'true')
  $newSubtitle.setAttribute('name', `ST${nroSubtitles}`)
  $newSubtitle.setAttribute('id', `ST${nroSubtitles}`)
  $newSubtitle.setAttribute('type', 'text')
  $newSubtitle.setAttribute('placeholder', 'Añade un subtitulo.')
  // STYLES 'outline-none text-step3 bg-transparent focus:border-b focus:border-gray'
  $newSubtitle.style.outline = 'none'
  $newSubtitle.style.fontSize = 'var(--step-2)'
  $newSubtitle.style.backgroundColor = 'transparent'

  // Estilos para focus
  $newSubtitle.addEventListener('focus', () => {
    $newSubtitle.style.borderBottom = '1px solid var(--color-gray)'
  })

  // Limpiar estilos cuando pierde el foco
  $newSubtitle.addEventListener('blur', () => {
    $newSubtitle.style.borderBottom = 'none'
  })
  // outline-none text-step3 bg-transparent focus:border-b focus:border-gray
  // CLASES
  $newSubtitle.classList.add('new-element')
  // Forzar repaint y añadir la clase final
  requestAnimationFrame(() => {
    $newSubtitle.classList.add('visible')
  })

  formRef.current.appendChild($newSubtitle)
  $newSubtitle.focus()
}
