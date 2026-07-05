import { StyleSheet } from "react-native";
import Colors from "../../utils/Colors";
import {FontsStyle} from "../../utils/FontsStyle";
import GeneralStyle from "../../utils/GeneralStyle";
import SharedStyles from '../../utils/SharedStyles';

export const styles = StyleSheet.create({
  ...SharedStyles,
  container: {
    width: '100%',
    alignItems: "center",
    justifyContent: "space-between",
    gap: GeneralStyle.spacing.sm,
  },
  labelWrapper: {
    flex: 0.42,
    minWidth: GeneralStyle.size.avatar,
    flexShrink: 0,
  },
  label: {
    ...FontsStyle.questionLabel,
    width: '100%',
    flexShrink: 0,
  },
  dateContainer: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: GeneralStyle.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    borderRadius: GeneralStyle.radius.md,
    backgroundColor: Colors.white,
    paddingHorizontal: GeneralStyle.spacing.sm,
    minHeight: GeneralStyle.size.field,
  },
  dateContainerRtl: {
    flexDirection: 'row',
  },
  dateContainerLtr: {
    flexDirection: 'row-reverse',
  },
  readOnlyDateContainer: {
    backgroundColor: Colors.surfaceMuted,
  },
  dateText: {
    flex: 1,
    minWidth: 0,
    color: Colors.darkGreen,
  },
  datePlaceholder: {
    color: Colors.placeholder,
  },
});
