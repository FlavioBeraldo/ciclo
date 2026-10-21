// Ícones e mini-ilustrações das quatro frentes do TikTok Shop.
//
// Tudo é SVG inline, traço de 1,25px, sem preenchimento e sem arquivo
// externo: desenha na mesma espessura da tipografia e acompanha a cor do
// texto por `currentColor`. O acento roxo entra em um elemento só de cada
// desenho, pela classe `.tts-acento` — é o mesmo roxo do site, aplicado no
// CSS, e não uma cor nova escrita aqui.
//
// Os desenhos são decorativos: o nome da frente e os entregáveis estão no
// HTML ao lado, então os dois recebem `aria-hidden` e nenhum texto
// alternativo. Quem usa leitor de tela não perde nada.
//
// Não há nada gerado por IA nem imagem rasterizada: são formas geométricas,
// e por isso continuam nítidas em qualquer tela e pesam alguns bytes.

type Frente = 'afiliacao-creators' | 'operacao-da-loja' | 'conteudo-e-lives' | 'midia'

const comum = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Ícone de 24px do cabeçalho de cada frente. */
export function IconeFrente({ frente }: { frente: Frente }) {
  return (
    <svg className="tts-icone" viewBox="0 0 24 24" aria-hidden="true" {...comum}>
      {frente === 'afiliacao-creators' && (
        <>
          {/* três creators ligados a um ponto central */}
          <circle cx="12" cy="12" r="2.6" className="tts-acento" />
          <circle cx="4.5" cy="6" r="2.2" />
          <circle cx="19.5" cy="6" r="2.2" />
          <circle cx="12" cy="20.5" r="2.2" />
          <path d="M6.3 7.4 9.8 10.4M17.7 7.4 14.2 10.4M12 14.6v3.3" />
        </>
      )}

      {frente === 'operacao-da-loja' && (
        <>
          {/* vitrine com toldo e um item conferido */}
          <path d="M3.2 8.4h17.6v11.4a1 1 0 0 1-1 1H4.2a1 1 0 0 1-1-1z" />
          <path d="M3.2 8.4 5 3.6h14l1.8 4.8" />
          <path d="M9 8.4v-4.8M15 8.4v-4.8" />
          <path d="m9.1 14.6 2 2 3.8-3.9" className="tts-acento" />
        </>
      )}

      {frente === 'conteudo-e-lives' && (
        <>
          {/* play no ar, com as ondas da transmissão */}
          <rect x="3.2" y="5.6" width="13" height="12.8" rx="2" />
          <path d="m8.6 9.9 4.2 2.5-4.2 2.5z" className="tts-acento" />
          <path d="M19 8.6a6 6 0 0 1 0 6.8M21.6 6.4a9.4 9.4 0 0 1 0 11.2" />
        </>
      )}

      {frente === 'midia' && (
        <>
          {/* investimento subindo e o alvo */}
          <path d="M3.4 19.4h17.2" />
          <path d="M6.2 19.4v-4.1M10.5 19.4v-7M14.8 19.4v-4.8" />
          <path d="M3.9 11.2 8.6 6.6l3.4 3 5.2-5.6" />
          <circle cx="19.1" cy="4" r="1.9" className="tts-acento" />
        </>
      )}
    </svg>
  )
}

/**
 * Mini-ilustração de 132x56 no rodapé do cabeçalho de cada frente.
 *
 * Não é enfeite: cada uma mostra o mecanismo da frente — o caminho que o
 * trabalho percorre até virar venda. É a mesma leitura do diagrama do topo,
 * em escala de cartão.
 */
export function MiniIlustracao({ frente }: { frente: Frente }) {
  return (
    <svg className="tts-mini" viewBox="0 0 132 56" aria-hidden="true" {...comum}>
      {frente === 'afiliacao-creators' && (
        <>
          {/* creators → curadoria → loja */}
          <circle cx="12" cy="14" r="5" />
          <circle cx="12" cy="28" r="5" />
          <circle cx="12" cy="42" r="5" />
          <path d="M17 14.6 47 26M17 28h30M17 41.4 47 30" />
          <rect x="47" y="20" width="22" height="16" rx="3" className="tts-acento" />
          <path d="M69 28h23" />
          <path d="M92 20h28v16H92z" />
          <path d="M92 25.4h28" />
        </>
      )}

      {frente === 'operacao-da-loja' && (
        <>
          {/* catálogo e ERP entrando na vitrine, ordenados */}
          <path d="M6 14h30M6 22h30M6 30h30M6 38h30" />
          <path d="M40 26h16" />
          <rect x="56" y="12" width="26" height="32" rx="3" />
          <path d="M56 20h26" />
          <path d="M86 28h12" className="tts-acento" />
          <rect x="98" y="16" width="26" height="24" rx="3" />
          <path d="m104 28.6 3.6 3.6 7-7.6" className="tts-acento" />
        </>
      )}

      {frente === 'conteudo-e-lives' && (
        <>
          {/* ao vivo e vídeo publicado alimentando a mesma audiência */}
          <rect x="6" y="10" width="34" height="22" rx="3" />
          <path d="m18.6 17.4 7 3.6-7 3.6z" className="tts-acento" />
          <circle cx="11.5" cy="38.5" r="2.2" className="tts-acento" />
          <path d="M16 38.5h22" />
          <path d="M44 21h12" />
          <path d="M60 10v36" />
          <path d="M66 16c10 0 10 10 20 10s10-10 20-10" />
          <path d="M66 40c10 0 10-8 20-8s10 8 20 8" />
          <circle cx="120" cy="28" r="5" />
        </>
      )}

      {frente === 'midia' && (
        <>
          {/* verba, leilão e a curva de GMV */}
          <path d="M6 46V10" />
          <path d="M6 46h120" />
          <path d="M14 40h8v6h-8zM28 32h8v14h-8zM42 36h8v10h-8z" />
          <path d="M58 44c14 0 20-6 28-16s14-16 28-16" className="tts-acento" />
          <circle cx="114" cy="12" r="3.4" className="tts-acento" />
          <path d="M100 46h26" />
        </>
      )}
    </svg>
  )
}
