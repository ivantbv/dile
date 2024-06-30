import '@dile/ui/components/pages/pages.js';
import '@dile/ui/components/modal/modal';

import { LitElement, html, css } from 'lit';

class MyComponent extends LitElement {

    static styles = css`
    #showpage1 {
        font-size: large;
        }
    `;
  
  render() {
    return html`
      <p>
        <button id="showpage1">Show page 1</button>
        <button id="showpage2">Show page 2</button>
        <button id="showpage3">Show page 3</button>
      </p>
      <dile-pages selected="page1" attrforselected="name">
        <div name="page1">
        <div class="container">
        <h1>Survey Data Export</h1>
        <div class="form-group">
            <label for="portal">Select Portal:</label>
            <select id="portal">
                <option value="">-- Select Portal --</option>
                <option value="newportal.x5.ru">newportal.x5.ru</option>
                <option value="example.x5.ru">example.x5.ru</option>
                <option value="data.x5.ru">data.x5.ru</option>
            </select>
        </div>
        <div class="form-group" id="campaign-group" style="display: none;">
            <label for="campaign">Select Survey:</label>
            <select id="campaign"></select>
        </div>
        <div class="form-group">
            <label for="date">Select Date:</label>
            <input type="date" id="date">
        </div>
        <button id="download-btn">Download Excel</button>
            
        </div>
        </div>
        <div name="page2">
          <h2>Page 2</h2>
          <ul>
            <li>item 1</li>
            <li>item 2</li>
            <li>item 3</li>
          </ul>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde excepturi atque, et quaerat vero saepe maiores, maxime dolore officiis earum cumque temporibus tenetur, possimus deserunt magni itaque! Reiciendis, assumenda quo?</p>
        </div>
        <div name="page3">
          <h2>Page three</h2>
          <p>Just another page</p>
        </div>
      </dile-pages>
    `
  }
  firstUpdated() {

    this.shadowRoot.getElementById('showpage2').addEventListener('click', () => {
      this.shadowRoot.querySelector('dile-pages').selected="page2";
    });
    this.shadowRoot.getElementById('showpage3').addEventListener('click', () => {
      this.shadowRoot.querySelector('dile-pages').selected="page3";
    });
    // Dispatch a custom event when the component is ready
    this.dispatchEvent(new CustomEvent('component-ready', { bubbles: true, composed: true }));
  }
}

class ModalComponent extends LitElement {
  static get styles() {
    return css`
    .myModalCustomized h2 {
        margin-top: 0;
      }
      .myModalCustomized {
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        --dile-modal-border-radius: 0;
        --dile-modal-max-height: 227vh;
        --dile-modal-min-width: 110vh;
        --dile-modal-height: 77vh;
        --dile-modal-min-height, 76vh
      }
      .myModalCustomized #preview {
        max-height: 300px;
      } 
      .myModalCustomized #backgroundmodal div {
        width: 740px;
      }
      .article {
        display: inline-block;
      }
      section {
        background-color: none;
        backdrop-filter: blur(2px);
      }
      .contentIconSeparation {
        overflow: auto;
        max-height: 273px;
      }
      dile-modal section .content {
        max-height: 270px;
      }
      table {
        width: 100%;
        border-collapse: collapse; /* Ensures borders do not have spacing between them */
      }

      th, td {
        border: 1px solid black; /* Adds border to table cells */
        padding: 8px;
        text-align: left; /* Align text to the left */
      }

      th {
        background-color: #f2f2f2; /* Light gray background for headers */
      }

    `;
  }
render() {
  return html`
  <button id="preview-btn">Show Preview</button>
  <dile-modal id="elmodal4" class="myModalCustomized" showCloseIcon>
  
    <div class="preview" id="preview" style="display: none;">
      <h2>Data Preview</h2>
      <table>
          <thead id="preview-thead"></thead>
          <tbody id="preview-tbody"></tbody>
      </table>
    </div>
  </dile-modal>
  `
}
//first updated into the index.js file
firstUpdated() {
  this.shadowRoot.getElementById('preview-btn').addEventListener('click', () => {
    this.shadowRoot.getElementById('elmodal4').open();
  });
  
  this.dispatchEvent(new CustomEvent('modal-ready', { bubbles: true, composed: true }));
}

}


customElements.define('modal-component', ModalComponent);
customElements.define('my-component', MyComponent);

