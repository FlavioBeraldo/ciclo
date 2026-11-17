import Link from 'next/link'
import CicloHeader from '@/components/ciclo/CicloHeader'
import CicloFooter from '@/components/ciclo/CicloFooter'
import Contato, { type TextosDoContato } from '@/components/ciclo/Contato'
import Breadcrumb from '@/components/ciclo/interior/Breadcrumb'
import { Seta } from '@/components/ciclo/Seta'
import { estudosDeCaso, type EstudoDeCase } from '@/data/estudos-de-caso'
import CtaFixoCase from './CtaFixoCase'
import PainelDoFormulario from './PainelDoFormulario'
import ConteudoDoCase from './ConteudoDoCase'

// Template das páginas de case (/cases/<slug>).
//
// Duas colunas no desktop: a leitura à esquerda e, à direita, o formulário de
// contato fixo enquanto o visitante lê. Abaixo de 1024px vira uma coluna só,
// com o formulário no fim e um CTA fixo no rodapé que leva até ele.
//
// O formulário é o `Contato` das páginas de serviço, o mesmo componente, com
// os mesmos campos, regras, eventos e destino — só a variante de apresentação
// e os textos mudam. Há uma única instância dele por página.
//
// Seções opcionais (vídeo, materiais, depoimentos, comparação) só existem
// quando o case tem o material. Sem dado, sem seção.

const TEXTOS_DO_FORMULARIO: TextosDoContato = {
  sobretitulo: 'Vamos escrever o próximo capítulo',
  titulo: 'Sua empresa pode ser o próximo case.',
  botao: 'Quero construir meu case de sucesso',
  // Pedido do Flávio: descrição sem texto de exemplo e painel sem subtítulo.
  placeholderMensagem: '',
}

export default function PaginaDeCase({ caso }: { caso: EstudoDeCase }) {
  const outros = estudosDeCaso.filter((c) => c.slug !== caso.slug)

  return (
    <div className="case-page">
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>

      <CicloHeader contatoNaPagina />

      <main id="conteudo">
        <div className="case-wrap">
          <Breadcrumb
            etapas={[
              { rotulo: 'Início', href: '/' },
              { rotulo: 'Cases', href: '/#cases' },
              { rotulo: caso.marca },
            ]}
          />

          <div className="case-layout">
            <article className="case-main" aria-labelledby="case-titulo">
              <ConteudoDoCase caso={caso} />

              {/* ── Convite ─────────────────────────────────────────── */}
              <section className="case-fechamento" aria-labelledby="fechamento-titulo">
                <h2 id="fechamento-titulo">
                  A próxima história de sucesso pode ser <em>a da sua empresa.</em>
                </h2>
                <a className="button case-fechamento-cta" href="#contato">
                  <span>Conte seu desafio</span>
                  <b aria-hidden="true">
                    <Seta />
                  </b>
                </a>
              </section>

              {outros.length > 0 && (
                <nav className="case-outros" aria-label="Outros cases">
                  <div className="eyebrow">
                    <span />
                    Outros cases
                  </div>
                  <ul>
                    {outros.map((o) => (
                      <li key={o.slug}>
                        <Link href={`/cases/${o.slug}`}>
                          <span>{o.marca}</span>
                          <small>{o.frente}</small>
                          <Seta />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </article>

            <PainelDoFormulario>
              <Contato variante="lateral" textos={TEXTOS_DO_FORMULARIO} />
            </PainelDoFormulario>
          </div>
        </div>
      </main>

      <CicloFooter />

      <CtaFixoCase texto="Quero crescer com a Ciclo" />
    </div>
  )
}
