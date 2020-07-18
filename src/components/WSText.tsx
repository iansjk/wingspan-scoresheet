import React from "react";
import { Text, TextProps, StyleProp, TextStyle } from "react-native";
import globalStyles from "../global/styles";

const WSText: React.StatelessComponent<TextProps> = (props) => {
    return (
        <Text style={[globalStyles.text, props.style] as StyleProp<TextStyle>}>{props.children}</Text>
    );
}
export default WSText;
