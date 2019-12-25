import React, { SyntheticEvent } from 'react';
import { StyleSheet, Text, View, TextInput, TextInputChangeEventData, NativeSyntheticEvent } from 'react-native';
import { ScreenOrientation, AppLoading } from 'expo';
import * as Font from 'expo-font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultText: {
    fontSize: 20,
    fontFamily: 'cardenio-modern'
  }
});

interface DefaultProps {
  style?: object
}

class Container extends React.Component<DefaultProps> {
  render() {
    return <View style={[styles.container, this.props.style]}>{this.props.children}</View>
  }
}

class WSText extends React.Component<DefaultProps> {
  render() {
    return <Text style={[styles.defaultText, this.props.style]}>{this.props.children}</Text>
  }
}

interface WSTextInputProps {
  editable?: boolean,
  defaultValue?: string,
  value?: string,
  name?: string,
  onChangeText?(text: string): void
}

class WSTextInput extends React.Component<WSTextInputProps & DefaultProps> {
  render() {
    return <TextInput style={[styles.defaultText, this.props.style]} {...this.props} />
  }
}

export class ScoreLabelColumn extends React.Component {
  render() {
    return (
      <Container>
        <View style={{
          flex: 7,
          alignItems: 'flex-start'
        }}>
          <Container />
          <Container>
            <WSText>Birds</WSText>
          </Container>
          <Container>
            <WSText>Bonus cards</WSText>
          </Container>
          <Container>
            <WSText>End-of-round goals</WSText>
          </Container>
          <Container>
            <WSText>Eggs</WSText>
          </Container>
          <Container>
            <WSText>Food on cards</WSText>
          </Container>
          <Container>
            <WSText>Tucked cards</WSText>
          </Container>
        </View>
        <Container>
          <WSText style={{ textTransform: 'uppercase' }}>Total</WSText>
        </Container>
      </Container >
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
      <Container>
        <Container>
          <WSTextInput defaultValue={"Player " + this.props.number} />
        </Container>
        {
          this.state.subscores.map((_, i) => {
            return (
              <Container key={i}>
                <WSTextInput
                  onChangeText={(text) => this.handleChangeText(text, i)}
                  value={this.state.subscores[i].toString()}
                />
              </Container>
            );
          })
        }
        <Container>
          <WSTextInput
            editable={false}
            value={this.state.total.toString()}
          />
        </Container>
      </Container>
    );
  }
}

const NUMPLAYERS = 2;

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
      <Container style={{ flexDirection: 'row' }}>
        <ScoreLabelColumn />
        {Array.from(Array(NUMPLAYERS).keys()).map((i) =>
          <PlayerScoreCard key={i} number={i + 1} />
        )}
      </Container>
    );
  }
}

async function loadAssets() {
  await Promise.all([
    Font.loadAsync({
      'cardenio-modern': require('./assets/fonts/CardenioModern-Regular.otf')
    }),
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
  ]);
}
