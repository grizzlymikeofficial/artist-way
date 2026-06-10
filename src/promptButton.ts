import prompts from './assets/artist_way_clean_prompts.json'

export function setupPromptButton(element: HTMLButtonElement) {
  let usedPrompts: number[] = []
  const render = (prompt: (typeof prompts)[number] | null) => {
    element.innerHTML = `
      <button id="prompt-button" type="button" class="prompt-button">random artist prompt</button>
      <div id="prompt-header">${prompt?.chapter ?? 'No prompts left'}</div>
      <div id="prompt-text">${prompt?.prompt_text ?? ''}</div>
    `
    element.querySelector('#prompt-button')!.addEventListener('click', onClick)
  }
  const onClick = () => {
    const prompt = getRandomPrompt(usedPrompts)
    if (!prompt) return
    usedPrompts = [...usedPrompts, prompt.index]  // new array, don't mutate in place if you care about tracking
    render(prompt)
  }
  const getRandomPrompt = (used: number[]) => {
    const remaining = prompts.filter(p => !used.includes(p.index))
    if (remaining.length === 0) return null
    return remaining[Math.floor(Math.random() * remaining.length)]
  }
  render(getRandomPrompt(usedPrompts))
}

