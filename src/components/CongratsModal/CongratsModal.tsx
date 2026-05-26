import React from 'react';
import {Image, Modal, Pressable, View} from 'react-native';
import CustomText from '../CustomText/CustomText';
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
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <CustomText text="congratsTitle" customStyle={styles.title} />
          <CustomText text={statusText} customStyle={styles.subtitle} />

          <View style={styles.coupleRow}>
            <View style={styles.person}>
              <Image
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
                source={{uri: announcement.partner.images[0]}}
                style={styles.image}
              />
              <CustomText
                text={announcement.partner.name}
                customStyle={styles.name}
              />
            </View>
          </View>

          <Pressable style={styles.button} onPress={onClose}>
            <CustomText text="close" customStyle={styles.buttonText} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default CongratsModal;
