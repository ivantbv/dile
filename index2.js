import '@dile/ui/components/pages/pages.js';
import '@dile/ui/components/tabs/tabs.js';  // Make sure to import dile-tabs
import { LitElement, html, css } from 'lit';

class PageComponent extends LitElement {

  static styles = css`
    #showpage1 {
      font-size: large;
    }
    dile-tabs dile-tab, dile-tab selected  {
        background: #63b14d;
    }

    .tab {
      background: #63b14d;
    }
  `;
  
  render() {
    return html`
      <dile-tabs selectorId="selector1" attrforselected="name" selected="one">
        <dile-tab class="tab" name="one">One</dile-tab>
        <dile-tab class="tab" name="two">Two</dile-tab>
      </dile-tabs>
      <hr>
      <dile-pages selectorId="selector1" attrforselected="name">
        <section name="one">
          <p>Page one...</p>
          Lorem ipsum...
        </section>
        <section name="two">
          <p>Page two...</p>
          Other page...
        </section>
      </dile-pages>
    `;
  }

  firstUpdated() {
    // The component is ready, and any additional setup can go here if needed.
  }
}
customElements.define('page-component', PageComponent);
