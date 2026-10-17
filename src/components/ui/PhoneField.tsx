'use client'

import dynamic from 'next/dynamic'
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form'

// Load react-phone-number-input (~40 KB) only when the component mounts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PhoneInput = dynamic(() => import('react-phone-number-input'), { ssr: false }) as any

interface Props<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  required?: boolean
  error?: string
  placeholder?: string
  /**
   * Aparência. 'padrao' é a de sempre e continua sendo o default, para que as
   * telas já no ar — inclusive o playbook — não mudem um pixel. 'ciclo2026'
   * veste o campo com as classes do design novo, cujo CSS vive no escopo
   * `.ciclo2026`.
   */
  variant?: 'padrao' | 'ciclo2026'
}

export default function PhoneField<T extends FieldValues>({
  name,
  control,
  label,
  required,
  error,
  placeholder = '+55 (11) 99999-9999',
  variant = 'padrao',
}: Props<T>) {
  const novo = variant === 'ciclo2026'

  return (
    <div className={novo ? 'field' : undefined}>
      {label && (
        <label className={novo ? undefined : 'block text-sm text-[#A1A1AA] mb-1.5'}>
          {label}
          {required && ' *'}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <PhoneInput
            international
            defaultCountry="BR"
            value={field.value ?? ''}
            onChange={field.onChange}
            placeholder={placeholder}
            className={novo ? 'ciclo2026-phone-input' : 'ciclo-phone-input'}
          />
        )}
      />
      {error && (
        <p className={novo ? 'field-error' : 'text-red-400 text-xs mt-1'}>{error}</p>
      )}
    </div>
  )
}
