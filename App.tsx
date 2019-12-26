import React from 'react';
import { StyleSheet, Text, View, TextInput, TextInputProps, StyleProp, TextStyle, ViewProps, ViewStyle, TextProps, KeyboardAvoidingView, StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

const styles = StyleSheet.create({
  tableCell: {
    flex: 1,
    padding: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelCell: {
    borderLeftWidth: 0,
    alignItems: 'flex-start'
  },
  defaultText: {
    fontSize: 24,
    fontFamily: 'cardenio-modern'
  },
  defaultTextInput: {
    textAlign: 'center'
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
    return (
      <TextInput
        style={[styles.defaultText, styles.defaultTextInput, this.props.style] as StyleProp<TextStyle>}
        {...this.props}
      />
    );
  }
}

export class ScoreLabelColumn extends React.Component {
  state = {
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

  handleLayout(event, propName) {
    const viewLayout = event.nativeEvent.layout;
    const labelStyle = {
      left: -viewLayout.height / 2 + viewLayout.width / 2,
      top: viewLayout.height / 2 - viewLayout.width / 2,
      width: viewLayout.height,
      height: viewLayout.width - 2,
      lineHeight: viewLayout.width - 2
    }
    this.setState({
      [propName + 'Style']: labelStyle
    });
  }

  render() {
    return (
      <View style={{ flex: 9 }}>
        <LabelCell />
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
              style={[this.state.amountOnCardsStyle, styles.verticalLabel] as StyleProp<TextStyle>}
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
              style={[this.state.onePointEachStyle, styles.verticalLabel] as StyleProp<TextStyle>}
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
  playerNumber: number
}

interface PlayerScoreCardState {
  subscores: Array<number>,
  total: number
}

class PlayerScoreCard extends React.Component<PlayerScoreCardProps, PlayerScoreCardState> {
  constructor(props) {
    super(props);
    this.state = {
      subscores: Array(6).fill(0),
      total: 0
    }
  }

  handleChangeText(text: string, i: number) {
    const value = Number(text);
    if (!isNaN(value)) {
      let subscores = this.state.subscores.slice();
      subscores[i] = value;
      this.setState({
        subscores: subscores,
        total: subscores.reduce((a, b) => a + b)
      });
    }
  }

  renderScoreCell(i: number) {
    return (
      <TableCell key={i}>
        <ScoreCell
          onChangeText={(text) => this.handleChangeText(text, i)}
          value={this.state.subscores[i].toString()}
        />
      </TableCell>
    );
  }

  render() {
    return (
      <View style={{ flex: 4 }}>
        <TableCell>
          <WSTextInput defaultValue={"Player " + this.props.playerNumber} />
        </TableCell>
        <View style={{
          flex: 3,
          borderTopWidth: 2
        }}>
          {this.state.subscores.slice(0, 3).map((_, i) => this.renderScoreCell(i))}
        </View>
        <View style={{ flex: 3 }}>
          {this.state.subscores.slice(3).map((_, i) => this.renderScoreCell(i))}
        </View>
        <TableCell style={{
          borderBottomWidth: 0,
          borderTopWidth: 2
        }}>
          <WSTextInput
            editable={false}
            value={this.state.total.toString()}
          />
        </TableCell>
      </View>
    );
  }
}

const NUMPLAYERS = 2;
const SCREEN_PADDING_BOTTOM = 10;
const SCREEN_PADDING_TOP = 10;

export default class App extends React.Component {
  state = {
    isReady: false
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={loadAssets}
          onError={console.warn}
          onFinish={() => this.setState({ isReady: true })}
        />
      );
    }
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: 'row',
          marginTop: StatusBar.currentHeight + SCREEN_PADDING_TOP,
          marginBottom: SCREEN_PADDING_BOTTOM
        }}
        behavior='padding'
      >
        <ScoreLabelColumn />
        {Array.from(Array(NUMPLAYERS).keys()).map((i) =>
          <PlayerScoreCard key={i} playerNumber={i + 1} />
        )}
      </KeyboardAvoidingView>
    );
  }
}

function loadAssets() {
  return Font.loadAsync({
    'cardenio-modern': require('./assets/fonts/CardenioModern-Regular.otf'),
    'cardenio-modern-bold': require('./assets/fonts/CardenioModern-Bold.otf')
  });
}
