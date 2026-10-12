document.addEventListener('DOMContentLoaded', () => {
  const featureList = document.getElementById('featureList');
  const configUrl = '/api/config';

  async function loadFeatures() {
    try {
      const response = await fetch(configUrl);
      const config = await response.json();
      const items = Object.entries(config.features);

      featureList.innerHTML = items.map(([key, value]) => {
        const enabled = value.enabled ? 'enabled' : 'disabled';
        return `
          <li class="feature-item">
            <div class="left">
              <span>${value.icon || '✨'}</span>
              <span>${value.label || key}</span>
            </div>
            <span class="feature-status ${enabled === 'disabled' ? 'disabled' : ''}"></span>
          </li>
        `;
      }).join('');
    } catch (error) {
      console.error('Failed to load config', error);
      featureList.innerHTML = '<li class="feature-item"><div class="left"><span>⚠️</span><span>Config loading failed</span></div></li>';
    }
  }

  loadFeatures();

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

  function applyImageToElement(input, targetImg, wrap) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      targetImg.src = e.target.result;
      targetImg.style.display = 'block';
      if (wrap) wrap.style.background = '#fff';
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('passportUpload').addEventListener('change', (event) => {
    applyImageToElement(event.target, document.getElementById('passportPreview'), document.getElementById('passportPreviewWrap'));
  });

  document.getElementById('textPassportUpload').addEventListener('change', (event) => {
    applyImageToElement(event.target, document.getElementById('textPassportPreview'), document.getElementById('textPassportPreviewWrap'));
  });

  document.getElementById('memorialUpload').addEventListener('change', (event) => {
    applyImageToElement(event.target, document.getElementById('memorialPreview'), document.getElementById('memorialCard'));
  });

  const passportName = document.getElementById('passportNameInput');
  const passportDate = document.getElementById('passportDateInput');
  const nameOverlay = document.getElementById('nameOverlay');
  const dateOverlay = document.getElementById('dateOverlay');

  function syncPassportText() {
    nameOverlay.textContent = passportName.value || 'Jayant Pawar';
    dateOverlay.textContent = passportDate.value || '01/01/2025';
  }

  passportName.addEventListener('input', syncPassportText);
  passportDate.addEventListener('input', syncPassportText);

  const memorialNameInput = document.getElementById('memorialNameInput');
  const memorialBirthInput = document.getElementById('memorialBirthInput');
  const memorialDeathInput = document.getElementById('memorialDeathInput');
  const memorialQuoteInput = document.getElementById('memorialQuoteInput');

  const memorialNameEl = document.getElementById('memorialName');
  const memorialBirthEl = document.getElementById('birthDateText');
  const memorialDeathEl = document.getElementById('deathDateText');
  const memorialQuoteEl = document.getElementById('memorialQuote');

  function syncMemorialText() {
    memorialNameEl.textContent = memorialNameInput.value || 'श्री नंदू';
    memorialBirthEl.textContent = memorialBirthInput.value || '01/01/2006';
    memorialDeathEl.textContent = memorialDeathInput.value || '08/10/2024';
    memorialQuoteEl.textContent = memorialQuoteInput.value || 'आपकी स्मृति हमारे साथ सदा रहेगी';
  }

  memorialNameInput.addEventListener('input', syncMemorialText);
  memorialBirthInput.addEventListener('input', syncMemorialText);
  memorialDeathInput.addEventListener('input', syncMemorialText);
  memorialQuoteInput.addEventListener('input', syncMemorialText);

  const passportBg = document.getElementById('passportBg');
  const passportWrap = document.getElementById('passportPreviewWrap');
  passportBg.addEventListener('change', () => {
    const bgMap = {
      white: '#ffffff',
      lightblue: '#e6f0ff',
      cream: '#f6f0e8'
    };
    passportWrap.style.background = bgMap[passportBg.value] || '#ffffff';
  });

  const printLayoutEl = document.getElementById('printLayout');
  const paperSizeSelect = document.getElementById('paperSizeSelect');
  const copyCountSelect = document.getElementById('copyCountSelect');

  function renderPrintLayout() {
    const count = Number(copyCountSelect.value || 10);
    const cells = [];

    for (let i = 1; i <= count; i++) {
      const cell = document.createElement('div');
      cell.className = 'print-cell';
      const label = document.createElement('div');
      label.textContent = `Photo ${i}`;
      const sub = document.createElement('span');
      sub.textContent = `${paperSizeSelect.value}`;
      cell.appendChild(label);
      cell.appendChild(sub);
      cells.push(cell);
    }

    printLayoutEl.innerHTML = '';
    cells.forEach((cell) => printLayoutEl.appendChild(cell));
  }

  paperSizeSelect.addEventListener('change', renderPrintLayout);
  copyCountSelect.addEventListener('change', renderPrintLayout);
  renderPrintLayout();

  document.getElementById('printPreviewButton').addEventListener('click', () => {
    renderPrintLayout();
  });

  document.getElementById('printActionButton').addEventListener('click', () => {
    window.print();
  });

  const chatInput = document.getElementById('chatInput');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendChat');

  function addChatMessage(message, who = 'bot') {
    const msg = document.createElement('div');
    msg.className = `message ${who}`;
    msg.textContent = message;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function handleAssistantCommand(command) {
    const lower = command.toLowerCase();
    if (lower.includes('brighten')) {
      addChatMessage('I increased the overall brightness and made the face a bit clearer.', 'bot');
      return;
    }
    if (lower.includes('white') || lower.includes('background')) {
      addChatMessage('Background updated to a clean white look for passport style.', 'bot');
      return;
    }
    if (lower.includes('name')) {
      addChatMessage('Name text has been added. You can update it from the form on the right.', 'bot');
      return;
    }
    if (lower.includes('memorial')) {
      addChatMessage('Switch to the Sradhanjali tab to create the memorial card layout.', 'bot');
      return;
    }
    addChatMessage('I can help with brightness, background, text, dates, and memorial layout.', 'bot');
  }

  sendBtn.addEventListener('click', () => {
    const value = chatInput.value.trim();
    if (!value) return;
    addChatMessage(value, 'user');
    handleAssistantCommand(value);
    chatInput.value = '';
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });

  document.querySelectorAll('.mini-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const command = btn.dataset.command;
      handleAssistantCommand(command);
    });
  });

  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('cameraCanvas');
  const capturedImage = document.getElementById('capturedImage');
  const captureBtn = document.getElementById('capturePhoto');
  const switchBtn = document.getElementById('switchCamera');

  const cameraState = {
    facingMode: 'user',
    stream: null
  };

  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      addChatMessage('Camera is not supported in this browser. Please use Chrome or Edge.', 'bot');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraState.facingMode },
        audio: false
      });
      cameraState.stream = stream;
      video.srcObject = stream;
      video.style.display = 'block';
    } catch (error) {
      addChatMessage('Camera permission was denied or no camera was found.', 'bot');
    }
  }

  captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    capturedImage.src = dataUrl;
    capturedImage.parentElement.style.display = 'block';
  });

  switchBtn.addEventListener('click', () => {
    cameraState.facingMode = cameraState.facingMode === 'user' ? 'environment' : 'user';
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }
    startCamera();
  });

  startCamera();

  const defaultImage = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%23f5f5f5"/><circle cx="200" cy="160" r="70" fill="%23d0d0d0"/><path d="M60 420 C80 330 120 280 200 280 C280 280 320 330 340 420 L340 500 L60 500 Z" fill="%23d0d0d0"/><text x="200" y="455" text-anchor="middle" font-size="22" fill="%2399a1b3" font-family="Arial">Add your photo</text></svg>';
  document.getElementById('passportPreview').src = defaultImage;
  document.getElementById('textPassportPreview').src = defaultImage;
  document.getElementById('memorialPreview').src = defaultImage;
  document.getElementById('passportPreview').style.display = 'block';
  document.getElementById('textPassportPreview').style.display = 'block';
  document.getElementById('memorialPreview').style.display = 'block';
  syncPassportText();
  syncMemorialText();
});
