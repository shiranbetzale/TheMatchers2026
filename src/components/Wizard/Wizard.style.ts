import { Dimensions, StyleSheet } from 'react-native';
import Colors from '../../utils/Colors';
import {FontsStyle} from '../../utils/FontsStyle';
import GeneralStyle from '../../utils/GeneralStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  wizardContainer: {
    borderBottomWidth: 1,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingTop: GeneralStyle.spacing.md,
    paddingBottom: GeneralStyle.spacing.sm,
    backgroundColor: Colors.ivory,
    borderBottomColor: Colors.borderSoft,
    ...Colors.Shadow,
  },
  headerTopRow: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: GeneralStyle.spacing.sm,
  },
  containerDynamicComp: {
    height: Dimensions.get("window").height - 175,
    backgroundColor: Colors.transparent,
  },
  errorContainer: {
    paddingHorizontal: GeneralStyle.spacing.sm,
    paddingTop: GeneralStyle.spacing.sm,
  },
  btn: {
    minWidth: 76,
    minHeight: 44,
    paddingHorizontal: GeneralStyle.spacing.md,
    paddingVertical: GeneralStyle.spacing.sm,
    backgroundColor: Colors.ivory,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    borderBottomColor: Colors.color1Light,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnPlaceholder: {
    minWidth: 76,
  },
  primaryBtn: {
    backgroundColor: Colors.navyDeep,
    borderColor: Colors.premiumLine,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: GeneralStyle.spacing.sm,
  },
  title: {
    ...FontsStyle.wizardTitle,
    color: Colors.darkGreen,
    fontSize: 24,
    textAlign: 'center',
  },
  stepCaption: {
    ...FontsStyle.text,
    color: Colors.slate,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  btnText: {
    ...FontsStyle.text,
    color: Colors.darkGreen,
  },
  primaryBtnText: {
    color: Colors.white,
  },
  progressTrack: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: GeneralStyle.spacing.xs,
    marginTop: GeneralStyle.spacing.sm,
  },
  progressDot: {
    width: 38,
    height: 4,
    borderRadius: 999,
    backgroundColor: Colors.line,
  },
  progressDotActive: {
    backgroundColor: Colors.premiumLine,
  },
});
