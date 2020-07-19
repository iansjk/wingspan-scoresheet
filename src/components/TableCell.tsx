import React from "react";
import { ViewProps, ViewStyle, StyleProp, View } from "react-native";
import globalStyles from "../global/styles";

const TableCell: React.StatelessComponent<ViewProps> = (props) => {
    return (
        <View style={[globalStyles.tableCell, props.style] as StyleProp<ViewStyle>}>{props.children}</View>
    );
};
export default TableCell;
