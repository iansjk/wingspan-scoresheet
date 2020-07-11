import { FontAwesome } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Font from 'expo-font';
import React from 'react';
import { Keyboard, StatusBar, StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextProps, TextStyle, TouchableHighlightProps, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, View, ViewProps, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';

const styles = StyleSheet.create({
  tableCell: {
    flex: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  labelCell: {
    borderLeftWidth: 0,
    paddingLeft: 10,
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 24,
    fontFamily: 'cardenio-modern'
  },
  textInput: {
    flex: 1,
    alignSelf: 'stretch',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
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

const TableCell: React.StatelessComponent<ViewProps> = (props) =>
  <View style={[styles.tableCell, props.style] as StyleProp<ViewStyle>}>{props.children}</View>

const LabelCell: React.StatelessComponent<ViewProps> = (props) =>
  <View style={[styles.tableCell, styles.labelCell, props.style] as StyleProp<ViewStyle>}>{props.children}</View>

const WSText: React.StatelessComponent<TextProps> = (props) =>
  <Text style={[styles.text, props.style] as StyleProp<TextStyle>}>{props.children}</Text>

const WSTextInput: React.StatelessComponent<TextInputProps> = (props) => {
  const { style, ...otherProps } = props;
  return (
    <TextInput
      style={[styles.text, styles.textInput, style] as StyleProp<TextStyle>}
      selectTextOnFocus={true}
      {...otherProps}
    />
  );
}

interface IconButtonProps {
  name: string,
  iconStyle?: object,
  backgroundColor?: string
}

class IconButton extends React.Component<IconButtonProps & TextProps & TouchableHighlightProps & TouchableWithoutFeedbackProps> {
  render() {
    const { style, ...otherProps } = this.props;
    return (
      <FontAwesome.Button
        name={this.props.name}
        iconStyle={{
          ...(style as object),
          marginRight: 0
        }}
        backgroundColor='transparent'
        size={26}
        underlayColor='lightgray'
        onPress={this.props.onPress}
        {...otherProps}
      />
    );
  }
}

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
  constructor(props) {
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
    }
  }

  handleLayout(event, propName) {
    const viewLayout = event.nativeEvent.layout;
    const labelStyle = {
      left: -viewLayout.height / 2 + viewLayout.width / 2,
      top: viewLayout.height / 2 - viewLayout.width / 2,
      width: viewLayout.height,
      height: viewLayout.width - 2,
      lineHeight: viewLayout.width - 2
    }
    if (propName === 'amountOnCards') {
      this.setState({
        amountOnCardsStyle: labelStyle
      })
    } else if (propName === 'onePointEach') {
      this.setState({
        onePointEachStyle: labelStyle
      })
    }
  }

  render() {
    const removePlayerDisabled = this.props.numPlayers === MIN_PLAYERS;
    const addPlayerDisabled = this.props.numPlayers === MAX_PLAYERS;
    return (
      <View style={{ flex: 9 }}>
        <LabelCell style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{
              paddingRight: 10,
              borderRightWidth: 1,
              borderColor: 'lightgray'
            }}>
              <IconButton
                name='repeat'
                style={{ color: 'black' }}
                onPress={this.props.onReset}
              />
            </View>
            <View style={{ marginLeft: 10 }}></View>
            <IconButton
              name='minus-circle'
              style={{ color: removePlayerDisabled ? 'gray' : 'red' }}
              onPress={this.props.onRemovePlayer}
              disabled={removePlayerDisabled}
            />
            <WSText style={{ margin: 5 }}>{this.props.numPlayers}P</WSText>
            <IconButton
              name='plus-circle'
              style={{ color: addPlayerDisabled ? 'gray' : 'green' }}
              onPress={this.props.onAddPlayer}
              disabled={addPlayerDisabled}
            />
          </View>
        </LabelCell>
        <View style={{
          flex: 3,
          flexDirection: 'row',
          borderTopWidth: 2
        }}>
          <View
            style={styles.subsectionLabelContainer}
            onLayout={(e) => this.handleLayout(e, 'amountOnCards')}
          >
            <WSText
              style={[this.state.amountOnCardsStyle,
              styles.verticalLabel,
              this.props.orientation === 'LANDSCAPE' ? { fontSize: 18 } : {}
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
          flexDirection: 'row'
        }}>
          <View
            style={styles.subsectionLabelContainer}
            onLayout={(e) => this.handleLayout(e, 'onePointEach')}
          >
            <WSText
              style={[this.state.onePointEachStyle,
              styles.verticalLabel,
              this.props.orientation === 'LANDSCAPE' ? { fontSize: 20 } : {}
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
          alignItems: 'center'
        }}>
          <WSText style={{
            textTransform: 'uppercase',
            fontFamily: 'cardenio-modern-bold'
          }}>Total</WSText>
        </LabelCell>
      </View>
    );
  }
}

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
            <TableCell style={{backgroundColor: 'gray'}}></TableCell>
            {this.renderScoreCell(1)}
          </View>
          <View style={{
            flex: 3
          }}>
            {this.renderScoreCell(2)}
            <TableCell style={{backgroundColor: 'gray'}}></TableCell>
            {this.renderScoreCell(3)}
          </View>
          <TableCell style={{
            borderBottomWidth: 0,
            borderTopWidth: 2,
            backgroundColor: total === this.props.maxScore ? "yellow" : "white"
          }}>
            <WSText>{total}</WSText>
          </TableCell>
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
          <TableCell style={{
            borderBottomWidth: 0,
            borderTopWidth: 2,
            backgroundColor: total === this.props.maxScore ? "yellow" : "white"
          }}>
            <WSText>{total}</WSText>
          </TableCell>
        </View>
      );
    }
  }
}

const MIN_PLAYERS = 1;
// const MAX_PLAYERS = 5;
const MAX_PLAYERS = 2;
const STARTING_PLAYERS = 2;
const ORIENTATION_BREAK_POINT = 5; // force to landscape at this player count
const SCREEN_PADDING_BOTTOM = 10;
const SCREEN_PADDING_TOP = 10;

interface AppState {
  numPlayers: number,
  isReady: boolean,
  scores: Array<Array<number>>,
  automaScores: Array<number>,
  maxScore: number,
  paddingBottom: number,
  orientation: string
}

export default class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      numPlayers: STARTING_PLAYERS,
      isReady: false,
      scores: this._initializeScores(STARTING_PLAYERS),
      automaScores: this._initializeAutomaScores(),
      maxScore: -1,
      paddingBottom: 0,
      orientation: 'PORTRAIT'
    }
  }

  _initializeScores(numPlayers) {
    return Array.from(Array(numPlayers), () => this._initializePlayerScores());
  }

  _initializeAutomaScores() {
    return Array(4).fill(0);
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
        const automaTotal: number = automaScores.reduce((a, b) => a + b);
        const playerTotal: number = this.state.scores[0].reduce((a, b) => a + b);
        const maxScore: number = Math.max(automaTotal, playerTotal);
        this.setState({
          automaScores: automaScores,
          maxScore: maxScore
        });
      } else {
        let scores = this.state.scores.slice();
        scores[playerNumber][i] = value;
        let maxScore: number = Math.max(...scores.map((playerScore) => playerScore.reduce((a, b) => a + b)));
        this.setState({
          scores: scores,
          maxScore: maxScore
        });
      }
    }
  }

  handleReset() {
    this.setState({
      scores: this._initializeScores(this.state.numPlayers),
      automaScores: this._initializeAutomaScores()
    });
  }

  handleAddPlayer() {
    const newNum = this.state.numPlayers + 1;
    if (newNum <= MAX_PLAYERS) {
      const scores = this.state.scores;
      scores.push(this._initializePlayerScores());
      if (newNum >= ORIENTATION_BREAK_POINT) {
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
    if (newNum >= MIN_PLAYERS) {
      if (newNum < ORIENTATION_BREAK_POINT) {
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
    let players = Array.from(Array(this.state.numPlayers).keys()).map((i) =>
      <PlayerScoreCard
        key={i}
        playerNumber={i}
        scores={this.state.scores[i]}
        maxScore={this.state.maxScore}
        onChangeText={(text, i, playerNumber) => this.handleChangeText(text, i, playerNumber)}
        orientation={this.state.orientation}
      />
    );
    if (this.state.numPlayers === 1) {
      players.push(<PlayerScoreCard
        key={1}
        playerNumber={-1}
        scores={this.state.automaScores}
        maxScore={this.state.maxScore}
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
              paddingTop: StatusBar.currentHeight + SCREEN_PADDING_TOP,
              paddingBottom: SCREEN_PADDING_BOTTOM + this.state.paddingBottom,
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
