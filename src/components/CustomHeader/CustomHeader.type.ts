import {ReactNode} from 'react';

type headerBtn = {
  accessibilityLabel?: string;
  comp?: ReactNode;
  onPress: () => void;
};

export type CustomHeaderType = {
  headerBtns: headerBtn[];
  title?: string;
  actionsPosition?: 'left' | 'right';
};
