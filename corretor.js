const correcoes = {
  "ainten": "einstein",
  "brasiu": "brasil",
  "gandi": "gandhi"
};

function corrigir(texto) {
  let palavras = texto.toLowerCase().split(" ");
  palavras = palavras.map(p => correcoes[p] || p);
  return palavras.join(" ");
}