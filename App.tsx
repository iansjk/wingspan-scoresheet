import { FontAwesome } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Keyboard, StatusBar, StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextProps, TextStyle, TouchableHighlightProps, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, View, ViewProps, ViewStyle, KeyboardAvoidingView, Platform, Modal, Switch, TouchableHighlight } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  placeText: {
    fontSize: 10
  },
  pointText: {
    fontSize: 24
  },
  switchbar: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  cell: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'black'
  },
  column: {
    flex: 1,
    height: '80%',
    margin: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black'
  },
  columns: {
    flex: 9,
    flexDirection: 'row-reverse'
  },
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
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
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

const mostModePoints: number[][] = [
  [4, 1, 0, 0],
  [5, 2, 1, 0],
  [6, 3, 2, 0],
  [7, 4, 3, 0]
];
const eachModePoints: number[][] = Array(4).fill(
  Array(6).fill(5).map((a, b) => a - b)
); // [5, 4, 3, 2, 1, 0], 4 times

const mostModeGradientColors = ['#64A03E', '#D9DDC7'];
const eachModeGradientColors = ['#79BBC6', '#ECFFF8'];

interface PointTextProps {
  value: number
}

const PointText: React.StatelessComponent<PointTextProps> = (props) => {
  return (
    <View style={{
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center'
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
}

interface EndOfRoundGoalsModalProps {
  visible: boolean
}

const EndOfRoundGoalsModal: React.StatelessComponent<EndOfRoundGoalsModalProps> = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [goalsMode, setGoalsMode] = useState("most");
  const trackColor = {false: mostModeGradientColors[0], true: eachModeGradientColors[0]}
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
                    position: 'absolute',
                    top: '-10%'
                  }}>
                    Round {roundIndex + 1}
                  </Text>
                  <LinearGradient
                    colors={gradientColors}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      height: '100%',
                    }}
                  />
                  {
                    column.map((cell, placeIndex) => {
                      return (
                        <TouchableHighlight
                          style={styles.cell}
                          underlayColor={'rgba(0,0,0,0.3)'}
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
                      )
                    })
                  }
                </View>
              )
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
  paddingBottom: number,
  orientation: string,
  endOfRoundGoalsModalVisible: boolean
}

export default class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      numPlayers: STARTING_PLAYERS,
      isReady: false,
      scores: this._initializeScores(STARTING_PLAYERS),
      automaScores: this._initializeAutomaScores(),
      paddingBottom: 0,
      orientation: 'PORTRAIT',
      endOfRoundGoalsModalVisible: true
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
    const scores: number[][] = (this.state.numPlayers === 1) ? new Array(this.state.scores[0], this.state.automaScores) : this.state.scores;
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
