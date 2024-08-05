// FUNCION PARA AÑADIR UNA NUEVA ETIQUETA EN EL FORMULARIO
export function createParagraph (formRef) {
  const nroParagraphs = formRef.current.querySelectorAll('div[data-paragraph]').length + 1

  const $newParagraph = document.createElement('div')
  // ATTRIBUTES
  $newParagraph.setAttribute('data-paragraph', 'true')
  $newParagraph.setAttribute('name', `P${nroParagraphs}`)
  $newParagraph.setAttribute('id', `P${nroParagraphs}`)
  $newParagraph.setAttribute('contentEditable', 'true')
  $newParagraph.setAttribute('placeholder', 'Añade una descripcion cualquiera.')
  // STYLES 'w-full p-1 h-fitbreak-words text-step1'
  $newParagraph.style.width = '100%'
  $newParagraph.style.padding = '0.25rem'
  $newParagraph.style.height = 'auto'
  $newParagraph.style.wordBreak = 'break-word'
  $newParagraph.style.fontSize = 'var(--step-1)'
  // CLASES
  $newParagraph.classList.add('new-element')
  // Forzar repaint y añadir la clase final
  requestAnimationFrame(() => {
    $newParagraph.classList.add('visible')
  })

  formRef.current.appendChild($newParagraph)
  $newParagraph.focus()
}
