import {css, html, LitElement} from 'lit'
import {Router, Routes} from "@lit-labs/router";


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class DetailLivre extends LitElement {
    static get properties() {
        return {
            isbn: String
        }
    }

    constructor() {
        super()
    }

    async getLivre() {
        const resultBrut = await fetch('https://cms-headless-core.ln1.eu/livres/' + this.isbn)
        return await resultBrut.json()
    }

    async _onClick() {
        this.livre = await this.getLivre()
        console.dir(this.livre)
    }

    render() {
        return html`
            <h1>ISBN ${this.isbn}</h1>
            <button @click=${this._onClick}>Télécharger le livre</button>
        `
    }

    static get styles() {
        return css`
      :host {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }

      a {
        font-weight: 500;
        color: #646cff;
        text-decoration: inherit;
      }
      a:hover {
        color: #535bf2;
      }

      ::slotted(h1) {
        font-size: 3.2em;
        line-height: 1.1;
      }

      button {
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        cursor: pointer;
        transition: border-color 0.25s;
      }
      button:hover {
        border-color: #646cff;
      }
      button:focus,
      button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
      }

      @media (prefers-color-scheme: light) {
        a:hover {
          color: #747bff;
        }
        button {
          background-color: #f9f9f9;
        }
      }
    `
    }
}

window.customElements.define('detail-livre', DetailLivre)
