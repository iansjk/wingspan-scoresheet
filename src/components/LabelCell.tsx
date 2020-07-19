import React from "react";
import { View, StyleProp, ViewProps, ViewStyle } from "react-native";
import globalStyles from "../global/styles";
import styles from "./LabelCell.style";

const LabelCell: React.StatelessComponent<ViewProps> = (props) => {
    return (
        <View style={[globalStyles.tableCell, styles.labelCell, props.style] as StyleProp<ViewStyle>}>{props.children}</View>
    );
};
export default LabelCell;
