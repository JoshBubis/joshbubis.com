/* Studio chat widget — talks to hub.joshbubis.com concierge endpoints.
   Beta gate (off = public): when true, renders only when
   localStorage jb_chat_beta === "1". */
(function () {
  var BETA_GATE = false;
  try {
    if (BETA_GATE && window.localStorage.getItem("jb_chat_beta") !== "1") return;
  } catch (_) {
    return;
  }

  var LOCAL = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  var HUB = LOCAL ? "http://localhost:3000" : "https://hub.joshbubis.com";
  var CONFIG_URL = HUB + "/webhooks/contact/site_config";
  var CHAT_URL = HUB + "/webhooks/chat";
  var TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

  var POLL_ACTIVE_MS = 2500;
  var POLL_IDLE_MS = 8000;
  var IDLE_AFTER_MS = 60000;
  var MAX_LEN = 2000;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var token = null;
  var sinceId = 0;
  var status = "ai";
  var open = false;
  var pollTimer = null;
  var lastActivity = Date.now();
  var sending = false;
  var turnstileToken = "";
  var turnstileLoaded = false;

  try {
    token = window.localStorage.getItem("jb_chat_token") || null;
    sinceId = parseInt(window.localStorage.getItem("jb_chat_since") || "0", 10) || 0;
  } catch (_) {}

  /* —— DOM —— */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  var fab = el("button", "chat-fab");
  fab.type = "button";
  fab.setAttribute("aria-label", "Open studio chat");
  fab.setAttribute("aria-expanded", "false");
  fab.innerHTML = '<span class="jb-mark" aria-hidden="true"><span class="jb-mark__j">J</span>B</span><span aria-hidden="true">Chat</span>';

  var panel = el("aside", "chat-panel");
  panel.hidden = true;
  panel.setAttribute("aria-label", "Studio chat");

  var head = el("header", "chat-panel__head");
  var headTitle = el("p", "chat-panel__title");
  headTitle.innerHTML = '<span class="jb-mark" aria-hidden="true"><span class="jb-mark__j">J</span>B</span><span>Studio chat</span>';
  var headStatus = el("p", "chat-panel__status", "Scoping questions welcome — Josh can join live.");
  var closeBtn = el("button", "chat-panel__close");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close chat");
  closeBtn.innerHTML = "&times;";
  head.appendChild(headTitle);
  head.appendChild(closeBtn);

  var log = el("div", "chat-log");
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");

  var preChat = el("div", "chat-prechat");
  preChat.appendChild(el("p", "chat-prechat__lead", "Tell me what you’re building — I’ll help scope it, and Josh can jump in live."));
  var tsContainer = el("div", "chat-turnstile");
  preChat.appendChild(tsContainer);
  var tsStatus = el("p", "chat-note", "Loading bot check…");
  preChat.appendChild(tsStatus);

  var note = el("p", "chat-note");
  note.hidden = true;

  var form = el("form", "chat-form");
  var input = el("textarea", "chat-input");
  input.rows = 2;
  input.maxLength = MAX_LEN;
  input.placeholder = "Your message…";
  input.setAttribute("aria-label", "Your message");
  /* Honeypot mirror of the contact form's */
  var hp = document.createElement("input");
  hp.type = "text";
  hp.name = "company";
  hp.className = "chat-hp";
  hp.tabIndex = -1;
  hp.autocomplete = "off";
  hp.setAttribute("aria-hidden", "true");
  var sendBtn = el("button", "btn btn-primary chat-send", "Send");
  sendBtn.type = "submit";
  sendBtn.disabled = true;
  form.appendChild(input);
  form.appendChild(hp);
  form.appendChild(sendBtn);

  panel.appendChild(head);
  panel.appendChild(headStatus);
  panel.appendChild(log);
  panel.appendChild(preChat);
  panel.appendChild(note);
  panel.appendChild(form);

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  /* —— Rendering —— */

  var ROLE_LABELS = { assistant: "Assistant", josh: "Josh", system: "" };

  function appendMessage(message) {
    var row = el("div", "chat-msg chat-msg--" + message.role);
    if (message.role !== "visitor" && ROLE_LABELS[message.role]) {
      row.appendChild(el("span", "chat-msg__who", ROLE_LABELS[message.role]));
    }
    row.appendChild(el("p", "chat-msg__body", message.body));
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function showNote(text, withContactLink) {
    note.hidden = false;
    note.textContent = text + (withContactLink ? " " : "");
    if (withContactLink) {
      var a = document.createElement("a");
      a.href = "contact.html";
      a.textContent = "Use the contact form";
      note.appendChild(a);
      note.appendChild(document.createTextNode("."));
    }
  }

  function setStatus(next) {
    if (next === status) return;
    status = next;
    if (status === "human") {
      headStatus.textContent = "Josh is in this chat.";
      headStatus.classList.add("chat-panel__status--live");
    } else if (status === "closed") {
      headStatus.textContent = "This chat has ended.";
      headStatus.classList.remove("chat-panel__status--live");
      input.disabled = true;
      sendBtn.disabled = true;
      showRestart();
    }
  }

  function showRestart() {
    var btn = el("button", "btn btn-ghost chat-restart", "Start a new chat");
    btn.type = "button";
    btn.addEventListener("click", function () {
      try {
        window.localStorage.removeItem("jb_chat_token");
        window.localStorage.removeItem("jb_chat_since");
      } catch (_) {}
      window.location.reload();
    });
    note.hidden = false;
    note.textContent = "";
    note.appendChild(btn);
  }

  function persist() {
    try {
      if (token) window.localStorage.setItem("jb_chat_token", token);
      window.localStorage.setItem("jb_chat_since", String(sinceId));
    } catch (_) {}
  }

  function ingest(payload) {
    if (!payload) return;
    (payload.messages || []).forEach(function (m) {
      if (m.id > sinceId) {
        sinceId = m.id;
        appendMessage(m);
        lastActivity = Date.now();
      }
    });
    if (payload.status) setStatus(payload.status);
    persist();
  }

  /* —— Networking —— */

  function api(path, options) {
    return fetch(path, options).then(function (r) {
      return r.json().then(function (body) {
        return { ok: r.ok, status: r.status, body: body };
      });
    });
  }

  function formBody(fields) {
    var params = new URLSearchParams();
    Object.keys(fields).forEach(function (k) {
      params.append(k, fields[k]);
    });
    return params;
  }

  function startConversation(message) {
    return api(CHAT_URL, {
      method: "POST",
      body: formBody({
        message: message,
        cf_turnstile_response: turnstileToken,
        company: hp.value,
        page_url: window.location.href
      })
    }).then(function (res) {
      if (!res.ok || !res.body.token) {
        throw new Error((res.body && res.body.error) || "start failed");
      }
      token = res.body.token;
      preChat.hidden = true;
      ingest(res.body);
      startPolling();
    });
  }

  function sendMessage(message) {
    return api(CHAT_URL + "/" + encodeURIComponent(token) + "/messages", {
      method: "POST",
      body: formBody({ message: message })
    }).then(function (res) {
      if (res.status === 404 || res.status === 410) {
        setStatus("closed");
        return;
      }
      if (!res.ok) {
        showNote((res.body && res.body.error) || "That didn’t send — try again.", false);
        return;
      }
      note.hidden = true;
      ingest({ status: res.body.status, messages: [ res.body.message ] });
    });
  }

  function poll() {
    if (!token || !open || document.hidden) return;
    api(CHAT_URL + "/" + encodeURIComponent(token) + "/messages?since_id=" + sinceId, { method: "GET" })
      .then(function (res) {
        if (res.status === 404) {
          setStatus("closed");
          return;
        }
        if (res.ok) ingest(res.body);
      })
      .catch(function () { /* transient — next tick retries */ })
      .then(scheduleNextPoll);
  }

  function scheduleNextPoll() {
    if (!token || !open || status === "closed") return;
    var idle = Date.now() - lastActivity > IDLE_AFTER_MS;
    pollTimer = window.setTimeout(poll, idle ? POLL_IDLE_MS : POLL_ACTIVE_MS);
  }

  function startPolling() {
    stopPolling();
    if (token && open && status !== "closed") pollTimer = window.setTimeout(poll, POLL_ACTIVE_MS);
  }

  function stopPolling() {
    if (pollTimer) {
      window.clearTimeout(pollTimer);
      pollTimer = null;
    }
  }

  /* —— Turnstile (pre-chat only) —— */

  function loadTurnstile() {
    if (turnstileLoaded || token) return;
    turnstileLoaded = true;

    api(CONFIG_URL, { credentials: "omit" })
      .then(function (res) {
        if (!res.ok || !res.body.configured || !res.body.sitekey) throw new Error("not configured");
        var script = document.createElement("script");
        script.src = TURNSTILE_SRC;
        script.async = true;
        script.onload = function () {
          renderTurnstile(res.body.sitekey);
        };
        script.onerror = function () {
          tsStatus.textContent = "Chat’s offline right now.";
          showNote("", true);
        };
        document.head.appendChild(script);
      })
      .catch(function () {
        tsStatus.textContent = "Chat’s offline right now.";
        showNote("", true);
      });
  }

  function renderTurnstile(sitekey) {
    function tryRender() {
      if (typeof turnstile === "undefined") {
        window.setTimeout(tryRender, 80);
        return;
      }
      turnstile.render(tsContainer, {
        sitekey: sitekey,
        theme: "light",
        "refresh-expired": "auto",
        callback: function (t) {
          turnstileToken = t;
          sendBtn.disabled = false;
          tsStatus.textContent = "";
        },
        "error-callback": function () {
          tsStatus.textContent = "Bot check failed to load. Refresh and try again.";
          sendBtn.disabled = true;
        },
        "expired-callback": function () {
          turnstileToken = "";
          sendBtn.disabled = true;
          tsStatus.textContent = "Bot check expired — complete it again.";
        }
      });
    }
    tryRender();
  }

  /* —— Resume an existing conversation —— */

  function resume() {
    preChat.hidden = true;
    sendBtn.disabled = false;
    var from = sinceId;
    sinceId = 0; // re-render the whole transcript into the fresh log
    api(CHAT_URL + "/" + encodeURIComponent(token) + "/messages?since_id=0", { method: "GET" })
      .then(function (res) {
        if (res.status === 404) {
          token = null;
          sinceId = from;
          preChat.hidden = false;
          sendBtn.disabled = true;
          loadTurnstile();
          return;
        }
        if (res.ok) {
          ingest(res.body);
          startPolling();
        } else {
          showNote("Chat’s offline right now.", true);
        }
      })
      .catch(function () {
        showNote("Chat’s offline right now.", true);
      });
  }

  /* —— Events —— */

  function openPanel() {
    open = true;
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    if (!reduceMotion) panel.classList.add("chat-panel--in");
    if (token) {
      if (!log.childNodes.length) resume();
      else startPolling();
    } else {
      loadTurnstile();
    }
    input.focus();
  }

  function closePanel() {
    open = false;
    panel.hidden = true;
    panel.classList.remove("chat-panel--in");
    fab.setAttribute("aria-expanded", "false");
    stopPolling();
  }

  fab.addEventListener("click", function () {
    open ? closePanel() : openPanel();
  });
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) closePanel();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopPolling();
    else if (open) startPolling();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;
    var message = input.value.trim();
    if (!message) return;
    if (!token && !turnstileToken) {
      tsStatus.textContent = "Please complete the bot check first.";
      return;
    }

    sending = true;
    sendBtn.disabled = true;
    var run = token ? sendMessage(message) : startConversation(message);
    run
      .then(function () {
        input.value = "";
      })
      .catch(function (err) {
        showNote(err.message === "start failed" ? "Couldn’t start the chat." : (err.message || "Something went wrong."), true);
      })
      .then(function () {
        sending = false;
        if (status !== "closed") sendBtn.disabled = false;
        input.focus();
      });
  });

  /* Enter sends; Shift+Enter for a newline */
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  });
})();
