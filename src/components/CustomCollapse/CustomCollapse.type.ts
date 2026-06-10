import {Option} from '../../utils/FormFields.type';

export type CollapseSingleType = {
  title: string;
  data: any[];
};

export type CustomTitleCollapseType = {
  title: string;
  handlePress: () => void;
  isDisabled?: boolean;
};

export type CustomCollapseType = {
  sections: CollapseSingleType[];
  handlePress: (option?: Option | boolean, fieldId?: string) => void;
  lockedSectionTitles?: string[];
  autoExpandUnlockedSection?: boolean;
  showRequiredFieldsNote?: boolean;
};
