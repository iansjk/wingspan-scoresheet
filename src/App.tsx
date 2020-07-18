import { AppLoading, registerRootComponent } from 'expo';
import * as Font from 'expo-font';
import * as ScreenOrientation from 'expo-screen-orientation';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StatusBar, TouchableWithoutFeedback } from 'react-native';
import EndOfRoundGoalsModal from './components/EndOfRoundGoalsModal';
import PlayerScoreCard from './components/PlayerScoreCard';
import { ScoreLabelColumn } from './components/ScoreLabelColumn';
import * as Constants from './global/constants';

interface AppState {
    numPlayers: number,
    isReady: boolean,
    scores: Array<Array<number>>,
    automaScores: Array<number>,
    paddingBottom: number,
    orientation: string,
    endOfRoundGoalsModalVisible: boolean
}

class App extends React.Component<{}, AppState> {
    constructor(props) {
        super(props);
        this.state = {
            numPlayers: Constants.STARTING_PLAYERS,
            isReady: false,
            scores: this._initializeScores(Constants.STARTING_PLAYERS),
            automaScores: this._initializePlayerScores(),
            paddingBottom: 0,
            orientation: 'PORTRAIT',
            endOfRoundGoalsModalVisible: false
        }
    }

    _initializeScores(numPlayers) {
        return Array.from(Array(numPlayers), () => this._initializePlayerScores());
    }

    _initializePlayerScores() {
        return Array(6).fill(0);
    }

    handleChangeText(text: string, i: number, playerNumber: number) {
        const value = Number(text);
        if (!isNaN(value)) {
            if (playerNumber === -1) { // automa
                let automaScores = this.state.automaScores.slice();
                automaScores[i] = value;
                this.setState({
                    automaScores: automaScores
                });
            } else {
                let scores = this.state.scores.slice();
                scores[playerNumber][i] = value;
                this.setState({
                    scores: scores
                });
            }
        }
    }

    handleReset() {
        this.setState({
            scores: this._initializeScores(this.state.numPlayers),
            automaScores: this._initializePlayerScores()
        });
    }

    handleAddPlayer() {
        const newNum = this.state.numPlayers + 1;
        if (newNum <= Constants.MAX_PLAYERS) {
            const scores = this.state.scores;
            scores.push(this._initializePlayerScores());
            if (newNum >= Constants.ORIENTATION_BREAK_POINT) {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            }
            this.setState({
                numPlayers: newNum,
                scores: scores
            });
        }
    }

    handleRemovePlayer() {
        const newNum = this.state.numPlayers - 1;
        if (newNum >= Constants.MIN_PLAYERS) {
            if (newNum < Constants.ORIENTATION_BREAK_POINT) {
                ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
            }
            this.setState({
                numPlayers: newNum,
                scores: this.state.scores.slice(0, newNum)
            });
        }
    }

    handleOrientationChange(e: any) {
        this.setState({
            orientation: e.orientationLock
        });
    }

    async loadAssets() {
        await Promise.all([
            Font.loadAsync({
                'cardenio-modern': require('./assets/fonts/CardenioModern-Regular.otf'),
                'cardenio-modern-bold': require('./assets/fonts/CardenioModern-Bold.otf')
            }),
            ScreenOrientation.addOrientationChangeListener((e) => this.handleOrientationChange(e)),
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
        ]);
    }

    renderPlayers() {
        const scores: number[][] = (this.state.numPlayers === 1) ?
            new Array(this.state.scores[0], this.state.automaScores) :
            this.state.scores;
        const maxScore = Math.max(...scores.map((playerScores) => playerScores.reduce((a, b) => a + b)));
        let players = Array.from(Array(this.state.numPlayers).keys()).map((i) =>
            <PlayerScoreCard
                key={i}
                playerNumber={i}
                scores={this.state.scores[i]}
                maxScore={maxScore}
                onChangeText={(text, i, playerNumber) => this.handleChangeText(text, i, playerNumber)}
                orientation={this.state.orientation}
            />
        );
        if (this.state.numPlayers === 1) {
            players.push(<PlayerScoreCard
                key={1}
                playerNumber={-1}
                scores={this.state.automaScores}
                maxScore={maxScore}
                onChangeText={(text, i) => this.handleChangeText(text, i, -1)}
                orientation={this.state.orientation}
            />);
        }
        return players;
    }

    render() {
        if (!this.state.isReady) {
            return (
                <AppLoading
                    startAsync={() => this.loadAssets()}
                    onError={console.warn}
                    onFinish={() => this.setState({ isReady: true })}
                />
            );
        }

        return (
            <React.StrictMode>
                <EndOfRoundGoalsModal
                    visible={this.state.endOfRoundGoalsModalVisible}
                />
                <TouchableWithoutFeedback
                    onPress={() => Keyboard.dismiss()}
                    accessible={false}
                    style={{ flex: 1 }}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            width: '100%',
                            height: '100%',
                            paddingTop: StatusBar.currentHeight + Constants.SCREEN_PADDING_TOP,
                            paddingBottom: Constants.SCREEN_PADDING_BOTTOM + this.state.paddingBottom,
                        }}
                    >
                        <ScoreLabelColumn
                            numPlayers={this.state.numPlayers}
                            onReset={() => this.handleReset()}
                            onAddPlayer={() => this.handleAddPlayer()}
                            onRemovePlayer={() => this.handleRemovePlayer()}
                            orientation={this.state.orientation}
                        />
                        {this.renderPlayers()}
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </React.StrictMode>
        );
    }
}
export default registerRootComponent(App);
