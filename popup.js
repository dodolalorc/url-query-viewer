const els = {
  host: document.querySelector('#url-host'),
  path: document.querySelector('#url-path'),
  params: document.querySelector('#params'),
  count: document.querySelector('#param-count'),
  copyUrl: document.querySelector('#copy-url'),
  toast: document.querySelector('#toast'),
};

let currentUrl = '';
let toastTimer;

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('visible'), 1600);
}

async function copy(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${label}已复制`);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    showToast(copied ? `${label}已复制` : '复制失败，请重试');
  }
}

function renderParams(url) {
  const entries = [...url.searchParams.entries()];
  els.count.textContent = entries.length;
  els.params.replaceChildren();

  if (!entries.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = '这个页面的 URL 没有查询参数';
    els.params.append(empty);
    return;
  }

  entries.forEach(([key, value]) => {
    const row = document.createElement('div');
    row.className = 'param';

    const keyEl = document.createElement('span');
    keyEl.className = 'key';
    keyEl.textContent = key;
    keyEl.title = key;

    const valueEl = document.createElement('span');
    valueEl.className = 'value';
    valueEl.textContent = value || '（空值）';
    valueEl.title = value || '（空值）';

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-param';
    copyButton.type = 'button';
    copyButton.title = `复制 ${key}=${value}`;
    copyButton.setAttribute('aria-label', copyButton.title);
    copyButton.textContent = '⧉';
    copyButton.addEventListener('click', () => copy(`${key}=${value}`, '参数'));

    row.append(keyEl, valueEl, copyButton);
    els.params.append(row);
  });
}

async function initialize() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tab?.url) throw new Error('无法获取当前页面 URL');
    currentUrl = tab.url;
    const url = new URL(currentUrl);
    els.host.textContent = url.host || url.protocol;
    els.path.textContent = `${url.pathname}${url.hash}` || '/';
    renderParams(url);
  } catch (error) {
    els.host.textContent = '此页面无法读取';
    els.path.textContent = '';
    els.params.innerHTML = '<div class="empty error">请切换到普通网页后再打开扩展。</div>';
  }
}

els.copyUrl.addEventListener('click', () => currentUrl && copy(currentUrl, '完整 URL'));
initialize();
