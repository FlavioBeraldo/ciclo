#!/usr/bin/env python3
"""Converte o CSS do kit de layouts em CSS com escopo.

Cada seletor passa a exigir a classe .ciclo2026 na raiz da página. Assim o
design novo não alcança nada que não receba a classe — em especial o
/playbook-social-commerce, que fica fora do redesign.

Tratamentos especiais:
  :root   -> .ciclo2026           (as variáveis passam a viver no escopo)
  body    -> .ciclo2026           (fundo, cor e fonte do escopo)
  html    -> descartado quando só define scroll; o projeto já tem o seu
  *       -> .ciclo2026 *
  @font-face e @media            mantidos, com o conteúdo prefixado

Uso: python3 escopo-css.py entrada.css saida.css
"""
import re
import sys

ESCOPO = '.ciclo2026'
# Regras globais do kit que o projeto já resolve ou que não podem escapar
DESCARTAR = {'html'}


def prefixar_seletor(sel: str) -> str:
    sel = sel.strip()
    if not sel:
        return ''
    partes = []
    for s in sel.split(','):
        s = s.strip()
        if not s:
            continue
        if s in (':root', 'body'):
            partes.append(ESCOPO)
        elif s in DESCARTAR:
            continue
        elif s == '*':
            partes.append(f'{ESCOPO} *')
        elif s.startswith('*:') or s.startswith('*::'):
            partes.append(f'{ESCOPO} {s}')
        elif s.startswith(':'):
            # :focus-visible etc. -> .ciclo2026 :focus-visible
            partes.append(f'{ESCOPO} {s}')
        else:
            partes.append(f'{ESCOPO} {s}')
    return ','.join(partes)


def processar(css: str) -> str:
    saida = []
    i = 0
    n = len(css)
    while i < n:
        # comentário
        if css.startswith('/*', i):
            fim = css.find('*/', i + 2)
            fim = n if fim == -1 else fim + 2
            saida.append(css[i:fim])
            i = fim
            continue
        # at-rule
        if css[i] == '@':
            fim_sel = i
            while fim_sel < n and css[fim_sel] not in '{;':
                fim_sel += 1
            cabecalho = css[i:fim_sel].strip()
            if fim_sel < n and css[fim_sel] == ';':
                saida.append(cabecalho + ';')
                i = fim_sel + 1
                continue
            bloco, fim = ler_bloco(css, fim_sel)
            nome = cabecalho.split()[0].lower()
            if nome in ('@media', '@supports', '@layer', '@container'):
                saida.append(cabecalho + '{' + processar(bloco) + '}')
            else:
                # @font-face, @keyframes: conteúdo não é seletor
                saida.append(cabecalho + '{' + bloco + '}')
            i = fim
            continue
        # regra comum
        fim_sel = i
        while fim_sel < n and css[fim_sel] != '{':
            fim_sel += 1
        if fim_sel >= n:
            break
        seletor = prefixar_seletor(css[i:fim_sel])
        bloco, fim = ler_bloco(css, fim_sel)
        if seletor:
            saida.append(seletor + '{' + bloco + '}')
        i = fim
    return '\n'.join(p for p in saida if p.strip())


def ler_bloco(css: str, pos_chave: int):
    """Lê do '{' até o '}' correspondente. Devolve (conteúdo, índice após)."""
    profundidade = 0
    i = pos_chave
    while i < len(css):
        if css[i] == '{':
            profundidade += 1
        elif css[i] == '}':
            profundidade -= 1
            if profundidade == 0:
                return css[pos_chave + 1:i], i + 1
        i += 1
    return css[pos_chave + 1:], len(css)


if __name__ == '__main__':
    entrada, saida_arq = sys.argv[1], sys.argv[2]
    with open(entrada, encoding='utf-8') as f:
        bruto = f.read()
    resultado = processar(bruto)
    with open(saida_arq, 'w', encoding='utf-8') as f:
        f.write(resultado)
    print(f'{entrada} -> {saida_arq}')
    print(f'  {len(bruto)} bytes de entrada, {len(resultado)} de saída')
    print(f'  regras sem escopo restantes: '
          f'{len(re.findall(r"(?m)^(?!@|\\.ciclo2026|\\})\\S", resultado))}')
