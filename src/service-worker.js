import {html, LitElement} from 'lit'

export class ServiceWorker extends LitElement {

	constructor() {
		super()
	}

	async _onClick() {
		const serviceWorker = navigator.serviceWorker.controller;
		if (serviceWorker) {
			const result = await serviceWorker.postMessage({ type: 'GET_DATA' });
			console.log(result);
		} else {
			console.log('Service Worker not found');
		}
	}
	render() {
		return html`
      <h2>informations sur le service worker</h2>
		<p>Le service worker est un script qui s'exécute en arrière-plan du navigateur. Il permet de gérer les mises en cache des ressources de l'application web, de gérer les notifications push et de gérer les synchronisations en arrière-plan.</p>
		<p>Le service worker est enregistré dans le fichier sw.js et est activé dans le fichier index.html.</p>
		<!-- <button @click=${this.registerServiceWorker}>Enregistrer le service worker</button>
		<button @click=${this.unregisterServiceWorker}>Désenregistrer le service worker</button>-->
	  <button @click=${this._onClick}>regarder les données économisées</button>
		`
	}
}

window.customElements.define('service-worker', ServiceWorker)
