import { ComponentType } from "react";
import { StyleProp, TextStyle } from "react-native";

export type WizardStep = {
    id: number;
    name: string;
    title: string;
    comp: ComponentType;
}

export type WizardBtnType = {
    isBtnDis?: boolean;
    btnTxt: string;
    btnFunc: () => void;
}

export type WizardTxtType = {
    customStyle?: StyleProp<TextStyle>,
    text?: string;
}

export type WizardHeaderType = {
    btnAProps: WizardBtnType;
    btnBProps: WizardBtnType;
    textProps: WizardTxtType;
};
