import { StyleSheet } from "react-native";

export default StyleSheet.create({
    cell: {
        alignItems: "center",
        borderColor: "black",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        flex: 1,
        justifyContent: "center",
        width: "100%"
    },
    column: {
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "black",
        flex: 1,
        height: "80%",
        margin: 10
    },
    columns: {
        flex: 9,
        flexDirection: "row-reverse"
    },
    modalView: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 20,
        elevation: 5,
        flex: 1,
        margin: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        elevation: 2,
        padding: 10
    },
    placeText: {
        fontSize: 10
    },
    pointText: {
        fontSize: 24
    },
    switchbar: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center"
    }
});
