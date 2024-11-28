const template1 = document.createElement('template');
template1.innerHTML =
`<div id="container">
    <slot></slot>
</div>`;


let template2Text =
`<style>
    .container {
        display: flex;
        flex-flow: row;
        width: 100%;
        height: 100%;
    }
    .container > .handle {
        width: {{width}}px;
        background-color: #aaa;
        border: 2px solid rgba(255,255,255,05);
        box-sizing: border-box;
        cursor: col-resize;
        display: flex;
        align-items: center;
    }
</style>
<div class="container">`;

let handleTemplateText = `
<div class="handle">
    <svg
       width="{{width}}"
       height="20"
       viewBox="0 0 6 20"
       xmlns="http://www.w3.org/2000/svg">
      <g>
          <circle fill="gray" cx="3" cy="2" r="2" />
          <circle fill="gray" cx="3" cy="10" r="2" />
          <circle fill="gray" cx="3" cy="18" r="2" />
      </g>
    </svg>    
</div>
`


export class ResizableBoxes extends HTMLElement {
    private readonly contentContainers: HTMLElement[] = [];
    private readonly handles: HTMLDivElement[] = [];
    private dragStartX = -1;
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.style.display = 'block';
        const tmp = template1.content.cloneNode(true);
        (this.shadowRoot as ShadowRoot).append(tmp);

        const contents = ((this.shadowRoot as ShadowRoot).querySelector('slot') as HTMLSlotElement).assignedElements() as HTMLElement[];

        const handleWidth = this.getAttribute('handle-width') ? Number(this.getAttribute('handle-width')) : 10;

        template2Text = template2Text.replace('{{width}}', String(handleWidth));
        handleTemplateText = handleTemplateText.replace(/\{\{width}}/g, String(handleWidth - 4));

        let sizeRationSum = 0
        for (let i = 0; i < contents.length; i++) {
            template2Text += `<div class="content${i}"><slot name="content${i}"></slot></div>`;
            if (i < contents.length - 1) {
                template2Text += handleTemplateText;
            }
            contents[i].slot = `content${i}`;
            // @ts-ignore
            sizeRationSum += contents[i].attributes['size-ratio'] ? Number(contents[i].attributes['size-ratio'].value) : 1;
        }
        template2Text += '</div>'
        const tmp2 = document.createElement('template');
        tmp2.innerHTML = template2Text;
        (this.shadowRoot as ShadowRoot).getElementById('container')?.remove();
        (this.shadowRoot as ShadowRoot).append(tmp2.content.cloneNode(true));
        for (const c of contents) {
            this.append(c)
        }
        // @ts-ignore
        for (const handle of (this.shadowRoot as ShadowRoot).querySelectorAll('.handle')) {
            this.handles.push(handle);
        }
        // @ts-ignore
        for (const cont of (this.shadowRoot as ShadowRoot).querySelectorAll('div[class^="content"]')) {
            this.contentContainers.push(cont);
        }

        const initWidth = (this.offsetWidth - (handleWidth * this.handles.length)) / sizeRationSum;

        for (let i = 0; i < this.contentContainers.length; i++) {
            const ratio = contents[i].getAttribute('size-ratio') ? Number(contents[i].getAttribute('size-ratio')) : 1;
            this.contentContainers[i].style.width = `${initWidth * ratio}px`;
        }
        this.listenToEvents();
    }


    listenToEvents() {
        for (let i = 0; i < this.handles.length; i++) {
            this.handles[i].addEventListener('mousedown', (evt: MouseEvent) => {
                if (evt.button !== 0) return;
                document.body.style.userSelect = 'none';
                this.dragStartX = evt.clientX;
                const mouseMoveHandler = (evt2: MouseEvent) => {
                    const delta = this.dragStartX - evt2.clientX;
                    this.dragStartX = evt2.clientX;
                    const newCont1width = this.contentContainers[i].offsetWidth - delta;
                    const newCont2width = this.contentContainers[i+1].offsetWidth + delta;
                    this.contentContainers[i].style.width = newCont1width + 'px';
                    this.contentContainers[i+1].style.width = newCont2width + 'px';
                };
                const mouseUpHandler = () => {
                    document.removeEventListener('mouseup', mouseUpHandler);
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.body.style.userSelect = '';
                };
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            })
        }

    }
}
