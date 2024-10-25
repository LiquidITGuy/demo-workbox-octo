import {css, html, LitElement} from 'lit'


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {
  static get properties() {
    return {
      listeLivres: Array
    }
  }

  constructor() {
    super()
    this.listeLivres = []
  }

  async getLivres() {
    const resultBrut = await fetch('https://cms-headless-core.ln1.eu/livres')
    return await resultBrut.json()
  }

  async _onClick() {
    this.listeLivres = await this.getLivres()
  }

  render() {
    return html`
      <h1>Ma liste des livres</h1>
      <button @click=${this._onClick}>Télécharger la liste des livres</button>
      <ul>
        ${this.listeLivres.map((livre) => 
            html`<li>
              <apercu-livre .titre="${livre.titre}" .couvertureUrl="https://cms-headless-core.ln1.eu${livre.couverture[0].url}"></apercu-livre>
            </li>`
        )}
      </ul>
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

window.customElements.define('my-element', MyElement)
