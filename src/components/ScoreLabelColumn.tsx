import React from "react";
import { LayoutChangeEvent, StyleProp, TextStyle, View } from "react-native";
import { MAX_PLAYERS, MIN_PLAYERS } from "../global/constants";
import IconButton from "./IconButton";
import LabelCell from "./LabelCell";
import styles from "./ScoreLabelColumn.styles";
import WSText from "./WSText";

interface VerticalLabelProps {
    width: number,
    height: number,
    left: number,
    top: number,
    lineHeight: number
}

interface ScoreLabelColumnProps {
    numPlayers: number,
    onAddPlayer(): void,
    onRemovePlayer(): void,
    onReset(): void,
    orientation: string
}

interface ScoreLabelColumnState {
    amountOnCardsStyle: VerticalLabelProps,
    onePointEachStyle: VerticalLabelProps,
}

export class ScoreLabelColumn extends React.Component<ScoreLabelColumnProps, ScoreLabelColumnState> {
    constructor(props: ScoreLabelColumnProps) {
        super(props);
        this.state = {
            amountOnCardsStyle: {
                width: 0,
                height: 0,
                left: 0,
                top: 0,
                lineHeight: 0
            },
            onePointEachStyle: {
                width: 0,
                height: 0,
                left: 0,
                top: 0,
                lineHeight: 0
            }
        };
    }

    handleLayout(event: LayoutChangeEvent, propName: string): void {
        const viewLayout = event.nativeEvent.layout;
        const labelStyle = {
            left: -viewLayout.height / 2 + viewLayout.width / 2,
            top: viewLayout.height / 2 - viewLayout.width / 2,
            width: viewLayout.height,
            height: viewLayout.width - 2,
            lineHeight: viewLayout.width - 2
        };
        if (propName === "amountOnCards") {
            this.setState({
                amountOnCardsStyle: labelStyle
            });
        } else if (propName === "onePointEach") {
            this.setState({
                onePointEachStyle: labelStyle
            });
        }
    }

    render(): JSX.Element {
        const removePlayerDisabled = this.props.numPlayers === MIN_PLAYERS;
        const addPlayerDisabled = this.props.numPlayers === MAX_PLAYERS;
        return (
            <View style={{ flex: 9 }}>
                <LabelCell style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <View style={{
                            paddingRight: 10,
                            borderRightWidth: 1,
                            borderColor: "lightgray"
                        }}>
                            <IconButton
                                name='repeat'
                                style={{ color: "black" }}
                                onPress={this.props.onReset}
                            />
                        </View>
                        <View style={{ marginLeft: 10 }}></View>
                        <IconButton
                            name='minus-circle'
                            style={{ color: removePlayerDisabled ? "gray" : "red" }}
                            onPress={this.props.onRemovePlayer}
                            disabled={removePlayerDisabled}
                        />
                        <WSText style={{ margin: 5 }}>{this.props.numPlayers}P</WSText>
                        <IconButton
                            name='plus-circle'
                            style={{ color: addPlayerDisabled ? "gray" : "green" }}
                            onPress={this.props.onAddPlayer}
                            disabled={addPlayerDisabled}
                        />
                    </View>
                </LabelCell>
                <View style={{
                    flex: 3,
                    flexDirection: "row",
                    borderTopWidth: 2
                }}>
                    <View
                        style={styles.subsectionLabelContainer}
                        onLayout={(e) => this.handleLayout(e, "amountOnCards")}
                    >
                        <WSText
                            style={[this.state.amountOnCardsStyle,
                                styles.verticalLabel,
                                this.props.orientation === "LANDSCAPE" ? { fontSize: 18 } : {}
                            ] as StyleProp<TextStyle>}
                        >Amount on cards</WSText>
                    </View>
                    <View style={{ flex: 5 }}>
                        <LabelCell>
                            <WSText>Birds</WSText>
                        </LabelCell>
                        <LabelCell>
                            <WSText>Bonus cards</WSText>
                        </LabelCell>
                        <LabelCell>
                            <WSText>End-of-round goals</WSText>
                        </LabelCell>
                    </View>
                </View>
                <View style={{
                    flex: 3,
                    flexDirection: "row"
                }}>
                    <View
                        style={styles.subsectionLabelContainer}
                        onLayout={(e) => this.handleLayout(e, "onePointEach")}
                    >
                        <WSText
                            style={[this.state.onePointEachStyle,
                                styles.verticalLabel,
                                this.props.orientation === "LANDSCAPE" ? { fontSize: 20 } : {}
                            ] as StyleProp<TextStyle>}
                        >1 Point Each</WSText>
                    </View>
                    <View style={{ flex: 5 }}>
                        <LabelCell>
                            <WSText>Eggs</WSText>
                        </LabelCell>
                        <LabelCell>
                            <WSText>Food on cards</WSText>
                        </LabelCell>
                        <LabelCell>
                            <WSText>Tucked cards</WSText>
                        </LabelCell>
                    </View>
                </View>
                <LabelCell style={{
                    borderBottomWidth: 0,
                    borderTopWidth: 2,
                    alignItems: "center"
                }}>
                    <WSText style={{
                        textTransform: "uppercase",
                        fontFamily: "cardenio-modern-bold"
                    }}>Total</WSText>
                </LabelCell>
            </View>
        );
    }
}
