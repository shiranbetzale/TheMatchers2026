import React from 'react';
import CloseSvg from '../../assets/images/close.svg';
import Colors from '../../utils/Colors';
import {BUTTON_ICON_SIZE} from '../CustomButton/CustomButton';

type CloseIconProps = {
  color?: string;
  size?: number;
};

const CloseIcon = ({
  color = Colors.darkGreen,
  size = BUTTON_ICON_SIZE,
}: CloseIconProps) => (
  <CloseSvg width={size} height={size} color={color} />
);

export default CloseIcon;
