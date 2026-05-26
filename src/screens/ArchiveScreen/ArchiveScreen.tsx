import React, {useMemo} from 'react';
import {View} from 'react-native';
import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import CustomText from '../../components/CustomText/CustomText';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import HomeScreen from '../HomeScreen/HomeScreen';
import {isArchivedCard} from '../../utils/archiveCards';
import {styles} from './ArchiveScreen.style';

const archiveCards: MatchCardType[] = [
  {
    city: 'cityBneiBrak',
    matcherMail: 'matchmaker1@example.com',
    mail: 'candidate1@example.com',
    phone: '0521111111',
    matcherPhone: '0549450954',
    matcherName: 'matchmakerShiranBetzalel',
    name: 'David Levi',
    offered: true,
    met: true,
    gender: 'male',
    age: 29,
    height: '1.78',
    status: 'single',
    relationshipStatus: 'engaged',
    partnerName: 'Miriam Cohen',
    numOfChildren: 0,
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    ],
  },
  {
    city: 'jerusalem',
    matcherMail: 'matchmaker2@example.com',
    mail: 'candidate2@example.com',
    phone: '0522222222',
    matcherPhone: '0549450954',
    matcherName: 'matchmakerShiranBetzalel',
    name: 'Miriam Cohen',
    offered: true,
    met: true,
    gender: 'female',
    age: 27,
    height: '1.66',
    status: 'single',
    relationshipStatus: 'married',
    partnerName: 'David Levi',
    numOfChildren: 0,
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    ],
  },
];

const ArchiveScreen = () => {
  const archivedCards = useMemo(
    () => archiveCards.filter(isArchivedCard),
    [],
  );
  const engagedCount = archivedCards.filter(
    card => card.relationshipStatus === 'engaged',
  ).length;
  const marriedCount = archivedCards.filter(
    card => card.relationshipStatus === 'married',
  ).length;

  return (
    <HomeScreen>
      <View style={styles.container}>
        <WhiteCard customStyle={styles.headerCard}>
          <CustomText text="archive" customStyle={styles.title} />
          <CustomText text="archiveSubtitle" customStyle={styles.subtitle} />
        </WhiteCard>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <CustomText text={`${archivedCards.length}`} customStyle={styles.statValue} />
            <CustomText text="archiveCards" customStyle={styles.statLabel} />
          </View>
          <View style={styles.statChip}>
            <CustomText text={`${engagedCount}`} customStyle={styles.statValue} />
            <CustomText text="engagedStatus" customStyle={styles.statLabel} />
          </View>
          <View style={styles.statChip}>
            <CustomText text={`${marriedCount}`} customStyle={styles.statValue} />
            <CustomText text="marriedStatus" customStyle={styles.statLabel} />
          </View>
        </View>

        {archivedCards.length ? (
          archivedCards.map((card, index) => (
            <View key={`${card.name}_${index}`} style={styles.cardBlock}>
              <View style={styles.relationshipBar}>
                <CustomText
                  text={`${card.name} + ${card.partnerName || ''}`}
                  customStyle={styles.relationshipText}
                />
                <CustomText
                  text={
                    card.relationshipStatus === 'married'
                      ? 'marriedStatus'
                      : 'engagedStatus'
                  }
                  customStyle={styles.relationshipBadge}
                />
              </View>
              <MatchCard
                {...card}
                isSlide={false}
                isShowMeetingInfo={false}
                isShowInfoButtons={false}
              />
            </View>
          ))
        ) : (
          <WhiteCard customStyle={styles.emptyCard}>
            <CustomText text="archiveEmptyTitle" customStyle={styles.emptyTitle} />
            <CustomText text="archiveEmptyText" customStyle={styles.emptyText} />
          </WhiteCard>
        )}
      </View>
    </HomeScreen>
  );
};

export default ArchiveScreen;
