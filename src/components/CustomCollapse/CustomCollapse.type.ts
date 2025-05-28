export type CollapseSingleType = {
  title: string;
  data: any[];
};

export type CustomTitleCollapseType = {
  title: string;
  handlePress: () => void;
};

export type CustomCollapseType = {
  sections: CollapseSingleType[];
  handlePress: () => void;
};

