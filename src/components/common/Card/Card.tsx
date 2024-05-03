import { ForwardedRef, forwardRef } from 'react';
import { uniqueId } from 'lodash';
import clsx from 'clsx';

import styles from './Card.module.scss';

export interface ICardProps {
  title?: React.ReactNode | string | null;
  className?: string;
  children: React.ReactNode;
  cardID?: string;
};

export const Card = forwardRef(({ cardID = uniqueId(), title = '', className = '', children }: ICardProps, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div id={cardID} className={clsx(styles.root, className)} ref={ref}>
      {title && <h1>{title}</h1>}
      {children}
    </div>
  );
})