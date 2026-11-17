import Image from "next/image";
import Contato, { type TextosDoContato } from "@/components/ciclo/Contato";
import { Seta } from "@/components/ciclo/Seta";
import PainelDoFormulario from "@/components/ciclo/case/PainelDoFormulario";
import CtaFixoCase from "@/components/ciclo/case/CtaFixoCase";
import ConteudoDoCase from "@/components/ciclo/case/ConteudoDoCase";
import { getEstudoDeCase, type EstudoDeCase } from "@/data/estudos-de-caso";
import CasesDaLp, { type CaseDaLp } from "./CasesDaLp";

// Landing de mídia paga: /maquina-de-receita-no-ecommerce.
//
// Uma página contínua, sem a navegação do site: cabeçalho mínimo (logo sem
// link, nome da página e CTA interno), rodapé mínimo (dados da empresa e
// Política de Privacidade) e toda chamada comercial apontando para #contato.
//
// Depois da abertura, a leitura corre à esquerda e o formulário fica ao lado —
// o mesmo `Contato` das páginas de serviço e de case, com os mesmos campos,
// validação, eventos (`generate_lead`), envio a /api/pipedrive e destino
// /obrigado. Só a variante de apresentação e os textos mudam. Uma instância.
//
// Os cases abrem num diálogo com o conteúdo completo de /cases/<slug>, sem
// sair da landing. Nenhum número aqui é novo: os três indicadores são os já
// publicados em `@/data/estudos-de-caso`.

const CTA = "Quero destravar minha receita";

const TEXTOS_DO_FORMULARIO: TextosDoContato = {
  sobretitulo: "Para quem tem marca própria",
  titulo: "Vamos destravar sua próxima fase.",
  botao: CTA,
  placeholderMensagem: "",
};

const CICLOS = [
  {
    nome: "Criar demanda",
    papel: "Ser reconhecida antes da compra",
    texto: "Fazer mais pessoas conhecerem a marca antes do momento de comprar.",
    exemplos: [
      "Conteúdo Social First",
      "Creators e UGC",
      "Conteúdo de produto",
    ],
  },
  {
    nome: "Captar demanda",
    papel: "Converter interesse",
    texto: "Transformar o interesse que já existe em pedido, no canal certo.",
    exemplos: ["Criativos", "Mídia", "Oferta", "Jornada de compra"],
  },
  {
    nome: "Expandir demanda",
    papel: "Fazer voltar",
    texto: "Fazer quem comprou voltar, comprar de novo e indicar.",
    exemplos: ["Segmentação", "Automações", "Reativação", "Fidelização"],
  },
];

const DORES = [
  {
    frase: "Se eu reduzo a verba, as vendas caem.",
    texto:
      "A mídia paga sustenta quase toda a aquisição. Falta construir procura pela marca para o próximo cliente não depender sempre de mais investimento.",
    dor: "Dependência de tráfego pago",
  },
  {
    frase: "Quase tudo o que vendo depende do marketplace.",
    texto:
      "O marketplace concentra o faturamento. Sua marca fica exposta às regras, às comissões e à disputa por preço, enquanto desenvolve pouco o relacionamento direto.",
    dor: "Concentração em marketplaces",
  },
  {
    frase: "O cliente compra uma vez e desaparece.",
    texto:
      "A primeira compra não vira uma jornada de recompra. A base esfria e a operação volta a depender de novos compradores para sustentar o mês.",
    dor: "Baixa recorrência",
  },
  {
    frase: "Meu produto é bom, mas pouca gente procura a marca.",
    texto:
      "Sem uma estratégia para ser descoberta e reconhecida antes da compra, sua empresa disputa só quem já está pronto para comprar e deixa de formar a demanda de amanhã.",
    dor: "Falta de demanda pela marca",
  },
];

const AMPULHETA = [
  { nome: "Descoberta", lado: "antes", largura: 100 },
  { nome: "Consideração", lado: "antes", largura: 74 },
  { nome: "Primeira compra", lado: "centro", largura: 44 },
  { nome: "Recompra", lado: "depois", largura: 74 },
  { nome: "Indicação", lado: "depois", largura: 88 },
  { nome: "Expansão", lado: "depois", largura: 100 },
] as const;

const CANAIS = ["Loja própria", "Marketplaces", "Social commerce", "WhatsApp"];

const CRM = [
  {
    momento: "Primeira compra",
    acao: "Boas-vindas, uso do produto e pós-compra",
    objetivo: "Chegar à segunda compra",
  },
  {
    momento: "Cliente inativo",
    acao: "Reativação por perfil e interesse",
    objetivo: "Retomar a relação",
  },
  {
    momento: "Cliente recorrente",
    acao: "Reposição, fidelização e indicação",
    objetivo: "Aumentar frequência e LTV",
  },
];

const PASSOS = [
  {
    titulo: "Localizar a trava",
    texto:
      "Entender onde a receita está parando: na demanda, na conversão ou na recompra.",
  },
  {
    titulo: "Definir prioridades",
    texto:
      "Escolher o que atacar primeiro pelo impacto em CAC, margem, receita e LTV.",
  },
  {
    titulo: "Executar e aprender",
    texto: "Colocar o plano na operação, medir e ajustar a cada ciclo.",
  },
];

const FAQ = [
  {
    q: "A mídia paga deixa de ser importante?",
    a: "Não. A mídia continua importante para captar demanda. O ponto é não depender só dela: quando a marca é reconhecida antes da compra e a base volta a comprar, cada real investido em mídia trabalha junto com as outras frentes.",
  },
  {
    q: "E o marketplace, entra no plano?",
    a: "Entra. O marketplace é um dos lugares onde o cliente compra, ao lado da loja própria, do social commerce e do WhatsApp. O objetivo é a marca chegar a todos eles já reconhecida, sem depender de um único canal.",
  },
  {
    q: "Já temos equipe interna. Faz sentido?",
    a: "Faz. A Ciclo complementa a equipe interna, conectando estratégia e execução nas frentes em que a operação precisa de reforço.",
  },
  {
    q: "O que acontece depois que eu enviar o formulário?",
    a: "A Ciclo entra em contato para entender o momento da sua marca e o escopo do que faz sentido trabalhar.",
  },
];

/** Case + indicador já publicado que o cartão mostra. */
const CASES: { slug: string; indicador: string }[] = [
  { slug: "mamo", indicador: "+200%" },
  { slug: "gopro", indicador: "+120%" },
  { slug: "gringa", indicador: "+35%" },
];

function Secao({
  id,
  eyebrow,
  titulo,
  destaque,
  children,
  className = "",
}: {
  id: string;
  eyebrow: string;
  titulo: string;
  destaque?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`lp-secao ${className}`}
      aria-labelledby={`${id}-titulo`}
      id={id}
    >
      <div className="eyebrow">
        <span />
        {eyebrow}
      </div>
      <h2 id={`${id}-titulo`}>
        {titulo}
        {destaque && (
          <>
            {" "}
            <em>{destaque}</em>
          </>
        )}
      </h2>
      {children}
    </section>
  );
}

function Ciclos() {
  return (
    <div
      className="lp-orbitas"
      role="img"
      aria-label="Três ciclos conectados, da marca à receita: criar demanda, captar demanda e expandir demanda."
    >
      <span className="lp-orbitas-ponta" aria-hidden="true">
        Marca
      </span>
      {CICLOS.map((c, i) => (
        <div className="lp-orbita-grupo" key={c.nome} aria-hidden="true">
          <div className={`lp-orbita lp-orbita-${i + 1}`}>
            <i className="lp-orbita-ponto" />
            <span className="lp-orbita-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <strong>{c.nome}</strong>
            <span>{c.papel}</span>
          </div>
          {i < CICLOS.length - 1 && <span className="lp-orbita-seta">→</span>}
        </div>
      ))}
      <span className="lp-orbitas-ponta" aria-hidden="true">
        Receita
      </span>
    </div>
  );
}

function cardDoCase(slug: string, valor: string): CaseDaLp {
  const caso = getEstudoDeCase(slug) as EstudoDeCase;
  const indicador = caso.indicadores.find((i) => i.valor === valor);
  if (!indicador)
    throw new Error(`LP: o case ${slug} não tem mais o indicador ${valor}`);
  return {
    slug,
    marca: caso.marca,
    frente: caso.frente,
    foto: caso.hero.foto,
    indicador,
    conteudo: <ConteudoDoCase caso={caso} emDialogo prefixo={`lp-${slug}-`} />,
  };
}

export default function MaquinaDeReceita({
  classeDeEscopo,
}: {
  classeDeEscopo: string;
}) {
  const cases = CASES.map((c) => cardDoCase(c.slug, c.indicador));

  return (
    <>
      <div id="lp-raiz" className="case-page lp-page">
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>

        {/* Cabeçalho mínimo: sem menu, logo sem link, um único CTA interno. */}
        <header className="header lp-header">
          <div className="nav">
            <span className="brand">
              <Image
                src="/logo-ciclo-black.png"
                alt="Ciclo E-commerce"
                width={240}
                height={92}
                priority
              />
            </span>
            <span className="lp-header-nome">
              Máquina de receita no e-commerce
            </span>
            <a className="lp-header-cta" href="#contato">
              Fale com a Ciclo <Seta />
            </a>
          </div>
        </header>

        <main id="conteudo">
          {/* ── Abertura: largura total, sem foto e sem números ──────── */}
          <section className="lp-hero" aria-labelledby="lp-titulo">
            <div className="lp-hero-texto">
              <p className="lp-eyebrow-centro">
                Para empresas com marca própria
              </p>
              <h1 id="lp-titulo">
                Nós decodificamos <span className="lp-quebra">a máquina de vendas</span>{' '}
                <em>do seu e-commerce.</em>
              </h1>
              <p className="lp-hero-apoio">
                Sua marca precisa ser reconhecida antes da compra, converter
                essa demanda e fazer o cliente voltar. A Ciclo conecta essas
                três frentes para transformar marketing em crescimento de
                receita.
              </p>
              <a className="button" href="#contato">
                <span>{CTA}</span>
                <b aria-hidden="true">
                  <Seta />
                </b>
              </a>
            </div>
            <Ciclos />
            <p className="lp-hero-legenda">
              Três ciclos. Uma operação. Dados conectando cada decisão.
            </p>
          </section>

          <div className="case-wrap lp-wrap">
            <div className="case-layout">
              <div className="case-main">
                {/* ── 1. Dores ─────────────────────────────────────── */}
                <Secao
                  id="dores"
                  eyebrow="01 / O custo de crescer com peças desconectadas"
                  titulo="Qual destas frases descreve"
                  destaque="o momento da sua marca?"
                >
                  <p className="lp-faixa">
                    Se você se reconhece aqui, o próximo passo é conectar as
                    peças.
                  </p>
                  <ol className="lp-dores">
                    {DORES.map((d, i) => (
                      <li key={d.dor}>
                        <span className="lp-dor-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="lp-dor-frase">“{d.frase}”</p>
                          <p>{d.texto}</p>
                          <p className="lp-dor-rotulo">Dor: {d.dor}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Secao>

                {/* ── 2. Três ciclos ───────────────────────────────── */}
                <Secao
                  id="ciclos"
                  eyebrow="02 / Full Funnel"
                  titulo="Uma máquina de receita tem"
                  destaque="três ciclos conectados."
                >
                  <p className="lp-lead">
                    Crescer com eficiência não depende de um canal isolado.
                    Depende de a marca ser reconhecida antes da compra, de
                    converter o interesse que já existe e de fazer quem comprou
                    voltar, com os dados ligando uma frente à outra.
                  </p>
                  <div className="fw lp-fw">
                    <ol className="lp-tres">
                      {CICLOS.map((c, i) => (
                        <li key={c.nome}>
                          <span className="fw-num">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3>{c.nome}</h3>
                          <p className="lp-tres-papel">{c.papel}</p>
                          <p>{c.texto}</p>
                          <ul aria-label={`Exemplos: ${c.nome}`}>
                            {c.exemplos.map((e) => (
                              <li key={e}>{e}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ol>
                    <p className="lp-dados">
                      <strong>Dados</strong> atravessam os três ciclos: o que
                      acontece em uma frente orienta a decisão na outra.
                    </p>
                  </div>
                </Secao>

                {/* ── 3. Funil Ampulheta ───────────────────────────── */}
                <Secao
                  id="ampulheta"
                  eyebrow="03 / Funil Ampulheta"
                  titulo="A primeira compra é"
                  destaque="o meio da história."
                >
                  <p className="lp-lead">
                    O funil tradicional termina no pedido. Na ampulheta, a
                    primeira compra é o ponto mais estreito: acima dela, a marca
                    é descoberta e considerada; abaixo, o cliente volta, indica
                    e amplia a relação com a marca.
                  </p>
                  <div className="lp-ampulheta">
                    <ol
                      className="lp-amp-faixas"
                      aria-label="Etapas do Funil Ampulheta, de cima para baixo"
                    >
                      {AMPULHETA.map((e) => (
                        <li key={e.nome} className={`lp-amp-${e.lado}`}>
                          <span style={{ width: `${e.largura}%` }}>
                            {e.nome}
                          </span>
                        </li>
                      ))}
                    </ol>
                    <div className="lp-amp-canais">
                      <p>
                        A primeira compra acontece nos ambientes transacionais
                      </p>
                      <ul>
                        {CANAIS.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="lp-amp-decisoes">
                      <div>
                        <h3>Antes da compra</h3>
                        <p>
                          A decisão é o que faz a marca ser descoberta e
                          lembrada quando a necessidade aparece, para a
                          conversão não depender só de quem já está pronto para
                          comprar.
                        </p>
                      </div>
                      <div>
                        <h3>Depois da compra</h3>
                        <p>
                          A decisão é o que faz a segunda compra vir antes e a
                          base virar recorrência e indicação, em vez de um
                          arquivo de clientes antigos.
                        </p>
                      </div>
                    </div>
                  </div>
                </Secao>

                {/* ── 4. Criação e distribuição ────────────────────── */}
                <Secao
                  id="canais"
                  eyebrow="04 / Reconhecimento e distribuição"
                  titulo="Sua marca precisa ser reconhecida antes da compra."
                  destaque="E estar onde o cliente compra."
                >
                  <div className="fw lp-fw lp-canais">
                    <ul className="lp-canais-entradas">
                      <li>
                        <strong>Conteúdo Social First</strong>
                        <span>
                          Conteúdo pensado para as redes, onde a descoberta
                          acontece.
                        </span>
                      </li>
                      <li>
                        <strong>Creators e UGC</strong>
                        <span>
                          Pessoas reais apresentando o produto para quem ainda
                          não conhece.
                        </span>
                      </li>
                    </ul>
                    <svg
                      className="lp-ligacao lp-ligacao-junta"
                      viewBox="0 0 300 48"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path d="M75 0 V14 Q75 24 85 24 H215 Q225 24 225 14 V0 M150 24 V48" />
                    </svg>
                    <div className="lp-canais-centro">
                      <strong>Marca reconhecida na consideração</strong>
                      <span>
                        Quando o cliente decide, a marca já é conhecida.
                      </span>
                    </div>
                    <svg
                      className="lp-ligacao lp-ligacao-abre"
                      viewBox="0 0 400 48"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path d="M200 0 V18 M50 48 V28 Q50 18 60 18 H340 Q350 18 350 28 V48 M150 18 V48 M250 18 V48" />
                    </svg>
                    <ul
                      className="lp-canais-saidas"
                      aria-label="Onde o cliente compra"
                    >
                      {CANAIS.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                    <p className="lp-dados">
                      <strong>Criatividade, mídia e experiência</strong>{" "}
                      conectam cada etapa: do conteúdo que faz a marca ser
                      reconhecida à compra no canal que o cliente escolheu.
                    </p>
                  </div>
                  <p className="lp-nota">
                    Marketplace não é o inimigo: é um dos lugares onde o cliente
                    compra. O que muda é a marca chegar lá já reconhecida.
                  </p>
                </Secao>

                {/* ── 5. CRM ───────────────────────────────────────── */}
                <Secao
                  id="crm"
                  eyebrow="05 / CRM e relacionamento"
                  titulo="A sua base não pode ser"
                  destaque="um arquivo de clientes antigos."
                >
                  <p className="lp-lead">
                    A base de clientes é onde a receita se repete. Cada momento
                    do cliente pede uma ação diferente, com um objetivo claro.
                  </p>
                  <div className="fw lp-fw">
                    <div
                      className="lp-crm"
                      role="table"
                      aria-label="Momento do cliente, ação e objetivo"
                    >
                      <div className="lp-crm-cab" role="row">
                        <span role="columnheader">Momento</span>
                        <span role="columnheader">Ação</span>
                        <span role="columnheader">Objetivo</span>
                      </div>
                      {CRM.map((l) => (
                        <div
                          className="lp-crm-linha"
                          role="row"
                          key={l.momento}
                        >
                          <span role="cell" data-rotulo="Momento">
                            {l.momento}
                          </span>
                          <span role="cell" data-rotulo="Ação">
                            {l.acao}
                          </span>
                          <span role="cell" data-rotulo="Objetivo">
                            {l.objetivo}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Secao>

                {/* ── 6. Operação ──────────────────────────────────── */}
                <Secao
                  id="operacao"
                  eyebrow="06 / Da estratégia à operação"
                  titulo="O plano precisa"
                  destaque="chegar até a operação."
                >
                  <figure className="lp-foto lp-foto-larga">
                    <Image
                      src="/lp/maquina-de-receita/conversa-a-mesa.webp"
                      alt="Duas pessoas conversando em pé, à mesa, sobre um documento"
                      width={1200}
                      height={800}
                      sizes="(max-width: 1023px) 100vw, 780px"
                    />
                  </figure>
                  <ol className="case-etapas em-sequencia">
                    {PASSOS.map((p, i) => (
                      <li key={p.titulo}>
                        <span className="fw-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3>{p.titulo}</h3>
                        <p>{p.texto}</p>
                      </li>
                    ))}
                  </ol>
                  <ul
                    className="lp-indicadores"
                    aria-label="Indicadores que guiam as decisões"
                  >
                    {["CAC", "Margem", "Receita", "LTV"].map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </Secao>

                {/* ── 7. Pessoas ───────────────────────────────────── */}
                <Secao
                  id="pessoas"
                  eyebrow="07 / Pessoas"
                  titulo="Gente que aproxima"
                  destaque="marca, marketing e negócio."
                >
                  <p className="lp-lead">
                    A Ciclo trabalha com empresas com marca própria e operação
                    ativa, que querem crescer conectando marketing e resultado
                    de negócio.
                  </p>
                  <div className="lp-fotos-duplas">
                    <figure className="lp-foto lp-foto-retrato">
                      <Image
                        src="/lp/maquina-de-receita/palestra.png"
                        alt="Integrante da Ciclo falando ao microfone em um evento, com a marca da Ciclo no telão"
                        width={598}
                        height={897}
                        sizes="(max-width: 760px) 100vw, 320px"
                      />
                    </figure>
                    <figure className="lp-foto lp-foto-paisagem">
                      <Image
                        src="/lp/maquina-de-receita/networking.webp"
                        alt="Pessoas conversando em pé durante um encontro"
                        width={1200}
                        height={800}
                        sizes="(max-width: 760px) 100vw, 460px"
                      />
                    </figure>
                  </div>
                </Secao>

                {/* ── 8. Perguntas ─────────────────────────────────── */}
                <Secao
                  id="perguntas"
                  eyebrow="08 / Perguntas frequentes"
                  titulo="Antes de conversar."
                >
                  <div className="lp-faq">
                    {FAQ.map((f) => (
                      <details key={f.q}>
                        <summary>{f.q}</summary>
                        <p>{f.a}</p>
                      </details>
                    ))}
                  </div>
                </Secao>

                {/* ── 9. Cases e fechamento ────────────────────────── */}
                <Secao
                  id="cases"
                  eyebrow="09 / Cases"
                  titulo="Três frentes,"
                  destaque="três cases."
                >
                  <CasesDaLp
                    cases={cases}
                    classeDeEscopo={classeDeEscopo}
                    textoCta={CTA}
                  />
                  <p className="lp-nota">
                    Indicadores publicados nos cases, cada um com a sua própria
                    base de comparação (YoY).
                  </p>
                </Secao>

                <section
                  className="case-fechamento lp-fechamento"
                  aria-labelledby="lp-fechamento-titulo"
                >
                  <h2 id="lp-fechamento-titulo">
                    Sua marca pode escrever <em>o próximo capítulo.</em>
                  </h2>
                  <a className="button" href="#contato">
                    <span>{CTA}</span>
                    <b aria-hidden="true">
                      <Seta />
                    </b>
                  </a>
                </section>
              </div>

              <PainelDoFormulario>
                <Contato variante="lateral" textos={TEXTOS_DO_FORMULARIO} />
              </PainelDoFormulario>
            </div>
          </div>
        </main>

        <footer className="lp-footer">
          <div>
            <span>
              © {new Date().getFullYear()} Ciclo E-commerce. Todos os direitos
              reservados.
            </span>
            <span>
              CNPJ: 23.757.895/0001-09 · Ciclo - Assessoria de Marketing e
              Inteligencia Digital Para E-Commerce LTDA
            </span>
          </div>
          <a
            href="/politica-de-privacidade"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidade
          </a>
        </footer>

        <CtaFixoCase texto={CTA} />
      </div>
    </>
  );
}
