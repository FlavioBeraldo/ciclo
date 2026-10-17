// Símbolos de serviços criados depois do kit de layouts.
//
// `diagramas.ts` é gerado a partir do HTML do kit e não pode ser editado à
// mão — rodar o extrator de novo apagaria qualquer acréscimo. Serviços novos
// entram aqui, e a página de serviço consulta os dois mapas.

export const simboloExtraPorServico: Record<string, string> = {
  // UGC: duas pessoas, como o ícone de creators, com o losango de brilho que
  // o kit usa para conteúdo. Mesmo traçado e mesma espessura dos demais.
  'agencia-ugc':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3"/><path d="m18 2 1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/></svg>',
}
