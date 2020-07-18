import React, { useState } from "react";
import { Text, View, Modal, Switch, TouchableHighlight } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import WSText from "./WSText";
import styles from "./EndOfRoundGoalsModal.styles";

const mostModePoints: number[][] = [
    [4, 1, 0, 0],
    [5, 2, 1, 0],
    [6, 3, 2, 0],
    [7, 4, 3, 0]
];
const eachModePoints: number[][] = Array(4).fill(
    Array(6).fill(5).map((a, b) => a - b)
); // [5, 4, 3, 2, 1, 0], 4 times

const mostModeGradientColors = ["#64A03E", "#D9DDC7"];
const eachModeGradientColors = ["#79BBC6", "#ECFFF8"];

interface PointTextProps {
    value: number
}

const PointText: React.StatelessComponent<PointTextProps> = (props) => {
    return (
        <View style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        }}>
            <Text style={styles.pointText}>{props.value}</Text>
            <FontAwesome5 name="feather-alt" size={24} color="black" />
        </View>
    );
};

interface PlaceTextProps {
    index: number
}

const PlaceText: React.StatelessComponent<PlaceTextProps> = (props) => {
    let ordinal = "th";
    if (props.index === 0) {
        ordinal = "st";
    } else if (props.index === 1) {
        ordinal = "nd";
    } else if (props.index === 2) {
        ordinal = "rd";
    }
    const text = `${props.index + 1}${ordinal} Place`;
    return (
        <Text style={styles.placeText}>{text}</Text>
    );
};

interface EndOfRoundGoalsModalProps {
    visible: boolean
}

const EndOfRoundGoalsModal: React.StatelessComponent<EndOfRoundGoalsModalProps> = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [goalsMode, setGoalsMode] = useState("most");
    const trackColor = { false: mostModeGradientColors[0], true: eachModeGradientColors[0] };
    const iosBackgroundColor = trackColor["false"];
    const gradientColors = (goalsMode === "most") ? mostModeGradientColors : eachModeGradientColors;
    const points = (goalsMode === "most") ? mostModePoints : eachModePoints;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
        >
            <View style={styles.modalView}>
                <View style={styles.switchbar}>
                    <Text>Most</Text>
                    <Switch
                        style={{
                            marginLeft: 15,
                            marginRight: 15
                        }}
                        trackColor={trackColor}
                        ios_backgroundColor={iosBackgroundColor}
                        onValueChange={() => setGoalsMode(goalsMode === "most" ? "each" : "most")}
                        value={goalsMode === "each"}
                    />
                    <Text>1 Each</Text>
                </View>
                <View style={styles.columns}>
                    {
                        points.map((column, roundIndex) => {
                            return (
                                <View style={styles.column} key={roundIndex}>
                                    <Text style={{
                                        position: "absolute",
                                        top: "-10%"
                                    }}>
                                        Round {roundIndex + 1}
                                    </Text>
                                    <LinearGradient
                                        colors={gradientColors}
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            right: 0,
                                            top: 0,
                                            height: "100%",
                                        }}
                                    />
                                    {
                                        column.map((cell, placeIndex) => {
                                            return (
                                                <TouchableHighlight
                                                    key={placeIndex}
                                                    style={styles.cell}
                                                    underlayColor={"rgba(0,0,0,0.3)"}
                                                    onPress={(e) => {
                                                        alert(`Clicked on Round ${roundIndex + 1}, Place: ${placeIndex + 1}`);
                                                    }}
                                                >
                                                    <View>
                                                        <PointText value={cell} />
                                                        {
                                                            (placeIndex < 3) &&
                                                            <PlaceText index={placeIndex} />
                                                        }
                                                    </View>
                                                </TouchableHighlight>
                                            );
                                        })
                                    }
                                </View>
                            );
                        }
                        )
                    }
                </View>

                <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                    onPress={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <WSText>Hide Modal</WSText>
                </TouchableHighlight>
            </View>
        </Modal>
    );
};
export default EndOfRoundGoalsModal;
