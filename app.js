let banco = [];

async function carregarBanco() {
  let res = await fetch("banco.json");
  banco = await res.json();
}
carregarBanco();

function enter(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    perguntar();
  }
}

function criarMsg(texto, tipo) {
  let chat = document.getElementById("chat");

  let msg = document.createElement("div");
  msg.className = "msg " + tipo;

  let avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.style.background = tipo === "user" ? "#10a37f" : "#555";

  let bubble = document.createElement("div");
  bubble.className = "bubble";

  let copy = document.createElement("span");
  copy.innerText = "📋";
  copy.className = "copy";
  copy.onclick = () => navigator.clipboard.writeText(texto);

  bubble.innerHTML = formatar(texto);
  bubble.appendChild(copy);

  msg.appendChild(avatar);
  msg.appendChild(bubble);

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// markdown simples
function formatar(txt) {
  return txt
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}

function loading() {
  criarMsg("Pensando", "bot");
}

async function perguntar() {
  let input = document.getElementById("input").value;
  if (!input) return;

  criarMsg(input, "user");
  document.getElementById("input").value = "";

  loading();

  input = corrigir(input);
  let memoria = carregarMemoria();

  let resposta =
    buscarResposta(input, memoria) ||
    buscarResposta(input, banco);

  if (resposta) {
    criarMsg(resposta, "bot");
    return;
  }

  // Wikipedia
  try {
    let res = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(input)}`);
    let data = await res.json();

    if (data.extract) {
      criarMsg(data.extract, "bot");
      salvarMemoria(input, data.extract);
      return;
    }
  } catch {}

  criarMsg("Não sei ainda 😅", "bot");
}