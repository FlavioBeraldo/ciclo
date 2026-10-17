// Perguntas frequentes das internas, conforme o kit: `<details>` nativo.
//
// O conteúdo é o mesmo `faq` de @/lib/servicos e @/lib/solucoes que alimenta o
// JSON-LD de FAQPage da página — nenhuma pergunta entra ou sai aqui. O
// elemento nativo já traz teclado, leitura por leitor de tela e estado aberto
// sem JavaScript, então esta seção deixou de precisar de componente de cliente.

export default function Faq({
  perguntas,
  titulo = 'O que você precisa saber.',
}: {
  perguntas: { q: string; a: string }[]
  titulo?: string
}) {
  return (
    <section className="inner-section paper" id="faq">
      <div className="wrap narrow">
        <div className="inner-section-heading">
          <div className="eyebrow">
            <span />
            Dúvidas frequentes
          </div>

          <h2>{titulo}</h2>
        </div>

        <div className="faq-list">
          {perguntas.map(({ q, a }) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <div className="faq-answer">
                <p>{a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
