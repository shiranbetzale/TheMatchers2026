import { FormField } from "./FormFields.type";

const FilterFields: FormField[] = [
    {
        id: "name",
        text: "שם:",
        keyboardTypeOption: "default",
        fieldType: "input",
        isSmallSize: true
    },
    {
        id: "city",
        text: "עיר מגורים:",
        keyboardTypeOption: "default",
        fieldType: "input",
        isSmallSize: true
    },
    {
        id: "isMyCards",
        text: "כרטיסים שלי",
        fieldType: "switch",
        isSmallSize: true
    },
    {
        id: "gender",
        text: "מגדר:",
        options: [
            { id: 1, name: "gender", label: "זכר" },
            { id: 2, name: "gender", label: "נקבה" }
        ],
        fieldType: "radioButton",
        isSmallSize: true,
        handlePress: () => { },
    },
    {
        id: "matchRangeAges",
        text: "טווח גילאים",
        fieldType: "range",
        minRange: 18,
        maxRange: 90,
        step: 1,
        isSmallSize: true
    },
    {
        id: "matchRangeHights",
        text: "טווח גבהים",
        fieldType: "range",
        minRange: 120,
        maxRange: 200,
        step: 1,
        isSmallSize: true
    },
    {
        id: "status",
        text: "סטטוס:",
        fieldType: "checkbox",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "status", label: "רווק/ה" },
            { id: 2, name: "status", label: "אלמן/ה" },
            { id: 3, name: "status", label: "גרוש/ה" },
            { id: 4, name: "status", label: "אלמן/ה +" },
            { id: 5, name: "status", label: "גרוש/ה +" }
        ],
        isSmallSize: true
    },
    {
        id: "typeOfPhone",
        text: "סוג נייד:",
        fieldType: "checkbox",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "typeOfPhone", label: "כשר" },
            { id: 2, name: "typeOfPhone", label: "מוגן" },
            { id: 3, name: "typeOfPhone", label: "לא מוגן" }
        ],
        isSmallSize: true
    },
    {
        id: "hashkafa",
        text: "השקפה:",
        fieldType: "checkbox",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "hashkafa", label: "דתי/ה" },
            { id: 2, name: "hashkafa", label: "חרדי/ת" },
            { id: 3, name: "hashkafa", label: "חרדי/ת מודרני/ת" },
            { id: 4, name: "hashkafa", label: "חוזר/ת בתשובה" }
        ],
        isSmallSize: true
    },
    {
        id: "zerem",
        text: "זרם:",
        fieldType: "checkbox",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "zerem", label: "חסיד" },
            { id: 2, name: "zerem", label: "ליטאי" },
            { id: 3, name: "zerem", label: "עדות המזרח" }
        ],
        isSmallSize: true
    },
];

export default FilterFields;
