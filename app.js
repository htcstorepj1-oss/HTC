let banco = [];

// carregar banco
async function carregarBanco() {
  let res = await fetch("banco.json");
  banco = await res.json();
}
carregarBanco();

// ENTER envia
function enter(e) {
  if (e.key === "Enter") perguntar();
}

// adicionar mensagem
function addMsg(texto, tipo) {
  let chat = document.getElementById("chat");

  let div = document.createElement("div");
  div.className = "msg " + tipo;

  // botão copiar
  let btn = document.createElement("button");
  btn.innerText = "📋";
  btn.onclick = () => navigator.clipboard.writeText(texto);

  div.innerText = texto;
  div.appendChild(btn);

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  salvarChat();
}

// loading
function loading() {
  let chat = document.getElementById("chat");
  let div = document.createElement("div");
  div.className = "msg bot";
  div.id = "loading";
  div.innerText = "IA está digitando...";
  chat.appendChild(div);
}

// remover loading
function removeLoading() {
  let l = document.getElementById("loading");
  if (l) l.remove();
}

// salvar conversa
function salvarChat() {
  localStorage.setItem("chat", document.getElementById("chat").innerHTML);
}

// carregar conversa
function carregarChat() {
  let chat = localStorage.getItem("chat");
  if (chat) document.getElementById("chat").innerHTML = chat;
}

carregarChat();

// tema
function toggleTema() {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
}

// função principal
async function perguntar() {
  let input = document.getElementById("input").value;
  if (!input) return;

  addMsg(input, "user");
  document.getElementById("input").value = "";

  loading();

  input = corrigir(input);

  let memoria = carregarMemoria();

  let resposta =
    buscarResposta(input, memoria) ||
    buscarResposta(input, banco);

  if (resposta) {
    removeLoading();
    addMsg(resposta, "bot");
    return;
  }

  // Wikipedia
  try {
    let res = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(input)}`);
    let data = await res.json();

    if (data.extract) {
      removeLoading();
      addMsg(data.extract, "bot");
      salvarMemoria(input, data.extract);
      return;
    }
  } catch {}

  // DuckDuckGo
  try {
    let res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(input)}&format=json`);
    let data = await res.json();

    if (data.Abstract) {
      removeLoading();
      addMsg(data.Abstract, "bot");
      salvarMemoria(input, data.Abstract);
      return;
    }
  } catch {}

  removeLoading();
  addMsg("Não sei ainda 😅", "bot");
}