
export const quoteOfTheDay = "The world is full of people suffering from the effects of their own unlived life. They become bitter, critical, or rigid, not because the world is cruel to them, but because they have betrayed their own inner possibilities. The artist who never makes art becomes cynical about those who do. The lover who never risks loving mocks romance. The thinker who never commits to a philosophy sneers at belief itself. And yet, all of them suffer, because deep down they know: the life they mock is the life they were meant to live. -- Carl Jung"

export function setupFormButton(element: HTMLElement) {
  element.innerHTML = `
    <div class="circle" id="form-button">
      <p>send some inspo</p>
    </div>
  `

  const popup = document.createElement('div')
  popup.id = 'form-popup'
  popup.hidden = true
  popup.innerHTML = `
    <div class="form-popup-box">
      <textarea placeholder="Share a note..."></textarea>
      <button type="button" id="form-popup-submit">submit</button>
      <button type="button" id="form-popup-close">close</button>
    </div>
  `
  document.body.appendChild(popup)

  const open = () => { popup.hidden = false }
  const close = () => { popup.hidden = true }

  element.querySelector('#form-button')!.addEventListener('click', open)
  popup.querySelector('#form-popup-close')!.addEventListener('click', close)
  popup.addEventListener('click', e => {
    if (e.target === popup) close()
  })
}
