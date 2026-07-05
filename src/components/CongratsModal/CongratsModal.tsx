import React from 'react';
import {Image, View} from 'react-native';
import CustomText from '../CustomText/CustomText';
import CustomButton from '../CustomButton/CustomButton';
import CustomModal from '../CustomModal/CustomModal';
import {RelationshipAnnouncement} from '../../data/relationshipAnnouncements';
import {styles} from './CongratsModal.style';

type CongratsModalProps = {
  announcement?: RelationshipAnnouncement;
  visible: boolean;
  onClose: () => void;
};

const CongratsModal = (props: CongratsModalProps) => {
  const {announcement, visible, onClose} = props;

  if (!announcement) {
    return null;
  }

  const statusText =
    announcement.status === 'married' ? 'marriedCongrats' : 'engagedCongrats';

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      showCloseButton
      overlayStyle={styles.overlay}
      contentStyle={styles.card}
      headerStyle={styles.header}
      title="congratsTitle"
      titleStyle={styles.title}
      closeButtonStyle={styles.closeIconButton}>
      <CustomText text={statusText} customStyle={styles.subtitle} />

      <View style={styles.coupleRow}>
        <View style={styles.person}>
          <Image
            accessible
            accessibilityLabel={announcement.candidate.name}
            source={{uri: announcement.candidate.images[0]}}
            style={styles.image}
          />
          <CustomText
            text={announcement.candidate.name}
            customStyle={styles.name}
          />
        </View>
        <CustomText text="+" customStyle={styles.plus} />
        <View style={styles.person}>
          <Image
            accessible
            accessibilityLabel={announcement.partner.name}
            source={{uri: announcement.partner.images[0]}}
            style={styles.image}
          />
          <CustomText
            text={announcement.partner.name}
            customStyle={styles.name}
          />
        </View>
      </View>

      <View style={styles.actions}>
        <CustomButton
          variant="secondary"
          text="close"
          customStyle={[styles.button, styles.secondaryButton]}
          customTextStyle={styles.secondaryButtonText}
          onPress={onClose}
        />
        <CustomButton
          text="confirm"
          customStyle={styles.button}
          customTextStyle={styles.buttonText}
          onPress={onClose}
        />
      </View>
    </CustomModal>
  );
};

export default CongratsModal;
