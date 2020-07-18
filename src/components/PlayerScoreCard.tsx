import React from "react";
import TableCell from "./TableCell";
import WSText from "./WSText";
import WSTextInput from "./WSTextInput";
import { View } from "react-native";

interface PlayerScoreCardProps {
    playerNumber: number,
    scores: Array<number>,
    maxScore: number,
    onChangeText(text: string, i: number, playerNumber: number): void,
    orientation: string
}

class PlayerScoreCard extends React.Component<PlayerScoreCardProps> {
    constructor(props) {
        super(props);
    }

    renderScoreCell(i: number) {
        return (
            <TableCell
                key={i}
                style={this.props.orientation === 'LANDSCAPE' ? { padding: 5 } : {}}
            >
                <WSTextInput
                    onChangeText={(text) => this.props.onChangeText(text, i, this.props.playerNumber)}
                    value={this.props.scores[i].toString()}
                    placeholder={'0'}
                    keyboardType='numeric'
                />
            </TableCell>
        );
    }

    render() {
        const total = this.props.scores.reduce((a, b) => a + b);
        const totalCell = <TableCell style={{
            borderBottomWidth: 0,
            borderTopWidth: 2,
            backgroundColor: this.props.maxScore > 0 && total === this.props.maxScore ? "yellow" : "white"
        }}>
            <WSText>{total}</WSText>
        </TableCell>
        if (this.props.playerNumber === -1) { // automa
            return (
                <View style={{ flex: 4 }}>
                    <TableCell>
                        <WSText>Automa</WSText>
                    </TableCell>
                    <View style={{
                        flex: 3,
                        borderTopWidth: 2
                    }}>
                        {this.renderScoreCell(0)}
                        <TableCell style={{ backgroundColor: 'gray' }}></TableCell>
                        {this.renderScoreCell(1)}
                    </View>
                    <View style={{
                        flex: 3
                    }}>
                        {this.renderScoreCell(2)}
                        <TableCell style={{ backgroundColor: 'gray' }}></TableCell>
                        {this.renderScoreCell(3)}
                    </View>
                    {totalCell}
                </View>
            );
        } else {
            return (
                <View style={{ flex: 4 }}>
                    <TableCell>
                        <WSTextInput
                            defaultValue={"Player " + (this.props.playerNumber + 1)}
                        />
                    </TableCell>
                    <View style={{
                        flex: 3,
                        borderTopWidth: 2
                    }}>
                        {this.props.scores.slice(0, 3).map((_, i) => this.renderScoreCell(i))}
                    </View>
                    <View style={{ flex: 3 }}>
                        {this.props.scores.slice(3).map((_, i) => this.renderScoreCell(i + 3))}
                    </View>
                    {totalCell}
                </View>
            );
        }
    }
}
export default PlayerScoreCard;
