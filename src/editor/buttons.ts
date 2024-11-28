const template = `
<button title="Add a new task"></button>
`;
export class Buttons {
    constructor(private _container: HTMLElement) {
        this._container.innerHTML = template;
    }
}
