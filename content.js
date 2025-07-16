// Chat Sidebar, WA Version 2.3000.1024692679
const targetSelector = '#app > div > div.x78zum5.xdt5ytf.x5yr21d > div > div._aigw._as6h.x9f619.x1n2onr6.x5yr21d.x17dzmu4.x1i1dayz.x2ipvbc.x1w8yi2h.x78zum5.xdt5ytf.xa1v5g2.x1plvlek.xryxfnj.x14bqcqg.x18dvir5.xxljpkc.xwfak60.x18pi947';

function createSettingsPanel() {
  const panel = document.createElement('div');
  panel.id = 'wa-settings-panel';
  panel.innerHTML = `
    <h4>WhatsApp Blur Settings</h4>
    <label>
      <input type="checkbox" id="wa-enable-blur" />
      Enable Blur
    </label>
    <label>
      Blur Amount (px):<br />
      <input type="number" id="wa-blur-amount" min="0" />
    </label>
    <label>
      Blur Delay (ms):<br />
      <input type="number" id="wa-blur-delay" min="0" />
    </label>
    <button id="wa-save-settings">Save</button>
    <div id="wa-settings-status" style="margin-top:8px; color:green;"></div>
  `;
  document.body.appendChild(panel);

  // Load saved values
  chrome.storage.sync.get(['enableBlur', 'blurAmount', 'blurDelay'], (data) => {
    document.getElementById('wa-enable-blur').checked = data.enableBlur === true;
    document.getElementById('wa-blur-amount').value = data.blurAmount ?? 5;
    document.getElementById('wa-blur-delay').value = data.blurDelay ?? 0;
  });

  // Save settings
  document.getElementById('wa-save-settings').onclick = () => {
    const enableBlur = document.getElementById('wa-enable-blur').checked;
    const blurAmount = parseInt(document.getElementById('wa-blur-amount').value) || 5;
    const blurDelay = parseInt(document.getElementById('wa-blur-delay').value) || 0;

    chrome.storage.sync.set({ enableBlur, blurAmount, blurDelay }, () => {
      document.getElementById('wa-settings-status').textContent = 'Saved!';
      setTimeout(() => {
        document.getElementById('wa-settings-status').textContent = '';
      }, 1500);
    });

    // Update
    const target = document.querySelector(targetSelector);
    updateSettings(target);
  };
}
createSettingsPanel();

chrome.storage.sync.get([
  'enableBlur',
  'blurAmount',
  'blurDelay'
], ({ enableBlur, blurAmount, blurDelay }) => {

  const waitForElement = (selector, callback) => {
    const el = document.querySelector(selector);
    if (el) {
      callback(el);
    } else {
      setTimeout(() => waitForElement(selector, callback), 500);
    }
  };

  const createToggle = (target) => {
    const settingsBtn = document.createElement("button");
    settingsBtn.title = "Chats Hider Settings";
    settingsBtn.id = "wa-settings-button";
    settingsBtn.classList.add("wa-button");
    settingsBtn.innerHTML = `
      <svg style="enable-background:new 0 0 24 24;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><g id="settings2"><path d="M5,11h14c2.2,0,4-1.8,4-4c0-2.2-1.8-4-4-4H5C2.8,3,1,4.8,1,7C1,9.2,2.8,11,5,11z M5,5c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2    S3,8.1,3,7C3,5.9,3.9,5,5,5z"/><path d="M19,13H5c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4h14c2.2,0,4-1.8,4-4C23,14.8,21.2,13,19,13z M19,19c-1.1,0-2-0.9-2-2    c0-1.1,0.9-2,2-2s2,0.9,2,2C21,18.1,20.1,19,19,19z"/></g></g></svg>
    `;

    settingsBtn.onclick = () => {
      const panel = document.getElementById('wa-settings-panel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };

    const toggleBtn = document.createElement("button");
    toggleBtn.title = "Hide Chats Sidebar";
    toggleBtn.id = "wa-toggle-button";
    toggleBtn.classList.add("wa-button");
    toggleBtn.innerHTML = `
      <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M8.073 12.194 4.212 8.333c-1.52 1.657-2.096 3.317-2.106 3.351L2 12l.105.316C2.127 12.383 4.421 19 12.054 19c.929 0 1.775-.102 2.552-.273l-2.746-2.746a3.987 3.987 0 0 1-3.787-3.787zM12.054 5c-1.855 0-3.375.404-4.642.998L3.707 2.293 2.293 3.707l18 18 1.414-1.414-3.298-3.298c2.638-1.953 3.579-4.637 3.593-4.679l.105-.316-.105-.316C21.98 11.617 19.687 5 12.054 5zm1.906 7.546c.187-.677.028-1.439-.492-1.96s-1.283-.679-1.96-.492L10 8.586A3.955 3.955 0 0 1 12.054 8c2.206 0 4 1.794 4 4a3.94 3.94 0 0 1-.587 2.053l-1.507-1.507z"/></svg>
    `;

    toggleBtn.onclick = () => {
      target.style.display = target.style.display === "none" ? "" : "none";
    };

    // Inject the toggle into WhatsApp's top bar
    const waSettingsSidebar = document.querySelector(
      '#app > div > div.x78zum5.xdt5ytf.x5yr21d > div > header > div > div:nth-child(2) > div'
    );
    if (waSettingsSidebar) {
      if (!document.querySelector(`#${toggleBtn.id}`))
        waSettingsSidebar.insertAdjacentElement("afterbegin", toggleBtn);

      if (!document.querySelector(`#${settingsBtn.id}`))
        waSettingsSidebar.insertAdjacentElement("afterbegin", settingsBtn);
    }

  };

  waitForElement(targetSelector, (target) => {
    updateSettings(target);
    createToggle(target);
  });


});

function updateSettings(target) {
  chrome.storage.sync.get([
    'enableBlur',
    'blurAmount',
    'blurDelay'
  ], ({ enableBlur, blurAmount, blurDelay }) => {
    target.style.setProperty('--wa-blur', `${blurAmount || 5}px`);
    target.style.setProperty('--wa-blur-delay', `${blurDelay || 20}ms`);

  if (enableBlur) {
    target.classList.add('wa-blur');
  } else {
    target.classList.remove('wa-blur');
  }

})};

