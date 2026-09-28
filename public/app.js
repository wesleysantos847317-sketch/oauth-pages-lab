const statusNode = document.getElementById('status');
const profileNode = document.getElementById('user-profile');
const logoutBtn = document.getElementById('logout-btn');
const healthBtn = document.getElementById('health-check');

const setStatus = (message, type = 'offline') => {
  statusNode.textContent = message;
  statusNode.classList.toggle('status-online', type === 'online');
  statusNode.classList.toggle('status-offline', type !== 'online');
};

const renderUser = (user) => {
  if (!user) {
    profileNode.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    setStatus('Ainda não autenticado.', 'offline');
    return;
  }

  profileNode.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');

  document.getElementById('avatar').textContent = (user.name || 'U').charAt(0).toUpperCase();
  document.getElementById('user-name').textContent = user.name || 'Usuário';
  document.getElementById('user-email').textContent = user.email || 'email@exemplo.com';
  document.getElementById('user-provider').textContent = `Provedor: ${user.provider || 'oauth'}`;
  setStatus('Sessão autenticada com sucesso.', 'online');
};

async function loadSession() {
  try {
    const response = await fetch('/api/me');
    if (!response.ok) {
      renderUser(null);
      return;
    }

    const payload = await response.json();
    renderUser(payload.user || null);
  } catch (error) {
    console.error('Erro ao carregar sessão:', error);
    renderUser(null);
  }
}

async function checkHealth() {
  try {
    const response = await fetch('/api/health');
    const payload = await response.json();
    setStatus(`API ok: ${payload.status} · ${payload.timestamp}`, 'online');
  } catch (error) {
    setStatus('Falha ao acessar a API.', 'offline');
  }
}

const providerButtons = document.querySelectorAll('[data-provider]');
providerButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const provider = button.dataset.provider;
    window.location.href = `/oauth/login/${provider}`;
  });
});

logoutBtn.addEventListener('click', () => {
  window.location.href = '/oauth/logout';
});

healthBtn.addEventListener('click', checkHealth);

loadSession();
