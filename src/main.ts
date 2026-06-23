import './style.css'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupPromptButton } from './promptButton.ts'
import { setupEInkToggle } from './e-ink-toggle.ts'
import { setupAccordian } from './setupAccordian.ts'
import { setupFormButton , quoteOfTheDay} from './setupForm.ts'

// Styling Inspo / Sources
// e-ink CSS Styling + Toggle: https://blog.edumind.es/e-ink-css-for-education-reducing-blue-light-through-software-design/
// Animated Text bg: https://prismic.io/blog/css-text-animations
// Button Styling: https://codepen.io/Shinobis/pen/yLNgWGM

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<header class="site-header">
  <h1 class="masked-text">. :: artist way :: .</h1>
  <div id="eink-toggle"></div>
</header>
<section id="center">
  <div id ="promptButton"></div>
  <div id = 'accordion'></div>
  <div id="artistMessageContainer">
    <div id="artistMessage">
      <div id="prompt-header">Quote of the Day</div>
        <p>${quoteOfTheDay}</p>
      </div>
    <div id="formButton"></div>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`

setupEInkToggle(document.querySelector<HTMLElement>('#eink-toggle')!)
setupPromptButton(document.querySelector<HTMLElement>('#promptButton')!)
setupAccordian(document.querySelector<HTMLDivElement>('#accordion')!)
setupFormButton(document.querySelector<HTMLElement>('#formButton')!)
