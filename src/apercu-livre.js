import {html, LitElement} from 'lit'

export class ApercuLivre extends LitElement {
	static get properties() {
		return {
			titre: String,
			id: String,
			couvertureUrl: String,
		}
	}

	constructor() {
		super()
	}
	
	render() {
		return html`
      <h2>${this.titre}</h2>
      <img src="${this.couvertureUrl}" alt="couverture ${this.titre}"/>
    `
	}
}

window.customElements.define('apercu-livre', ApercuLivre)
