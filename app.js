let banco = [];

async function carregarBanco() {
  let res = await fetch("banco.json");
  banco = await res.json();
}
carregarBanco();

function enter(e) {
  if (e.key === "Enter") perguntar();
}

function digitar(texto, div) {
  let i = 0;
  let intervalo = setInterval(() => {
    div.innerText += texto[i];
    i++;
    if (i >= texto.length) clearInterval(intervalo);
  }, 15);
}

function addMsg(texto, tipo) {
  let chat = document.getElementById("chat");

  let div = document.createElement("div");
  div.className = "msg " + tipo;

  let btn = document.createElement("button");
  btn.innerText = "📋";
  btn.className = "copy";
  btn.onclick = () => navigator.clipboard.writeText(texto);

  chat.appendChild(div);

  if (tipo === "bot") {
    digitar(texto, div);
  } else {
    div.innerText = texto;
  }

  div.appendChild(btn);

  chat.scrollTop = chat.scrollHeight;
}

async function perguntar() {
  let input = document.getElementById("input").value;
  if (!input) return;

  addMsg(input, "user");
  document.getElementById("input").value = "";

  input = corrigir(input);

  let memoria = carregarMemoria();

  let resposta =
    buscarResposta(input, memoria) ||
    buscarResposta(input, banco);

  if (resposta) {
    addMsg(resposta, "bot");
    return;
  }

  // Wikipedia
  try {
    let res = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(input)}`);
    let data = await res.json();

    if (data.extract) {
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
      addMsg(data.Abstract, "bot");
      salvarMemoria(input, data.Abstract);
      return;
    }
  } catch {}

  addMsg("Não sei ainda 😅", "bot");
}