import { FormField } from "./FormFields.type";
import {cityOptions} from './cityOptions';

const FilterFields: FormField[] = [
  { id: "name", text: "nameLabel", keyboardTypeOption: "default", fieldType: "input", isSmallSize: true },
  { id: "city", text: "cityLabel", fieldType: "autocomplete", options: cityOptions, autocompleteSource: "israelCities", isSmallSize: true },
  { id: "isMyCards", text: "myCards", fieldType: "switch", isSmallSize: true },
  {
    id: "gender",
    text: "genderLabel",
    fieldType: "radioButton",
    options: [
      { id: 1, name: "gender", label: "male" },
      { id: 2, name: "gender", label: "female" },
    ],
    isSmallSize: true,
    handlePress: () => {},
  },
  { id: "matchRangeAges", text: "ageRange", fieldType: "range", minRange: 18, maxRange: 90, step: 1, isSmallSize: true },
  { id: "matchRangeHeights", text: "heightRange", fieldType: "range", minRange: 120, maxRange: 200, step: 1, isSmallSize: true },
  {
    id: "status",
    text: "statusLabel",
    fieldType: "checkbox",
    options: [
      { id: 1, name: "status", label: "singleStatus" },
      { id: 2, name: "status", label: "widowedStatus" },
      { id: 3, name: "status", label: "divorcedStatus" },
      { id: 4, name: "status", label: "widowedWithChildrenStatus" },
      { id: 5, name: "status", label: "divorcedWithChildrenStatus" },
    ],
    handlePress: () => console.log(),
    isSmallSize: true,
  },
  {
    id: "typeOfPhone",
    text: "phoneTypeLabel",
    fieldType: "checkbox",
    options: [
      { id: 1, name: "typeOfPhone", label: "kosherPhone" },
      { id: 2, name: "typeOfPhone", label: "protectedPhone" },
      { id: 3, name: "typeOfPhone", label: "unprotectedPhone" },
    ],
    handlePress: () => console.log(),
    isSmallSize: true,
  },
  {
    id: "hashkafa",
    text: "worldviewLabel",
    fieldType: "checkbox",
    options: [
      { id: 1, name: "hashkafa", label: "religiousStatus" },
      { id: 2, name: "hashkafa", label: "harediStatus" },
      { id: 3, name: "hashkafa", label: "modernHarediStatus" },
      { id: 4, name: "hashkafa", label: "baalTeshuvaStatus" },
    ],
    handlePress: () => console.log(),
    isSmallSize: true,
  },
  {
    id: "zerem",
    text: "communityLabel",
    fieldType: "checkbox",
    options: [
      { id: 1, name: "zerem", label: "hasidic" },
      { id: 2, name: "zerem", label: "litvish" },
      { id: 3, name: "zerem", label: "sephardicCommunity" },
    ],
    handlePress: () => console.log(),
    isSmallSize: true,
  },
];

export default FilterFields;
