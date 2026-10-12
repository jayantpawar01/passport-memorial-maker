document.addEventListener('DOMContentLoaded', () => {
  let currentImageData = null;
  let currentOriginalFile = null;
  const cameraManager = new CameraManager();

  // ==================== FEATURE: Load Config ====================
  const featureList = document.getElementById('featureList');
  async function loadFeatures() {
    try {
      const response = await fetch('/api/config');
      const config = await response.json();
      const items = Object.entries(config.features);

      featureList.innerHTML = items.map(([key, value]) => {
        const enabled = value.enabled ? 'enabled' : 'disabled';
        return `
          <li class="feature-item">
            <div class="left">
              <span>${value.icon || '⚡'}</span>
              <span>${value.label || key}</span>
            </div>
            <span class="feature-status ${enabled === 'disabled' ? 'disabled' : ''}"></span>
          </li>
        `;
      }).join('');
    } catch (error) {
      console.error('Failed to load config', error);
    }
  }
  loadFeatures();

  // ==================== FEATURE: Tab Navigation ====================
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      document.querySelectorAll('.tab-content').forEach((panel) => {
        panel.classList.toggle('active', panel.id === target);
      });
    });
  });

  // ==================== FEATURE: Passport Photo ====================
  document.getElementById('passportUpload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.getElementById('passportPreview');
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
      currentImageData = e.target.result;
      currentOriginalFile = file;
      document.getElementById('passportPreviewWrap').style.background = '#fff';
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('passportBg').addEventListener('change', () => {
    const bgMap = {
      'white': '#ffffff',
      'lightblue': '#e6f0ff',
      'cream': '#f6f0e8',
      'blue': '#4a90e2'
    };
    document.getElementById('passportPreviewWrap').style.background = bgMap[this.value] || '#ffffff';
  });

  document.getElementById('passportDownload').addEventListener('click', () => {
    if (!currentImageData) {
      alert('Please upload a photo first');
      return;
    }
    const timestamp = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = currentImageData;
    link.download = `EASYPHOTO-Passport-${timestamp}.jpg`;
    link.click();
  });

  document.getElementById('passportPrint').addEventListener('click', () => {
    if (!currentImageData) {
      alert('Please upload a photo first');
      return;
    }
    const printWindow = window.open();
    printWindow.document.write(`
      <html><head><title>Print</title></head>
      <body style="margin:0; text-align:center;">
        <img src="${currentImageData}" style="width:35mm; height:45mm; border:1px solid #ccc;">
        <script>window.print(); window.close();</script>
      </body></html>
    `);
  });

  // ==================== FEATURE: Passport with Name/Date ====================
  document.getElementById('textPassportUpload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.getElementById('textPassportPreview');
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
      document.getElementById('textPassportPreviewWrap').style.background = '#fff';
    };
    reader.readAsDataURL(file);
  });

  const passportName = document.getElementById('passportNameInput');
  const passportDate = document.getElementById('passportDateInput');
  const nameOverlay = document.getElementById('nameOverlay');
  const dateOverlay = document.getElementById('dateOverlay');

  passportName.addEventListener('input', () => {
    nameOverlay.textContent = passportName.value || 'Name';
  });

  passportDate.addEventListener('input', () => {
    dateOverlay.textContent = passportDate.value || 'Date';
  });

  document.getElementById('textPassportDownload').addEventListener('click', () => {
    const textPassportPreview = document.getElementById('textPassportPreview');
    if (!textPassportPreview.src || textPassportPreview.style.display === 'none') {
      alert('Please upload a photo first');
      return;
    }
    const timestamp = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = textPassportPreview.src;
    link.download = `EASYPHOTO-Passport-NameDate-${timestamp}.jpg`;
    link.click();
  });

  // ==================== FEATURE: Memorial Card ====================
  document.getElementById('memorialUpload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.getElementById('memorialPreview');
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  const memorialNameInput = document.getElementById('memorialNameInput');
  const memorialBirthInput = document.getElementById('memorialBirthInput');
  const memorialDeathInput = document.getElementById('memorialDeathInput');
  const memorialQuoteInput = document.getElementById('memorialQuoteInput');

  const memorialNameEl = document.getElementById('memorialName');
  const memorialBirthEl = document.getElementById('birthDateText');
  const memorialDeathEl = document.getElementById('deathDateText');
  const memorialQuoteEl = document.getElementById('memorialQuote');

  function syncMemorialText() {
    memorialNameEl.textContent = memorialNameInput.value || 'Name';
    memorialBirthEl.textContent = memorialBirthInput.value || 'Birth';
    memorialDeathEl.textContent = memorialDeathInput.value || 'Death';
    memorialQuoteEl.textContent = memorialQuoteInput.value || 'Quote';
  }

  memorialNameInput.addEventListener('input', syncMemorialText);
  memorialBirthInput.addEventListener('input', syncMemorialText);
  memorialDeathInput.addEventListener('input', syncMemorialText);
  memorialQuoteInput.addEventListener('input', syncMemorialText);

  document.getElementById('memorialDownload').addEventListener('click', () => {
    const memorialPreview = document.getElementById('memorialPreview');
    if (!memorialPreview.src || memorialPreview.style.display === 'none') {
      alert('Please upload a photo first');
      return;
    }
    const timestamp = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = memorialPreview.src;
    link.download = `EASYPHOTO-Memorial-${timestamp}.jpg`;
    link.click();
  });

  // ==================== FEATURE: Camera Capture ====================
  const cameraTab = document.getElementById('camera');
  
  cameraTab.addEventListener('click', () => {
    if (!cameraManager.stream) {
      cameraManager.initialize(document.getElementById('cameraVideo')).then((result) => {
        const cameraStatus = document.getElementById('cameraStatus') || createCameraStatus();
        if (result.success) {
          cameraStatus.textContent = '✓ Camera ready';
          cameraStatus.style.color = '#10b981';
        } else {
          cameraStatus.textContent = '✗ ' + result.message;
          cameraStatus.style.color = '#ef4444';
        }
      });
    }
  });

  function createCameraStatus() {
    const status = document.createElement('div');
    status.id = 'cameraStatus';
    status.style.cssText = 'padding:10px; margin:10px 0; border-radius:8px; font-weight:600; background:#f0fdf4; color:#10b981;';
    document.querySelector('#camera .card').insertBefore(status, document.querySelector('#camera video'));
    return status;
  }

  document.getElementById('capturePhoto').addEventListener('click', async () => {
    const result = await cameraManager.capturePhoto();
    if (result.success) {
      const capturedImage = document.getElementById('capturedImage');
      capturedImage.src = result.imageData;
      capturedImage.parentElement.style.display = 'block';
      
      // Add option to use this image in passport
      addUsePhotoButton(result.imageData);
    } else {
      alert(result.message);
    }
  });

  document.getElementById('switchCamera').addEventListener('click', () => {
    cameraManager.switchCamera();
  });

  function addUsePhotoButton(imageData) {
    let useBtn = document.getElementById('usePhotoBtn');
    if (!useBtn) {
      useBtn = document.createElement('button');
      useBtn.id = 'usePhotoBtn';
      useBtn.className = 'primary';
      useBtn.style.marginTop = '10px';
      document.querySelector('#camera .button-row').appendChild(useBtn);
    }
    useBtn.textContent = 'Use this photo for Passport';
    useBtn.onclick = () => {
      // Set captured image to passport tab
      document.querySelector('.tab[data-tab="passport"]').click();
      const passportPreview = document.getElementById('passportPreview');
      passportPreview.src = imageData;
      passportPreview.style.display = 'block';
      currentImageData = imageData;
      document.getElementById('passportPreviewWrap').style.background = '#fff';
      alert('Photo added to Passport. You can now download or print.');
    };
  }

  document.querySelector('.camera-preview-wrap').addEventListener('click', () => {
    cameraManager.downloadCapturedImage();
  });

  // ==================== FEATURE: AI Assistant ====================
  const chatInput = document.getElementById('chatInput');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendChat');
  let editableImageData = null;

  function addChatMessage(message, who = 'bot') {
    const msg = document.createElement('div');
    msg.className = `message ${who}`;
    msg.textContent = message;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function handleAICommand(command) {
    if (!currentImageData) {
      addChatMessage('Please upload a photo first to apply edits.', 'bot');
      return;
    }

    addChatMessage(`Applying: ${command}...`, 'bot');
    
    try {
      const editedImage = await AIImageEditor.applyCommand(currentImageData, command);
      currentImageData = editedImage;
      
      // Update preview
      const previewImg = document.getElementById('passportPreview');
      if (previewImg.style.display !== 'none') {
        previewImg.src = editedImage;
      }
      
      addChatMessage(`✓ Applied ${command} to your image!`, 'bot');
    } catch (error) {
      addChatMessage('Failed to apply edit. Try another command.', 'bot');
    }
  }

  sendBtn.addEventListener('click', () => {
    const value = chatInput.value.trim();
    if (!value) return;
    addChatMessage(value, 'user');
    handleAICommand(value);
    chatInput.value = '';
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });

  document.querySelectorAll('.mini-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const command = btn.dataset.command;
      addChatMessage(command, 'user');
      handleAICommand(command);
    });
  });

  // Show AI commands list
  const commandsBtn = document.createElement('button');
  commandsBtn.textContent = '📋 Commands';
  commandsBtn.className = 'mini-btn';
  commandsBtn.style.marginTop = '10px';
  commandsBtn.onclick = () => {
    const suggestions = AIImageEditor.getCommandSuggestions();
    addChatMessage('Available commands: ' + suggestions.map(s => s.cmd).join(', '), 'bot');
  };
  document.querySelector('.quick-actions').appendChild(commandsBtn);

  // ==================== FEATURE: Print Layout ====================
  const printLayoutEl = document.getElementById('printLayout');
  const paperSizeSelect = document.getElementById('paperSizeSelect');
  const copyCountSelect = document.getElementById('copyCountSelect');

  function renderPrintLayout() {
    const count = Number(copyCountSelect.value || 10);
    const cells = [];
    printLayoutEl.innerHTML = '';

    for (let i = 1; i <= count; i++) {
      const cell = document.createElement('div');
      cell.className = 'print-cell';
      const label = document.createElement('div');
      label.textContent = `Photo ${i}`;
      const sub = document.createElement('span');
      sub.textContent = `${paperSizeSelect.value}`;
      cell.appendChild(label);
      cell.appendChild(sub);
      printLayoutEl.appendChild(cell);
    }
  }

  paperSizeSelect.addEventListener('change', renderPrintLayout);
  copyCountSelect.addEventListener('change', renderPrintLayout);
  renderPrintLayout();

  document.getElementById('printPreviewButton').addEventListener('click', renderPrintLayout);
  document.getElementById('printActionButton').addEventListener('click', () => window.print());
});
