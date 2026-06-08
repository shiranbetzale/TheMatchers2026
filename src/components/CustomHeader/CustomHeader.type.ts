import {ReactNode} from 'react';

type headerBtn = {
  comp?: ReactNode;
  onPress: () => void;
};

export type CustomHeaderType = {
  headerBtns: headerBtn[];
  title?: string;
  actionsPosition?: 'left' | 'right';
};
