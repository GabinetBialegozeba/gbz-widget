(function() {
  // =============================================
  // CONFIGURATION
  // =============================================
  var WEBHOOK_URL = 'https://n8n.srv1542766.hstgr.cloud/webhook/6effdeb8-318d-4050-b455-a895d21740f1';
  var GREETING    = 'Cześć! Nazywam się Asystuś i jestem inteligentnym doradcą pacjenta w Gabinecie Białego Zęba. Chętnie odpowiem na Twoje pytanie 👨‍⚕️🦷';
  // =============================================

  // Inject CSS
  var style = document.createElement('style');
  style.textContent = ''
    + ':root {'
    + '  --gbz-blue: #443fd4;'
    + '  --gbz-blue-hover: #3733b0;'
    + '  --gbz-white: #ffffff;'
    + '  --gbz-light: #f4f4f8;'
    + '  --gbz-gray: #6b7280;'
    + '  --gbz-shadow: 0 8px 30px rgba(68, 63, 212, 0.25);'
    + '}'
    + '#gbz-chat-toggle {'
    + '  position: fixed; bottom: 20px; right: 20px; z-index: 99999;'
    + '  width: 60px; height: 60px; border-radius: 50%;'
    + '  background: var(--gbz-blue); border: none; cursor: pointer;'
    + '  box-shadow: var(--gbz-shadow); display: flex;'
    + '  align-items: center; justify-content: center;'
    + '  transition: transform 0.2s ease, background 0.2s ease;'
    + '}'
    + '#gbz-chat-toggle:hover { transform: scale(1.08); background: var(--gbz-blue-hover); }'
    + '#gbz-chat-toggle svg { width: 28px; height: 28px; fill: var(--gbz-white); }'
    + '#gbz-chat-toggle .gbz-close-icon { display: none; }'
    + '#gbz-chat-toggle.gbz-open .gbz-chat-icon { display: none; }'
    + '#gbz-chat-toggle.gbz-open .gbz-close-icon { display: block; }'
    + '#gbz-chat-panel {'
    + '  position: fixed; bottom: 92px; right: 20px; z-index: 99998;'
    + '  width: 380px; max-height: 520px; background: var(--gbz-white);'
    + '  border-radius: 16px; box-shadow: var(--gbz-shadow);'
    + '  display: flex; flex-direction: column; overflow: hidden;'
    + '  opacity: 0; transform: translateY(16px) scale(0.96);'
    + '  pointer-events: none; transition: opacity 0.25s ease, transform 0.25s ease;'
    + '}'
    + '#gbz-chat-panel.gbz-visible {'
    + '  opacity: 1; transform: translateY(0) scale(1); pointer-events: auto;'
    + '}'
    + '#gbz-chat-header {'
    + '  background: var(--gbz-blue); color: var(--gbz-white);'
    + '  padding: 16px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;'
    + '  display: flex; align-items: center; gap: 12px; flex-shrink: 0;'
    + '}'
    + '#gbz-chat-header .gbz-avatar {'
    + '  width: 36px; height: 36px; border-radius: 50%;'
    + '  background: rgba(255,255,255,0.2); display: flex;'
    + '  align-items: center; justify-content: center;'
    + '  font-size: 18px; flex-shrink: 0;'
    + '}'
    + '#gbz-chat-header .gbz-header-text { display: flex; flex-direction: column; gap: 2px; }'
    + '#gbz-chat-header .gbz-header-name { font-weight: 600; font-size: 15px; letter-spacing: 0.01em; }'
    + '#gbz-chat-header .gbz-header-status { font-size: 12px; opacity: 0.85; }'
    + '#gbz-chat-messages {'
    + '  flex: 1; overflow-y: auto; padding: 16px;'
    + '  display: flex; flex-direction: column; gap: 10px;'
    + '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;'
    + '  font-size: 14px; line-height: 1.5; background: var(--gbz-light);'
    + '  min-height: 280px; max-height: 340px;'
    + '}'
    + '#gbz-chat-messages::-webkit-scrollbar { width: 5px; }'
    + '#gbz-chat-messages::-webkit-scrollbar-thumb {'
    + '  background: rgba(68, 63, 212, 0.2); border-radius: 10px;'
    + '}'
    + '.gbz-msg {'
    + '  max-width: 82%; padding: 10px 14px; border-radius: 14px;'
    + '  word-wrap: break-word; white-space: pre-wrap;'
    + '  animation: gbzFadeIn 0.2s ease;'
    + '}'
    + '.gbz-msg a { color: var(--gbz-blue); text-decoration: underline; word-break: break-all; }'
    + '.gbz-msg.gbz-bot a { color: var(--gbz-blue); }'
    + '@keyframes gbzFadeIn {'
    + '  from { opacity: 0; transform: translateY(6px); }'
    + '  to { opacity: 1; transform: translateY(0); }'
    + '}'
    + '.gbz-msg.gbz-bot {'
    + '  align-self: flex-start; background: var(--gbz-white);'
    + '  color: #1f2937; border-bottom-left-radius: 4px;'
    + '}'
    + '.gbz-msg.gbz-user {'
    + '  align-self: flex-end; background: var(--gbz-blue);'
    + '  color: var(--gbz-white); border-bottom-right-radius: 4px;'
    + '}'
    + '.gbz-typing { display: flex; gap: 5px; padding: 12px 18px; align-items: center; }'
    + '.gbz-typing span {'
    + '  width: 7px; height: 7px; border-radius: 50%;'
    + '  background: var(--gbz-gray); animation: gbzBounce 1.2s infinite ease-in-out;'
    + '}'
    + '.gbz-typing span:nth-child(2) { animation-delay: 0.15s; }'
    + '.gbz-typing span:nth-child(3) { animation-delay: 0.3s; }'
    + '@keyframes gbzBounce {'
    + '  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }'
    + '  30% { transform: translateY(-6px); opacity: 1; }'
    + '}'
    + '#gbz-chat-input-area {'
    + '  display: flex; align-items: center; padding: 12px 14px;'
    + '  border-top: 1px solid #e5e7eb; background: var(--gbz-white);'
    + '  gap: 8px; flex-shrink: 0;'
    + '}'
    + '#gbz-chat-input {'
    + '  flex: 1; border: 1px solid #e5e7eb; border-radius: 24px;'
    + '  padding: 10px 16px; font-size: 14px;'
    + '  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;'
    + '  outline: none; transition: border-color 0.2s ease;'
    + '  background: var(--gbz-light);'
    + '}'
    + '#gbz-chat-input:focus { border-color: var(--gbz-blue); }'
    + '#gbz-chat-input::placeholder { color: #9ca3af; }'
    + '#gbz-chat-send {'
    + '  width: 40px; height: 40px; border-radius: 50%; border: none;'
    + '  background: var(--gbz-blue); cursor: pointer; display: flex;'
    + '  align-items: center; justify-content: center; flex-shrink: 0;'
    + '  transition: background 0.2s ease;'
    + '}'
    + '#gbz-chat-send:hover { background: var(--gbz-blue-hover); }'
    + '#gbz-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }'
    + '#gbz-chat-send svg { width: 18px; height: 18px; fill: var(--gbz-white); }'
    + '@media (max-width: 480px) {'
    + '  #gbz-chat-panel {'
    + '    width: calc(100vw - 24px); right: 12px; bottom: 88px;'
    + '    max-height: calc(100dvh - 120px); border-radius: 14px;'
    + '  }'
    + '  #gbz-chat-messages { min-height: 200px; max-height: calc(100dvh - 280px); }'
    + '}';
  document.head.appendChild(style);

  // Inject HTML
  var wrapper = document.createElement('div');
  wrapper.innerHTML = ''
    + '<button id="gbz-chat-toggle" aria-label="Otw\u00F3rz czat">'
    +   '<svg class="gbz-chat-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
    +     '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>'
    +     '<path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>'
    +   '</svg>'
    +   '<svg class="gbz-close-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
    +     '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>'
    +   '</svg>'
    + '</button>'
    + '<div id="gbz-chat-panel">'
    +   '<div id="gbz-chat-header">'
    +     '<div class="gbz-avatar">\uD83E\uDDB7</div>'
    +     '<div class="gbz-header-text">'
    +       '<div class="gbz-header-name">Gabinet Bia\u0142ego Z\u0119ba</div>'
    +       '<div class="gbz-header-status">Online</div>'
    +     '</div>'
    +   '</div>'
    +   '<div id="gbz-chat-messages"></div>'
    +   '<div id="gbz-chat-input-area">'
    +     '<input id="gbz-chat-input" type="text" placeholder="Napisz wiadomo\u015B\u0107..." autocomplete="off" />'
    +     '<button id="gbz-chat-send" aria-label="Wy\u015Blij" disabled>'
    +       '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
    +         '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>'
    +       '</svg>'
    +     '</button>'
    +   '</div>'
    + '</div>';
  document.body.appendChild(wrapper);

  // Widget logic
  var panel    = document.getElementById('gbz-chat-panel');
  var toggle   = document.getElementById('gbz-chat-toggle');
  var messages = document.getElementById('gbz-chat-messages');
  var input    = document.getElementById('gbz-chat-input');
  var sendBtn  = document.getElementById('gbz-chat-send');
  var isOpen   = false;
  var isSending = false;

  var sessionId = sessionStorage.getItem('gbz_sid');
  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : ('gbz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10));
    sessionStorage.setItem('gbz_sid', sessionId);
  }

  function openChat() {
    isOpen = true;
    panel.classList.add('gbz-visible');
    toggle.classList.add('gbz-open');
    input.focus();
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('gbz-visible');
    toggle.classList.remove('gbz-open');
  }

  toggle.addEventListener('click', function() {
    if (isOpen) { closeChat(); } else { openChat(); }
  });

  function linkify(text) {
    return text.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function addMessage(text, sender) {
    var div = document.createElement('div');
    div.className = 'gbz-msg ' + sender;
    if (sender === 'gbz-bot') {
      div.innerHTML = linkify(text);
    } else {
      div.textContent = text;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'gbz-msg gbz-bot';
    div.id = 'gbz-typing-indicator';
    div.innerHTML = '<div class="gbz-typing"><span></span><span></span><span></span></div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    var el = document.getElementById('gbz-typing-indicator');
    if (el) el.remove();
  }

  function sendMessage() {
    var text = input.value.trim();
    if (!text || isSending) return;

    isSending = true;
    sendBtn.disabled = true;
    input.value = '';

    addMessage(text, 'gbz-user');
    showTyping();

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        sessionId: sessionId
      })
    })
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(data) {
      removeTyping();
      var reply = (data && data.response) ? data.response : 'Przepraszamy, wyst\u0105pi\u0142 problem techniczny. Prosimy o kontakt telefoniczny: +48 32 132 27 49 \uD83D\uDE0A';
      addMessage(reply, 'gbz-bot');
    })
    .catch(function() {
      removeTyping();
      addMessage('Przepraszamy, wyst\u0105pi\u0142 problem techniczny. Prosimy o kontakt telefoniczny: +48 32 132 27 49 \uD83D\uDE0A', 'gbz-bot');
    })
    .finally(function() {
      isSending = false;
      sendBtn.disabled = !input.value.trim();
      input.focus();
    });
  }

  sendBtn.addEventListener('click', sendMessage);

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  input.addEventListener('input', function() {
    sendBtn.disabled = !input.value.trim() || isSending;
  });

  var isMobile = window.innerWidth <= 480;
  if (!isMobile) {
    var alreadyGreeted = sessionStorage.getItem('gbz_greeted');
    if (!alreadyGreeted) {
      setTimeout(function() {
        openChat();
        addMessage(GREETING, 'gbz-bot');
        sessionStorage.setItem('gbz_greeted', '1');
      }, 4000);
    } else {
      addMessage(GREETING, 'gbz-bot');
    }
  } else {
    addMessage(GREETING, 'gbz-bot');
  }
})();
