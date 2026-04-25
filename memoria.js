function salvarMemoria(pergunta, resposta) {
  let memoria = JSON.parse(localStorage.getItem("memoria")) || [];
  memoria.push({ pergunta, resposta });
  localStorage.setItem("memoria", JSON.stringify(memoria));
}

function carregarMemoria() {
  return JSON.parse(localStorage.getItem("memoria")) || [];
}