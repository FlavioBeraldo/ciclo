'use client'

import { businesses, decisions, revenues, roles, type Answers } from '@/lib/playbook-profile'

export default function PlaybookProfileFields({ value, onChange, className }: {
  value: Answers; onChange: (next: Answers) => void; className: string
}) {
  function field(key: keyof Answers, label: string, options: Record<string, string>) {
    return <label className="flex flex-col gap-1 text-sm text-[#1A1917]">
      {label}
      <select className={className} value={value[key] || ''} onChange={event => {
        const next = { ...value, [key]: event.target.value }
        if (key === 'cargo') { delete next.faturamento; delete next.decisao }
        onChange(next)
      }}>
        <option value="">Prefiro não informar</option>
        {Object.entries(options).map(([id, text]) => <option key={id} value={id}>{text}</option>)}
      </select>
    </label>
  }
  return <fieldset className="flex flex-col gap-3">
    <legend className="mb-2 text-sm font-semibold">Sobre sua atuação <span className="font-normal">(opcional)</span></legend>
    {field('negocio', 'Qual é o tipo de negócio da sua empresa?', businesses)}
    {field('cargo', 'Qual é o seu cargo?', roles)}
    {value.cargo === 'dono' && field('faturamento', 'Qual é o faturamento anual da empresa, somando todos os canais?', revenues)}
    {(value.cargo === 'diretor' || value.cargo === 'gestor') && field('decisao',
      'Qual é seu papel na contratação de parceiros de marketing ou e-commerce para o canal digital?', decisions)}
  </fieldset>
}
