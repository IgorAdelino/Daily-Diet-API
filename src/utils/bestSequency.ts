export function SequencyOnDiet(array: any[]) {
  let maxContagem = 0;
  let contagemAtual = 0;
  let dataAtual = null;

  for (let i = 0; i < array.length; i++) {
    const refeicao = array[i];
    const dataRefeicao = new Date(refeicao.created_at.split(" ")[0]);

    if (dataAtual === null || dataAtual.getTime() === dataRefeicao.getTime()) {
      if (refeicao.onDiet === "yes") {
        contagemAtual++;
      }
    } else {
      contagemAtual = refeicao.onDiet === "yes" ? 1 : 0;
    }
    if (contagemAtual > maxContagem) {
      maxContagem = contagemAtual;
    }

    dataAtual = dataRefeicao;
  }

  return maxContagem;
}