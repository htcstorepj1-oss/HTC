function normalizar(texto) {
  return texto.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\b(quem|qual|o|a|do|da|foi|é|de)\b/g, "")
    .trim();
}

function similaridade(a, b) {
  let pa = a.split(" ");
  let pb = b.split(" ");

  let iguais = pa.filter(p => pb.includes(p));
  return iguais.length / Math.max(pa.length, pb.length);
}

function buscarResposta(pergunta, banco) {
  let melhor = null;
  let scoreMax = 0;

  let p = normalizar(pergunta);

  banco.forEach(item => {
    let s = similaridade(p, normalizar(item.pergunta));

    if (s > scoreMax) {
      scoreMax = s;
      melhor = item;
    }
  });

  if (scoreMax > 0.5) return melhor.resposta;
  return null;
}