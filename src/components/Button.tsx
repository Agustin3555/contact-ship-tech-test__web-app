import { ReactNode } from 'react'

interface Props {
  title: string
  icon: ReactNode
  handleClick: () => void
}

const Button = ({ title, icon, handleClick }: Props) => (
  <button
    className="flex items-center justify-center size-10 bg-indigo-50 rounded-md transition duration-300 ease-out hover:translate-y-[-0.0625rem] hover:shadow-md active:translate-y-0 active:bg-indigo-100 active:shadow-none"
    title={title}
    onClick={handleClick}
  >
    {icon}
  </button>
)

export default Button
