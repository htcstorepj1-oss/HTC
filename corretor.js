const correcoes = {
  "ainten": "einstein",
  "brasiu": "brasil",
  "gandi": "gandhi"
};

function corrigir(texto) {
  return texto.toLowerCase().split(" ").map(p => correcoes[p] || p).join(" ");
}