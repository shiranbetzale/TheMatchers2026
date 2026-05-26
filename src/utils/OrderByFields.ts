import { FormField } from "./FormFields.type";

const OrderByFields: FormField[] = [
    {
        id: "orderBy",
        text: "sortBy",
        options: [
            { id: 1, name: "orderBy", label: "sortName" },
            { id: 3, name: "orderBy", label: "sortAgeAsc" },
            { id: 4, name: "orderBy", label: "sortAgeDesc" },
            { id: 5, name: "orderBy", label: "sortCreatedAt" },
        ],
        fieldType: "radioButton",
        handlePress: () => { },
    },

];

export default OrderByFields;
