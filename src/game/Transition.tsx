import React, { ReactNode } from "react";
import { CSSTransition } from "react-transition-group";

import "./transition.css";

type TransitionProps = {
  type?: string | null;
  children: ReactNode;
};

const Transition: React.FC<TransitionProps> = ({
  type,
  children,
  ...props
}) => {
  const nodeRef = React.useRef<HTMLElement>(null);
  return (
    <CSSTransition timeout={500} {...props} nodeRef={nodeRef}>
      {(className: string) =>
        React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) {
            return child;
          }
          const newClass = `${child.props.className || ""} css-transition ${className}`;
          return React.cloneElement(child, {
            ...child.props,
            className: newClass,
            "data-transition": type,
            ref: nodeRef,
          });
        })
      }
    </CSSTransition>
  );
};

export { Transition };
