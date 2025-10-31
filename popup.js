document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('toggleBtn');
  const btnText = document.getElementById('btnText');
  const statusEl = document.getElementById('status');

  // Verifica o status atual
  function updateUI(isActive) {
    if (isActive) {
      toggleBtn.classList.add('active');
      btnText.textContent = 'Desativar Detecção';
      statusEl.textContent = 'Ativo';
      statusEl.classList.add('active');
    } else {
      toggleBtn.classList.remove('active');
      btnText.textContent = 'Ativar Detecção';
      statusEl.textContent = 'Inativo';
      statusEl.classList.remove('active');
    }
  }

  // Obtém o status inicial
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, function(response) {
      if (response) {
        updateUI(response.active);
      }
    });
  });

  // Toggle ao clicar no botão
  toggleBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' }, function(response) {
        if (response) {
          updateUI(response.active);
        }
      });
    });
  });
});

