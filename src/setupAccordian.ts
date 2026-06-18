import prompts from './assets/artist_way_clean_prompts_raw.json'
import { layout, prepare, type PreparedText } from '@chenglou/pretext'

type AccordionOptions = {
  id: string
  header: string
  body: string
  open?: boolean
}

type Prompt = (typeof prompts)[number]

const formatPrompts = (items: Prompt[]) =>
  items.map(p => `${p.prompt_number}. ${p.prompt_text}`).join('\n\n')

function parsePx(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function createAccordionItem(
  parent: HTMLElement,
  { id, header, body: initialBody, open = false }: AccordionOptions,
) {
  const article = document.createElement('article')
  article.className = 'accordion-item'
  article.dataset.id = id
  article.innerHTML = `
    <button type="button" class="accordion-toggle" aria-expanded="${open}">
      <span class="accordion-title"></span>
      <span class="accordion-glyph" aria-hidden="true"></span>
    </button>
    <div class="accordion-body">
      <div class="accordion-inner">
        <p class="accordion-copy"></p>
      </div>
    </div>
  `

  const toggle = article.querySelector('.accordion-toggle') as HTMLButtonElement
  const title = article.querySelector('.accordion-title') as HTMLSpanElement
  const glyph = article.querySelector('.accordion-glyph') as HTMLSpanElement
  const panel = article.querySelector('.accordion-body') as HTMLDivElement
  const inner = article.querySelector('.accordion-inner') as HTMLDivElement
  const copy = article.querySelector('.accordion-copy') as HTMLParagraphElement

  title.textContent = header
  copy.textContent = initialBody

  let body = initialBody
  let expanded = open
  let preparedFont = ''
  let prepared: PreparedText = prepare(body, '16px system-ui', { whiteSpace: 'pre-wrap' })

  const refreshPrepared = (font: string) => {
    if (preparedFont === font) return
    preparedFont = font
    prepared = prepare(body, font, { whiteSpace: 'pre-wrap' })
  }

  const syncHeight = () => {
    const copyStyles = getComputedStyle(copy)
    const innerStyles = getComputedStyle(inner)
    const lineHeight = parsePx(copyStyles.lineHeight)
    const paddingY = parsePx(innerStyles.paddingTop) + parsePx(innerStyles.paddingBottom)
    const width =
      article.clientWidth -
      parsePx(innerStyles.paddingLeft) -
      parsePx(innerStyles.paddingRight)

    refreshPrepared(copyStyles.font)

    const { height } = layout(prepared, Math.max(width, 0), lineHeight)
    panel.style.height = expanded ? `${Math.ceil(height + paddingY)}px` : '0px'
    glyph.style.transform = expanded ? 'rotate(90deg)' : 'rotate(0deg)'
    toggle.setAttribute('aria-expanded', String(expanded))
  }

  toggle.addEventListener('click', () => {
    expanded = !expanded
    syncHeight()
  })

  parent.appendChild(article)
  document.fonts.ready.then(syncHeight)
  window.addEventListener('resize', syncHeight)
  syncHeight()

  return {
    article,
    setHeader: (text: string) => {
      title.textContent = text
    },
    setBody: (text: string) => {
      body = text
      copy.textContent = text
      preparedFont = ''
      syncHeight()
    },
  }
}

export function setupAccordian(element: HTMLDivElement) {
  const chapter0 = prompts.filter(prompt => prompt.chapter === 'Chapter 0')
  const chapter99 = prompts.filter(prompt => prompt.chapter === 'Chapter 99')

  element.className = 'accordion-stack'

  createAccordionItem(element, {
    id: 'weekly',
    header: 'Weekly Prompts',
    body: formatPrompts(chapter0),
    open: true,
  })

  createAccordionItem(element, {
    id: 'prayer',
    header: 'Artist Prayer',
    body: formatPrompts(chapter99),
  })
}
