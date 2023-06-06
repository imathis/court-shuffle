import * as icons from '../assets/icons'

const Icon = ({ name, ...props }) => {
  const Svg = icons[name]

  return <Svg className="icon" {...props} />
}

export { Icon }
