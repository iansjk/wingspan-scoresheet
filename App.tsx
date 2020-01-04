import { FontAwesome } from '@expo/vector-icons';
import { AppLoading, ScreenOrientation } from 'expo';
import * as Font from 'expo-font';
import { OrientationChangeEvent } from 'expo/build/ScreenOrientation/ScreenOrientation';
import React from 'react';
import { Keyboard, StatusBar, StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextProps, TextStyle, TouchableHighlightProps, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, View, ViewProps, ViewStyle, Dimensions } from 'react-native';

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
  defaultText: {
    fontSize: 24,
    fontFamily: 'cardenio-modern'
  },
  defaultTextInput: {
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

class TableCell extends React.Component<ViewProps> {
  render() {
    return <View style={[styles.tableCell, this.props.style] as StyleProp<ViewStyle>}>{this.props.children}</View>
  }
}

class LabelCell extends React.Component<ViewProps> {
  render() {
    return <View style={[styles.tableCell, styles.labelCell, this.props.style] as StyleProp<ViewStyle>}>{this.props.children}</View>
  }
}

class WSText extends React.Component<TextProps> {
  render() {
    return <Text style={[styles.defaultText, this.props.style] as StyleProp<TextStyle>}>{this.props.children}</Text>
  }
}

class WSTextInput extends React.Component<TextInputProps> {
  render() {
    const { style, ...otherProps } = this.props;
    return (
      <TextInput
        style={[styles.defaultText, styles.defaultTextInput, style] as StyleProp<TextStyle>}
        selectTextOnFocus={true}
        {...otherProps}
      />
    );
  }
}

interface IconButtonProps {
  name: string
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
  isKeyboardVisible: boolean
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
      },
      isKeyboardVisible: false
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

class ScoreCell extends React.Component<TextInputProps> {
  render() {
    return (
      <WSTextInput
        keyboardType="numeric"
        {...this.props}
      />
    );
  }
}

interface PlayerScoreCardProps {
  playerNumber: number,
  scores: Array<number>,
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
        <ScoreCell
          onChangeText={(text) => this.props.onChangeText(text, i, this.props.playerNumber)}
          value={this.props.scores[i].toString()}
          placeholder={'0'}
        />
      </TableCell>
    );
  }

  render() {
    const total = this.props.scores.reduce((a, b) => a + b);
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
          borderTopWidth: 2
        }}>
          <WSTextInput
            style={{
              backgroundColor: 'transparent',
              borderBottomWidth: 0
            }}
            editable={false}
            value={total.toString()}
          />
        </TableCell>
      </View>
    );
  }
}

const MIN_PLAYERS = 1;
const MAX_PLAYERS = 5;
const STARTING_PLAYERS = 2;
const ORIENTATION_BREAK_POINT = 3; // force to landscape at this player count
const SCREEN_PADDING_BOTTOM = 10;
const SCREEN_PADDING_TOP = 10;

interface AppState {
  numPlayers: number,
  isReady: boolean,
  scores: Array<Array<number>>,
  width: number,
  height: number,
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
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      paddingBottom: 0,
      orientation: 'PORTRAIT'
    }
  }

  _initializeScores(numPlayers) {
    return Array.from(Array(numPlayers), () => this._initializePlayerScores());
  }

  _initializePlayerScores() {
    return Array(6).fill(0);
  }

  handleKeyboardDidShow(e) {
    if (this.state.orientation === 'PORTRAIT') {
      this.setState({
        paddingBottom: e.endCoordinates.height
      });
    }
  }

  handleKeyboardDidHide(e) {
    if (this.state.orientation === 'PORTRAIT') {
      this.setState({
        paddingBottom: 0
      });
    }
  }

  handleChangeText(text: string, i: number, playerNumber: number) {
    const value = Number(text);
    if (!isNaN(value)) {
      let scores = this.state.scores.slice();
      scores[playerNumber][i] = value;
      this.setState({
        scores: scores
      });
    }
  }

  handleReset() {
    this.setState({
      scores: this._initializeScores(this.state.numPlayers)
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
    // TODO handle Automa at 1P
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

  handleOrientationChange(e: OrientationChangeEvent) {
    this.setState({
      orientation: e.orientationLock,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    });
  }

  async loadAssets() {
    await Promise.all([
      Font.loadAsync({
        'cardenio-modern': require('./assets/fonts/CardenioModern-Regular.otf'),
        'cardenio-modern-bold': require('./assets/fonts/CardenioModern-Bold.otf')
      }),
      ScreenOrientation.addOrientationChangeListener((e) => this.handleOrientationChange(e)),
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT),
      Keyboard.addListener('keyboardDidShow', (e) => this.handleKeyboardDidShow(e)),
      Keyboard.addListener('keyboardDidHide', (e) => this.handleKeyboardDidHide(e))
    ]);
  }

  renderPlayers() {
    let players = Array.from(Array(this.state.numPlayers).keys()).map((i) =>
      <PlayerScoreCard
        key={i}
        playerNumber={i}
        scores={this.state.scores[i]}
        onChangeText={(text, i, playerNumber) => this.handleChangeText(text, i, playerNumber)}
        orientation={this.state.orientation}
      />
    );
    /* 
    TODO Automa

    if (this.state.numPlayers === 1) {
      players.push(<PlayerScoreCard 
        key={1}
        playerNumber={-1}
        scores={this.state.automaScores} 
        onChangeText={(text, i) => this.handleChangeText(text, i, -1)
        orientation={this.state.orientation}
      />);
    }*/
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
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: this.state.width,
            height: this.state.height,
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
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
