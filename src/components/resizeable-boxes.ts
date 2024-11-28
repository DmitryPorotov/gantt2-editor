const template = document.createElement('template');
template.innerHTML =
    `<style type="text/css">
.container {
    display: flex;
    flex-flow: row;
    width: 100%;
    height: 100%;
}
.container > .content-1 {
    width: calc(30% - 5px);
}
.container > .content-2 {
    width: calc(70% - 5px);
}
.container > .handle {
    width: 10px;
    background-color: #aaa;
    border: 2px solid rgba(255,255,255,05);
    box-sizing: border-box;
    cursor: col-resize;
    display: flex;
    align-items: center;
}
</style>
<div class="container" >
    <div class="content-1">
        <slot name="content-container-1"></slot>
    </div>
    <div class="handle">
        <svg
           width="6"
           height="20"
           viewBox="0 0 6 20"
           version="1.1"
           xmlns="http://www.w3.org/2000/svg">
          <g>
              <circle fill="gray" cx="3" cy="2" r="2" />
              <circle fill="gray" cx="3" cy="10" r="2" />
              <circle fill="gray" cx="3" cy="18" r="2" />
          </g>
        </svg>    
    </div>
    <div class="content-2">
        <slot name="content-container-2"></slot>
    </div>
</div>`;

export class ResizeableBoxes extends HTMLElement {
    private readonly handle: HTMLDivElement;
    private readonly content1: HTMLDivElement;
    private readonly content2: HTMLDivElement;
    private cont1Width: number = -1;
    private cont2Width: number = -1;
    private dragStartX = -1;
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.style.display = 'block';
        const tmp = template.content.cloneNode(true);
        (this.shadowRoot as ShadowRoot).append(tmp);

        this.handle = (this.shadowRoot as ShadowRoot).querySelector('.handle') as HTMLDivElement;
        this.content1 = (this.shadowRoot as ShadowRoot).querySelector('.content-1') as HTMLDivElement;
        this.content2 = (this.shadowRoot as ShadowRoot).querySelector('.content-2') as HTMLDivElement;
        this.cont1Width = this.content1.offsetWidth;
        this.cont2Width = this.content2.offsetWidth;

        this.listenToEvents();
    }



    listenToEvents() {
        this.handle.addEventListener('mousedown', (evt: MouseEvent) => {
            document.body.style.userSelect = 'none';
            this.dragStartX = evt.clientX;
            const mouseMoveHandler = (evt2: MouseEvent) => {
                const delta = this.dragStartX - evt2.clientX;
                this.dragStartX = evt2.clientX;
                const newCont1width = this.cont1Width - delta;
                const newCont2width = this.cont2Width + delta;
                this.content1.style.width = newCont1width + 'px';
                this.content2.style.width = newCont2width + 'px';
                this.cont1Width = newCont1width;
                this.cont2Width = newCont2width;
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
