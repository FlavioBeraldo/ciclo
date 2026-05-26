'use client'

import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface Props<T extends FieldValues> {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  required?: boolean
  error?: string
  placeholder?: string
}

export default function PhoneField<T extends FieldValues>({
  name,
  control,
  label,
  required,
  error,
  placeholder = '+55 (11) 99999-9999',
}: Props<T>) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-[#A1A1AA] mb-1.5">
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
            className="ciclo-phone-input"
          />
        )}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
