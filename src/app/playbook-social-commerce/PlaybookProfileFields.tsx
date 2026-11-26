'use client'

import { businesses, decisions, followUpForRole, revenues, roles, type Answers } from '@/lib/playbook-profile'

export default function PlaybookProfileFields({ value, onChange, className, invalidField }: {
  value: Answers; onChange: (next: Answers) => void; className: string
  invalidField?: keyof Answers
}) {
  function field(key: keyof Answers, label: string, options: Record<string, string>) {
    return <label className="flex flex-col gap-1 text-sm text-[#1A1917]">
      {label}
      <select id={'playbook-' + key} name={key} required aria-invalid={invalidField === key}
        aria-describedby={invalidField === key ? 'playbook-profile-error' : undefined}
        className={className} value={value[key] || ''} onChange={event => {
        const next = { ...value, [key]: event.target.value }
        if (key === 'cargo') { delete next.faturamento; delete next.decisao }
        onChange(next)
      }}>
        <option value="" disabled>Selecione uma opção</option>
        {Object.entries(options).map(([id, text]) => <option key={id} value={id}>{text}</option>)}
      </select>
      {invalidField === key && <span role="alert" id="playbook-profile-error" className="text-[#C0392B] text-xs">
        Selecione uma opção para continuar.
      </span>}
    </label>
  }
  return <fieldset className="flex flex-col gap-3">
    <legend className="mb-2 text-sm font-semibold">Sobre sua atuação</legend>
    {field('negocio', 'Qual é o tipo de negócio da sua empresa?', businesses)}
    {field('cargo', 'Qual é o seu cargo?', roles)}
    {followUpForRole(value.cargo) === 'faturamento' && field('faturamento', 'Qual é o faturamento anual da empresa, somando todos os canais?', revenues)}
    {followUpForRole(value.cargo) === 'decisao' && field('decisao',
      'Qual é seu papel na contratação de parceiros de marketing ou e-commerce para o canal digital?', decisions)}
  </fieldset>
}
