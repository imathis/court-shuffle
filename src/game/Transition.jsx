import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

import './transition.css'

const Transition = ({ type, children, ...props }) => {
  const nodeRef = React.useRef()
  return (
    <CSSTransition timeout={500} {...props} nodeRef={nodeRef}>
      {(className) => (
        React.Children.map(children, (child) => {
          const newClass = `${child.props.className || ''} css-transition ${className}`
          return React.cloneElement(
            child,
            {
              ...child.props,
              className: newClass,
              'data-transition': type,
              ref: nodeRef,
            },
          )
        })
      )}
    </CSSTransition>
  )
}

Transition.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node,
}

Transition.defaultProps = {
  type: null,
  children: undefined,
}

export {
  Transition,
}
