import { FormField } from "./FormFields.type";

const OrderByFields: FormField[] = [
    {
        id: "orderBy",
        text: "מיין לפי:",
        options: [
            { id: 1, name: "orderBy", label: "שם" },
            { id: 3, name: "orderBy", label: "גיל - עולה" },
            { id: 4, name: "orderBy", label: "גיל - יורד" },
            { id: 5, name: "orderBy", label: "תאריך הוספה" },
        ],
        fieldType: "radioButton",
        handlePress: () => { },
    },

];

export default OrderByFields;
