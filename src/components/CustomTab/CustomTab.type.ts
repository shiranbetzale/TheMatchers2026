type TabType = {
  label: string;
}

export type CustomTabType = {
  tabs: TabType[];
  activeTab: number;
  onTabPress: (index: number) => void;
};
