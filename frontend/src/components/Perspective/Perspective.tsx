// Libs
import { Children, cloneElement, ReactElement, ReactNode } from 'react';

type PerspectiveProps = {
  children: ReactNode;
  className?: string;
  transform: string;
  value: string;
};

export function Perspective({
  children,
  className,
  transform,
  value,
}: PerspectiveProps) {
  // apply the transformation to create the perspective effect on the first child
  const childrenWithPerspective = Children.map(
    children as ReactElement[],
    (child: ReactElement, index: number) => {
      if (index === 0) {
        return cloneElement(child, { style: { transform } });
      }

      return child;
    },
  );

  return (
    <div
      className={className}
      style={{
        perspective: value,
      }}
    >
      {childrenWithPerspective}
    </div>
  );
}
