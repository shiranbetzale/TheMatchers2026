import React from 'react';
import { View } from 'react-native';
import { WhiteCardType } from './WhiteCard.type';
import SharedStyles from '../../utils/SharedStyles';

const WhiteCard = (props: WhiteCardType) => {
  const { children, customStyle } = props;

  return (
    <View style={[SharedStyles.card, customStyle]}>
      {children}
    </View>
  );
};

export default WhiteCard;
