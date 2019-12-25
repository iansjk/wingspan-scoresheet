import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

async function loadAssets() {
  await Promise.all([
    Font.loadAsync({
      'cardenio-modern': require('./assets/fonts/CardenioModern-Regular.otf')
    }),
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
  ]);
}

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
      <View style={styles.container}>
        <Text style={styles.defaultText}>Lorem ipsum dolor Wingspan amet...</Text>
      </View>
    );
  }
}
