function updatePreviewHeader(text) {
    // Get the reference to the custom element
    const myComponent = document.querySelector('my-component');
    if (myComponent) {
      // Access the shadow root and update the preview-thead element
      const previewThead = myComponent.shadowRoot.querySelector('.form-group label');
      if (previewThead) {
        previewThead.textContent = text;
      }
      const showPage1 = myComponent.shadowRoot.querySelector('#showpage1');

      showPage1.addEventListener('click', () => {
        myComponent.shadowRoot.querySelector('dile-pages').selected="page1";
      });
    }
  }

  function showPreview() {
    const modalComponent = document.querySelector('modal-component');
    if (modalComponent) {
      const thead = modalComponent.shadowRoot.querySelector('#preview-thead');
      const tbody = modalComponent.shadowRoot.querySelector('#preview-tbody');
      thead.innerHTML = ''; // Clear previous headers
      tbody.innerHTML = '';
  
      // Generate headers dynamically
      const headerRow = document.createElement('tr');
      for (let i = 0; i < 15; i++) {
        const headerCell = document.createElement('th');
        headerCell.textContent = 'asd';
        headerRow.appendChild(headerCell);
      }
      thead.appendChild(headerRow); // Append header row once
  
      // Generate rows dynamically
      for (let i = 0; i < 15; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 15; j++) {
          const cell = document.createElement('td');
          cell.textContent = 'value';
          row.appendChild(cell);
        }
        tbody.appendChild(row); // Append row with cells
      }
  
      modalComponent.shadowRoot.querySelector('#preview').style.display = 'block';
    }
  }
  
  // Example of calling the external function
  document.addEventListener('component-ready', () => {
    updatePreviewHeader('Imported ');
  });
  
  document.addEventListener('modal-ready', () => {
    const modalComponent = document.querySelector('modal-component');
    if (modalComponent) {
      
      const previewBtn = modalComponent.shadowRoot.querySelector('#preview-btn');
      console.log('modal comp', modalComponent, 'and preview btn', previewBtn);
      previewBtn.addEventListener('click', () => {
        showPreview();
      })
    }

  })

  