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
    fontSize: 20,
    fontFamily: 'cardenio-modern'
  },
  defaultTextInput: {
    textAlign: 'center'
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
  render() {
    return (
      <View style={{ flex: 1 }}>
        <LabelCell />
        <LabelCell>
          <WSText>Birds</WSText>
        </LabelCell>
        <LabelCell>
          <WSText>Bonus cards</WSText>
        </LabelCell>
        <LabelCell>
          <WSText>End-of-round goals</WSText>
        </LabelCell>
        <LabelCell>
          <WSText>Eggs</WSText>
        </LabelCell>
        <LabelCell>
          <WSText>Food on cards</WSText>
        </LabelCell>
        <LabelCell>
          <WSText>Tucked cards</WSText>
        </LabelCell>
        <LabelCell style={{
          borderBottomWidth: 0,
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
        onFocus={(e) => console.log(e)}
        keyboardType="numeric"
        {...this.props}
      />
    );
  }
}

interface PlayerScoreCardProps {
  number: number
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

  render() {
    return (
      <View style={{flex: 1}}>
        <TableCell>
          <WSTextInput defaultValue={"Player " + this.props.number} />
        </TableCell>
        {
          this.state.subscores.map((_, i) => {
            return (
              <TableCell key={i}>
                <ScoreCell
                  onChangeText={(text) => this.handleChangeText(text, i)}
                  value={this.state.subscores[i].toString()}
                />
              </TableCell>
            );
          })
        }
        <TableCell style={{
          borderBottomWidth: 0
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
const SCREEN_PADDING = 10;

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
          marginTop: StatusBar.currentHeight + SCREEN_PADDING,
          margin: SCREEN_PADDING
        }}
        behavior='padding'
      >
        <ScoreLabelColumn />
        {Array.from(Array(NUMPLAYERS).keys()).map((i) =>
          <PlayerScoreCard key={i} number={i + 1} />
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
