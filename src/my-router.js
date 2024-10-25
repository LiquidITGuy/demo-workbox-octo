import {html, LitElement} from 'lit'
import {Router} from "@lit-labs/router";


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyRouter extends LitElement {

    constructor() {
        super()
    }

    router = new Router(this, [
        {
            path: '/',
            render: () => html`
                <liste-livre/>`
        },
        {
            path: '/details/:isbn',
            render: ({isbn}) => html`
                <detail-livre .isbn=${isbn}/>`
        },
    ]);

    render() {
        return this.router.outlet();
    }

}

window.customElements.define('my-router', MyRouter)
