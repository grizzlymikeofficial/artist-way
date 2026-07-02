
export const quoteOfTheDay = "The world is full of people suffering from the effects of their own unlived life. They become bitter, critical, or rigid, not because the world is cruel to them, but because they have betrayed their own inner possibilities. The artist who never makes art becomes cynical about those who do. The lover who never risks loving mocks romance. The thinker who never commits to a philosophy sneers at belief itself. And yet, all of them suffer, because deep down they know: the life they mock is the life they were meant to live. -- Carl Jung"

const NOTES_API = 'https://worker.artist-way.workers.dev/api/notes'

export type Note = {
  id: number
  note: string
  email: string | null
  created_at: string
}

export const writeNoteToDB = async (note: string, email: string) => {
  const response = await fetch(NOTES_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note, email }),
  })
  if (!response.ok) {
    throw new Error('Failed to save note to database')
  }
  return response.json()
}


export const getNotesFromDb = async (params?: { id?: number; email?: string }) => {
  //GET note by ID or email-- returns all notes if no params are provided
  const search = new URLSearchParams()
  if (params?.id != null) search.set('id', String(params.id))
  if (params?.email) search.set('email', params.email)

  const url = search.toString() ? `${NOTES_API}?${search}` : NOTES_API
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to GET notes from database')
  }
  const data = await response.json() as Note | Note[]
  console.log(data) // testing only
  return data
}

export const getAllNotes = async (): Promise<Note[]> => {
  //GET all notes
  const data = await getNotesFromDb()
  return Array.isArray(data) ? data : [data]
}

export const getRandomNote = async (data?: Note[] ) => {
  if (!data) {
    data = await getAllNotes() as Note[]
  }
  if (data.length === 0) {
    throw new Error('No notes found in database')
  }
  if (Array.isArray(data)){
    const randomIndex = Math.floor(Math.random() * data.length)
    console.log(data[randomIndex]) // testing only
    return data[randomIndex]
  }
}



export function setupFormButton(element: HTMLElement) {
  element.innerHTML = `
    <div class="circle" id="form-button">
      <p>send a quote to get a quote</p>
    </div>
  `

  const popup = document.createElement('div')
  popup.id = 'form-popup'
  popup.hidden = true
  popup.innerHTML = `
    <div class="form-popup-box">
      <textarea placeholder="share a note..."></textarea>
      <textarea placeholder="email (optional)"></textarea>
      <button type="button" id="form-popup-submit">submit</button>
      <button type="button" id="form-popup-close">close</button>
    </div>
  `
  document.body.appendChild(popup)

  const open = () => { popup.hidden = false }
  const close = () => { popup.hidden = true }
  const submitForm = async () => {
    const textareas = popup.querySelectorAll('textarea')
    const noteField = textareas[0]
    const emailField = textareas[1]
    const note = noteField.value.trim()
    const email = emailField.value.trim()

    if (note === '') return

    try {
      await writeNoteToDB(note, email)
      noteField.value = ''
      emailField.value = ''
      // testing section
      console.log(await getNotesFromDb())// testing only
      const randomNote = await getRandomNote()
      console.log('single RANDOM note',randomNote) // testing only
      if (randomNote) {
        document.querySelector('#quote-of-the-day')!.textContent = randomNote.note
      } else {
        alert('No notes found in database')
      }
      close()
    } catch (err) {
      console.error(err)
    }
  }

  element.querySelector('#form-button')!.addEventListener('click', open)
  popup.querySelector('#form-popup-close')!.addEventListener('click', close)
  popup.addEventListener('click', e => {
    if (e.target === popup) close()
  })
  popup.querySelector('#form-popup-submit')!.addEventListener('click', submitForm)
}
