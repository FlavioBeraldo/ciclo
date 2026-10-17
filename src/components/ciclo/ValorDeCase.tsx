// O número de um resultado de case, com a unidade separada.
//
// Quase todo valor de `@/lib/cases` é curto — "+200%", "-37%". Um não é:
// "120→55 dias", da Gringa. Com três resultados no mesmo cartão, a célula
// fica com ~124px e esse valor precisa de ~162px em 29px de corpo. Como a
// regra tinha `white-space: nowrap`, ele vazava para fora do cartão.
//
// A correção não corta nem abrevia nada: a unidade sai do corpo grande e vira
// uma palavra menor ao lado, e o número em si continua inquebrável. O texto
// lido continua sendo exatamente "120→55 dias" — o conteúdo de `lib/cases`
// não muda, só a composição.

/** Separa uma palavra final de unidade, se houver: "120→55 dias" → ["120→55", "dias"] */
function separar(valor: string): [string, string | null] {
  const m = valor.match(/^(.*?)\s+(\p{L}+)$/u)
  return m ? [m[1], m[2]] : [valor, null]
}

export default function ValorDeCase({ valor }: { valor: string }) {
  const [numero, unidade] = separar(valor)

  return (
    <>
      <span className="valor-numero">{numero}</span>
      {unidade && <span className="valor-unidade"> {unidade}</span>}
    </>
  )
}
