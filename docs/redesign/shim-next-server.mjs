// Substituto de `next/server` para os testes fora do servidor do Next.
//
// As rotas usam `after()` para trabalho em segundo plano. Fora de um ciclo de
// requisição real ele lança, e a rota inteira cai no catch — o que impediria
// testar qualquer coisa depois dele. Aqui ele vira no-op.
//
// Todo o resto (`NextRequest`, `NextResponse`) vem do módulo de verdade: só a
// função `after` é trocada, e só quando SHIM_NEXT_AFTER=1.
export * from 'next/server.js'

export function after(callback) {
  // Em teste o trabalho de fundo não roda. Nada aqui chama a função: executá-la
  // dispararia efeitos (notas no CRM, jornada) que o teste não quer.
  void callback
}
