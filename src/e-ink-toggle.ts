
export function setupEInkToggle(element: HTMLElement) {
    // init html class
    document.documentElement.html.classList.add("eink-max");


    element.innerHTML = `
      <div class="eink-toggle">
        <button data-mode="eink-max" title="E-Ink MAX" class=""><span class="icon">◉</span><span class="label">max</span></button>
        <button data-mode="eink-reading" title="Lectura óptima" class="active"><span class="icon">◎</span><span class="label">reading</span></button>
        <button data-mode="eink-night" title="Modo nocturno" class=""><span class="icon">◐</span><span class="label">night mode</span></button>
        <button data-mode="eink-normal" title="Sin filtro" class=""><span class="icon">○</span><span class="label">off</span></button>
      </div>`
      element.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest('button[data-mode]')
        if (!btn) return
        const mode = (btn as HTMLButtonElement).dataset.mode!
        const html = document.documentElement;

        //Remove all e-ink modes & add the new one
        html.classList.remove('eink-max', 'eink-reading', 'eink-night', 'eink-normal');
        html.classList.add(mode);

        //Remove active class from all buttons & add it to the clicked button
        element.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        //Save the selected mode to local storage
        localStorage.setItem('eink-mode', mode);
      })
}