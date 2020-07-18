import { StyleSheet } from "react-native";

export default StyleSheet.create({
    subsectionLabelContainer: {
        backgroundColor: "lightgray",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        flex: 1
    },
    verticalLabel: {
        position: "absolute",
        textAlign: "center",
        textTransform: "uppercase",
        transform: [{ rotate: "270deg" }]
    }
});
