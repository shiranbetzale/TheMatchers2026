import CustomCheckBox from "../components/CustomCheckBox/CustomCheckBox";
import CustomDatePicker from "../components/CustomDatePicker/ CustomDatePicker";
import CustomInput from "../components/CustomInput/CustomInput";
import CustomRadioButton from "../components/CustomRadioButton/CustomRadioButton";
import CustomRange from "../components/CustomRange/CustomRange";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import CustomSwitch from "../components/CustomSwitch/CustomSwitch";
import { FormField } from "./FormFields.type";

const generateField = (props: FormField) => {
    const { maxLength, isSmallSize, defaultValue, maxDate, isEditable, minRange, maxRange, step, isMultiline, text, keyboardTypeOption, fieldType, options, handlePress = () => { } } = props;

    switch (fieldType) {
        case "input":
            return <CustomInput
                maxLength={maxLength}
                isSmallSize={isSmallSize}
                isMultiline={isMultiline}
                defaultValue={defaultValue}
                placeholder={text}
                isEditable={isEditable}
                keyboardType={keyboardTypeOption || "default"}
            />

        case "radioButton":
            return <CustomRadioButton
                isSmallSize={isSmallSize}
                text={text}
                radiosArray={options || []}
                onSelect={handlePress} />

        case "datePicker":
            return <CustomDatePicker
                text={text}
                maxDate={maxDate}
            />

        case "select":
            return <CustomSelect
                text={text}
                onSelect={handlePress}
                options={options || []}
            />

        case "switch":
            return <CustomSwitch
                isSmallSize={isSmallSize}
                text={text} />

        case "checkbox":
            return <CustomCheckBox
                isSmallSize={isSmallSize}
                text={text}
                options={options || []}
            />

        case "range":
            return <CustomRange
                isSmallSize={isSmallSize}
                text={text}
                step={step || 0}
                minRange={minRange || 0}
                maxRange={maxRange || 0}
            />

        default:
            break;
    }
}

export default generateField;
