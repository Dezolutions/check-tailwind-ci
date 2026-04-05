import { DialogComponent } from '@theme/dialog';
import { CartAddEvent } from '@theme/events';

/**
 * A custom element that manages a cart drawer.
 *
 * @extends {DialogComponent}
 */
class CartDrawerComponent extends DialogComponent {
  connectedCallback() {
    super.connectedCallback();
    // Listen for your custom 'cart:added' event
    window.addEventListener('cart:added', this.#handleCartAdd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('cart:added', this.#handleCartAdd);
  }

  #handleCartAdd = async () => {
    console.log('check')
    this.showDialog();

    const response = await fetch('/?sections=cart-drawer');
    const data = await response.json();
    const parsedData = new DOMParser().parseFromString(data['header'], "text/html");
    const newDrawer = parsedData.querySelector('.cart-drawer');
    if (!newDrawer) return;

    // Ensure the dialog has the `open` attribute **before** inserting
    const dialog = newDrawer.querySelector('dialog');
    if (dialog) dialog.setAttribute('open', '');

    // Replace only the inner content of your drawer
    const currentDrawer = this.querySelector('.cart-drawer');
    if (currentDrawer) {
      currentDrawer.innerHTML = newDrawer.innerHTML;
    }

  };

  open() {
    this.showDialog();

    /**
     * Close cart drawer when installments CTA is clicked to avoid overlapping dialogs
     */
    customElements.whenDefined('shopify-payment-terms').then(() => {
      const installmentsContent = document.querySelector('shopify-payment-terms')?.shadowRoot;
      const cta = installmentsContent?.querySelector('#shopify-installments-cta');
      cta?.addEventListener('click', this.closeDialog, { once: true });
    });
  }

  close() {
    this.closeDialog();
  }
}

if (!customElements.get('cart-drawer-component')) {
  customElements.define('cart-drawer-component', CartDrawerComponent);
}
