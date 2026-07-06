import React, {ReactNode} from 'react';
import {View} from 'react-native';
import FilterSvg from '../../assets/images/filter.svg';
import OrderBySvg from '../../assets/images/orderBy.svg';
import UserAddSvg from '../../assets/images/userAdd.svg';
import CustomButton, {
  BUTTON_ICON_SIZE,
} from '../../components/CustomButton/CustomButton';
import CustomText from '../../components/CustomText/CustomText';
import {useLanguage} from '../../utils/LanguageProvider';
import {styles} from './AllCardsScreen.style';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import MatchCard from '../../components/MatchCard/MatchCard';
import {MatchCardType} from '../../components/MatchCard/MatchCard.type';
import {FontsStyle} from '../../utils/FontsStyle';
import TrashSvg from '../../assets/images/trash.svg';
import {UserRole} from '../../services/session';

type ToolbarProps = {
  children?: ReactNode;
  isFilterOpen: boolean;
  isSortOpen: boolean;
  onAdd: () => void;
  onFilter: () => void;
  onSort: () => void;
};

export const AllCardsToolbar = ({
  children,
  isFilterOpen,
  isSortOpen,
  onAdd,
  onFilter,
  onSort,
}: ToolbarProps) => {
  const {isRTL} = useLanguage();
  const actions = [
    {key: 'addCandidate', icon: UserAddSvg, active: false, onPress: onAdd},
    {key: 'filter', icon: FilterSvg, active: isFilterOpen, onPress: onFilter},
    {key: 'sort', icon: OrderBySvg, active: isSortOpen, onPress: onSort},
  ];

  return (
    <View style={styles.pinChildrenContainer}>
      <View
        style={[
          styles.actionsBar,
          isRTL ? styles.actionsBarRtl : styles.actionsBarLtr,
        ]}>
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <CustomButton
              unstyled
              key={action.key}
              accessibilityLabel={action.key}
              style={[
                styles.actionButton,
                action.active && styles.actionButtonActive,
                isRTL ? styles.actionButtonRtl : styles.actionButtonLtr,
              ]}
              onPress={action.onPress}>
              <Icon width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
              <CustomText
                text={action.key}
                customStyle={[
                  styles.actionText,
                  action.active && styles.actionTextActive,
                ]}
              />
            </CustomButton>
          );
        })}
      </View>
      {children}
    </View>
  );
};

export const CardsSummary = ({
  femaleCount,
  maleCount,
  total,
}: {
  femaleCount: number;
  maleCount: number;
  total: number;
}) => (
  <View style={styles.statsRow}>
    {[
      {value: total, label: 'cardsCount'},
      {value: maleCount, label: 'male'},
      {value: femaleCount, label: 'female'},
    ].map(stat => (
      <View key={stat.label} style={styles.statChip}>
        <CustomText text={stat.value} customStyle={styles.statValue} />
        <CustomText text={stat.label} customStyle={styles.statLabel} />
      </View>
    ))}
  </View>
);

type ContentProps = {
  cards: MatchCardType[];
  currentUserRole: UserRole;
  femaleCount: number;
  hasLoaded: boolean;
  isMenuOpen: boolean;
  maleCount: number;
  onCardPress: (card: MatchCardType) => void;
  onDelete: (card: MatchCardType) => void;
  onlyMine: boolean;
};

export const AllCardsContent = ({
  cards,
  currentUserRole,
  femaleCount,
  hasLoaded,
  isMenuOpen,
  maleCount,
  onCardPress,
  onDelete,
  onlyMine,
}: ContentProps) => {
  const {isRTL} = useLanguage();

  return (
    <View style={styles.container}>
      <WhiteCard customStyle={styles.headerCard}>
        <CustomText
          accessibilityRole="header"
          text={onlyMine ? 'myCardsTitle' : 'allMatchmakersCardsTitle'}
          customStyle={[styles.title, isRTL ? styles.textRtl : styles.textLtr]}
        />
        <CustomText
          text={onlyMine ? 'myCardsSubtitle' : 'allMatchmakersCardsSubtitle'}
          customStyle={[
            styles.subtitle,
            isRTL ? styles.textRtl : styles.textLtr,
          ]}
        />
      </WhiteCard>

      {!isMenuOpen ? (
        <>
          <CardsSummary
            total={cards.length}
            maleCount={maleCount}
            femaleCount={femaleCount}
          />
          {!hasLoaded ? null : cards.length === 0 ? (
            <CustomText
              text={onlyMine ? 'noAssignedCards' : 'noCardsYet'}
              customStyle={FontsStyle.text}
            />
          ) : (
            cards.map((card, index) => (
              <View
                key={card.profileId || card.phone || String(index)}
                style={styles.matchCardWrapper}>
                <CustomButton
                  unstyled
                  accessibilityLabel={card.name}
                  onPress={() => onCardPress(card)}
                  customStyle={styles.matchCard}>
                  <MatchCard
                    {...card}
                    currentUserRole={currentUserRole}
                    isSlide={false}
                    isShowMeetingInfo={false}
                  />
                </CustomButton>
                {currentUserRole === 'admin' && card.profileId ? (
                  <CustomButton
                    unstyled
                    accessibilityLabel="deleteCandidate"
                    style={styles.deleteCandidateButton}
                    onPress={() => onDelete(card)}>
                    <TrashSvg
                      width={BUTTON_ICON_SIZE}
                      height={BUTTON_ICON_SIZE}
                    />
                  </CustomButton>
                ) : null}
              </View>
            ))
          )}
        </>
      ) : null}
    </View>
  );
};
