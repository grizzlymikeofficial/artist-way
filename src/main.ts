import './style.css'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupPromptButton } from './promptButton.ts'
import { setupEInkToggle } from './e-ink-toggle.ts'
import { setupAccordian } from './setupAccordian.ts'



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<section id="center">
<div id="eink-toggle"></div>
<div id ="promptButton"></div>
<div id = 'accordion'></div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`

setupEInkToggle(document.querySelector<HTMLElement>('#eink-toggle')!)
setupPromptButton(document.querySelector<HTMLButtonElement>('#promptButton')!)
setupAccordian(document.querySelector<HTMLDivElement>('#accordion')!)
