"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import ValorDeCase from "@/components/ciclo/ValorDeCase";
import { Seta } from "@/components/ciclo/Seta";

// Cases da landing, sem tirar o visitante da página.
//
// Cada cartão abre um diálogo com o conteúdo COMPLETO do case publicado em
// /cases/<slug> — o mesmo `ConteudoDoCase`, renderizado no servidor e passado
// pronto para cá. Só o case aberto fica montado, então os ids nunca se repetem.
//
// O diálogo vai para o <body> por portal e o resto da landing fica `inert`
// enquanto ele está aberto: nada atrás recebe foco ou clique. Escape e o botão
// Fechar fecham; o foco volta ao cartão de origem; a rolagem da página não se
// perde. O CTA de dentro fecha o diálogo e leva ao formulário da landing.
//
// Abrir um case não dispara evento nenhum: não é conversão.

export interface CaseDaLp {
  slug: string;
  marca: string;
  frente: string;
  foto: {
    src: string;
    alt: string;
    largura: number;
    altura: number;
    posicao?: string;
  };
  indicador: { valor: string; rotulo: string };
  conteudo: ReactNode;
}

const FOCAVEIS =
  'a[href], button:not([disabled]), iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function CasesDaLp({
  cases,
  classeDeEscopo,
  textoCta,
}: {
  cases: CaseDaLp[];
  /** Classes do escopo visual (.ciclo2026 + fonte), já que o portal sai dele */
  classeDeEscopo: string;
  textoCta: string;
}) {
  const [aberto, setAberto] = useState<CaseDaLp | null>(null);
  const dialogo = useRef<HTMLDivElement>(null);
  const origem = useRef<HTMLButtonElement | null>(null);
  const irParaContato = useRef(false);

  const fechar = useCallback(() => setAberto(null), []);

  useEffect(() => {
    if (!aberto) return;
    const raiz = document.getElementById("lp-raiz");
    const overflow = document.body.style.overflow;
    raiz?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    document.body.classList.add("lp-dialogo-aberto");
    dialogo.current?.querySelector<HTMLElement>(".lp-dialogo-fechar")?.focus();

    const aoTeclar = (e: KeyboardEvent) => {
      // O print ampliado da imprensa tem o próprio Escape: ele fecha primeiro.
      if (document.querySelector(".case-print-modal")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        fechar();
        return;
      }
      if (e.key !== "Tab") return;
      const alvos = Array.from(
        dialogo.current?.querySelectorAll<HTMLElement>(FOCAVEIS) ?? [],
      );
      if (!alvos.length) return;
      const inicio = alvos[0];
      const fim = alvos[alvos.length - 1];
      if (e.shiftKey && document.activeElement === inicio) {
        e.preventDefault();
        fim.focus();
      } else if (!e.shiftKey && document.activeElement === fim) {
        e.preventDefault();
        inicio.focus();
      }
    };
    document.addEventListener("keydown", aoTeclar);

    const quemAbriu = origem.current;
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      raiz?.removeAttribute("inert");
      document.body.style.overflow = overflow;
      document.body.classList.remove("lp-dialogo-aberto");

      if (irParaContato.current) {
        irParaContato.current = false;
        requestAnimationFrame(() => {
          const contato = document.getElementById("contato");
          if (!contato) return;
          contato.scrollIntoView({ behavior: "smooth", block: "start" });
          const titulo = document.getElementById("contato-titulo");
          if (titulo) {
            titulo.setAttribute("tabindex", "-1");
            titulo.focus({ preventScroll: true });
          }
        });
      } else {
        quemAbriu?.focus();
      }
    };
  }, [aberto, fechar]);

  return (
    <>
      <ul className="lp-cases">
        {cases.map((c) => (
          <li key={c.slug} className="lp-case">
            <div className="lp-case-foto">
              <Image
                src={c.foto.src}
                alt={c.foto.alt}
                width={c.foto.largura}
                height={c.foto.altura}
                sizes="(max-width: 760px) 100vw, 260px"
                style={
                  c.foto.posicao
                    ? { objectPosition: c.foto.posicao }
                    : undefined
                }
              />
            </div>
            <div className="lp-case-texto">
              <p className="lp-case-marca">
                <strong>{c.marca}</strong>
                <span>{c.frente}</span>
              </p>
              <p className="lp-case-indicador">
                <strong>
                  <ValorDeCase valor={c.indicador.valor} />
                </strong>
                <span>{c.indicador.rotulo}</span>
              </p>
              <button
                type="button"
                className="lp-case-abrir"
                aria-haspopup="dialog"
                onClick={(e) => {
                  origem.current = e.currentTarget;
                  setAberto(c);
                }}
              >
                Explorar este case <span className="sr-only">{c.marca}</span>
                <Seta />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {aberto &&
        createPortal(
          <div className={classeDeEscopo}>
            <div className="case-page lp-dialogo-raiz">
              <div className="lp-dialogo-fundo" onClick={fechar}>
                <div
                  ref={dialogo}
                  className="lp-dialogo"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`lp-${aberto.slug}-case-titulo`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="lp-dialogo-barra">
                    <span>Case {aberto.marca}</span>
                    <button
                      type="button"
                      className="lp-dialogo-fechar"
                      onClick={fechar}
                    >
                      Fechar <span aria-hidden="true">✕</span>
                    </button>
                  </div>

                  <div className="lp-dialogo-conteudo">
                    {aberto.conteudo}

                    <div className="lp-dialogo-cta">
                      <p>Sua marca pode escrever o próximo capítulo.</p>
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          irParaContato.current = true;
                          fechar();
                        }}
                      >
                        <span>{textoCta}</span>
                        <b aria-hidden="true">
                          <Seta />
                        </b>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
