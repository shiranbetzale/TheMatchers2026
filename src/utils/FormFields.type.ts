export type Option = {
    id: number;
    name: string;
    label: string;
    isShow?: Condition[];
    isSmallSize?: boolean;
}

export type Condition = {
    fieldId: string;
    value: string;
}

export type FormField = {
    id: string;
    collapseTitle?: string;
    defaultValue?: string | number;
    text: string;
    isMultiline?: boolean;
    isEditable?: boolean;
    keyboardTypeOption?: "default" | "numeric";
    fieldType: "checkbox" | "range" | "input" | "select" | "datePicker" | "switch" | "radioButton";
    options?: Option[];
    handlePress?: (option?: Option | boolean) => void;
    minRange?: number;
    maxRange?: number;
    step?: number;
    validation?: any;
    condition?: Condition[];
    maxDate?: Date;
    isSmallSize?: boolean;
    maxLength?: number;
}
