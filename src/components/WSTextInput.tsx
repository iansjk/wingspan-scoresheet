import React from "react";
import { TextInput, TextInputProps, StyleProp, TextStyle } from "react-native";
import globalStyles from "../global/styles";
import styles from "./WSTextInput.styles";

const WSTextInput: React.StatelessComponent<TextInputProps> = (props) => {
    const { style, ...otherProps } = props;
    return (
        <TextInput
            style={[globalStyles.text, styles.textInput, style] as StyleProp<TextStyle>}
            selectTextOnFocus={true}
            {...otherProps}
        />
    );
}
export default WSTextInput;
