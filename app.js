let banco = [];

// carregar banco
async function carregarBanco() {
  let res = await fetch("banco.json");
  banco = await res.json();
}

carregarBanco();

// segurança básica
function limparInput(texto) {
  return texto.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// DuckDuckGo
async function buscarDuck(pergunta) {
  try {
    let url = `https://api.duckduckgo.com/?q=${encodeURIComponent(pergunta)}&format=json&no_html=1`;
    let res = await fetch(url);
    let data = await res.json();
    return data.Abstract || null;
  } catch {
    return null;
  }
}

// função principal
async function perguntar() {
  let input = document.getElementById("input").value;
  let chat = document.getElementById("chat");

  input = limparInput(input);
  input = corrigir(input);

  chat.innerHTML += `<p><b>Você:</b> ${input}</p>`;

  let memoria = carregarMemoria();

  // 1. memória + banco
  let resposta =
    buscarResposta(input, memoria) ||
    buscarResposta(input, banco);

  if (resposta) {
    chat.innerHTML += `<p><b>IA:</b> ${resposta}</p>`;
    return;
  }

  // 2. Wikipedia
  try {
    let res = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(input)}`);
    let data = await res.json();

    if (data.extract) {
      chat.innerHTML += `<p><b>IA 🌐:</b> ${data.extract}</p>`;
      salvarMemoria(input, data.extract);
      return;
    }
  } catch {}

  // 3. DuckDuckGo
  let duck = await buscarDuck(input);
  if (duck) {
    chat.innerHTML += `<p><b>IA 🔎:</b> ${duck}</p>`;
    salvarMemoria(input, duck);
    return;
  }

  chat.innerHTML += `<p><b>IA:</b> Não sei ainda 😅</p>`;
}