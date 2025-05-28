import { TextStyle } from "react-native";

export type WizardStep = {
    id: number;
    name: string;
    title: string;
    comp: any;
}

export type WizardBtnType = {
    isBtnDis?: boolean;
    btnTxt: string;
    btnFunc: () => void;
}

export type WizardTxtType = {
    customStyle?: TextStyle,
    text?: string;
}

export type WizardHeaderType = {
    btnAProps: WizardBtnType;
    btnBProps: WizardBtnType;
    textProps: WizardTxtType;
};