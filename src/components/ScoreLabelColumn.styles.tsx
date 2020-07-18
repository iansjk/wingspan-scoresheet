import { StyleSheet } from "react-native";

export default StyleSheet.create({
    verticalLabel: {
        position: 'absolute',
        textAlign: 'center',
        textTransform: 'uppercase',
        transform: [{ rotate: '270deg' }]
    },
    subsectionLabelContainer: {
        flex: 1,
        backgroundColor: 'lightgray',
        borderRightWidth: 1,
        borderBottomWidth: 1
    }
});
