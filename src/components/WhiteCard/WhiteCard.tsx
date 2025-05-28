import React from 'react';
import { View } from 'react-native';
import { styles } from './WhiteCard.style';
import { WhiteCardType } from './WhiteCard.type';

const WhiteCard = (props: WhiteCardType) => {
  const { children, customStyle } = props;

  return (
    <View style={[styles.container, { ...customStyle }]}>
      {children}
    </View>
  );
};

export default WhiteCard;
