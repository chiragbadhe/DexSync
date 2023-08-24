import type { FC } from 'react'

interface InputLabelProps {
  label: string
  fontClass?: string
}

/**
 *
 * @param label Label for the Input
 * @param fontSize Tailwind's font size
 */
const InputLabel: FC<InputLabelProps> = ({ label, fontClass }) => (
  <>
    <div className={'mb-[8px] font-general-sans font-medium 	' + ' ' + fontClass}>{label}</div>
  </>
)

export default InputLabel
