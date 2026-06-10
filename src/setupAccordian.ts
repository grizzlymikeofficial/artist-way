import prompts from './assets/artist_way_clean_prompts_raw.json'

export function setupAccordian(element: HTMLDivElement) {
  const chapter0 = prompts.filter(prompt => prompt.chapter === 'Chapter 0')
  const chapter99 = prompts.filter(prompt => prompt.chapter === 'Chapter 99')

  element.innerHTML = `
    <div id="accordion-header">Weekly Prompts
      <div id="accordion-text">
        ${chapter0.map(p => `<p>${p.prompt_number}. ${p.prompt_text}</p>`).join('')}
      </div>
    </div>
    <div id="accordion-header">Artist Prayer
      <div id="accordion-text">
        ${chapter99.map(p => `<p>${p.prompt_number}. ${p.prompt_text}</p>`).join('')}
      </div>
    </div>
  `
}

/*
  ─── Pretext accordion reference (study tomorrow) ───
  Based on @chenglou/pretext demo: prepare() measures text via canvas once,
  layout() computes exact height in pixels — no DOM measurement / reflow.
  Used to animate accordion panels open/closed with the right height.

  import { layout, prepare, type PreparedText } from '@chenglou/pretext'

  type AccordionItem = { id: string; title: string; text: string }

  const formatPrompts = (items: typeof prompts) =>
    items.map(p => `${p.prompt_number}. ${p.prompt_text}`).join('\n\n')

  // 1. Build items from filtered chapters
  const items: AccordionItem[] = [
    { id: 'weekly', title: 'Weekly Prompts', text: formatPrompts(chapter0) },
    { id: 'prayer', title: 'Artist Prayer', text: formatPrompts(chapter99) },
  ]

  // 2. Render accordion DOM (one article per item)
  element.className = 'accordion-stack'
  element.innerHTML = items.map(item => `
    <article class="accordion-item" data-id="${item.id}">
      <button type="button" class="accordion-toggle" data-id="${item.id}">
        <span class="accordion-title">${item.title}</span>
        <span class="accordion-meta"></span>
        <span class="accordion-glyph"></span>
      </button>
      <div class="accordion-body">
        <div class="accordion-inner">
          <p class="accordion-copy">${item.text}</p>
        </div>
      </div>
    </article>
  `).join('')

  // 3. prepare() once per text block (cache by font string)
  const preparedCache = { font: '', items: [] as PreparedText[] }
  const refreshPrepared = (font: string) => {
    if (preparedCache.font === font) return
    preparedCache.font = font
    preparedCache.items = items.map(item =>
      prepare(item.text, font, { whiteSpace: 'pre-wrap' }),
    )
  }

  // 4. layout() → exact panel height for CSS transition
  const copyEl = element.querySelector('.accordion-copy') as HTMLParagraphElement
  const styles = getComputedStyle(copyEl)
  const font = styles.font
  const lineHeight = parseFloat(styles.lineHeight)
  const contentWidth = copyEl.getBoundingClientRect().width

  refreshPrepared(font)
  const metrics = layout(preparedCache.items[0]!, contentWidth, lineHeight)
  // metrics.height  = total text height in px
  // metrics.lineCount = number of wrapped lines
  // Set accordion-body style.height to metrics.height when expanded, 0 when collapsed

  // 5. On click: toggle openItemId, re-run layout on resize
  // See node_modules/@chenglou/pretext/pages/demos/accordion.ts for full version
*/
