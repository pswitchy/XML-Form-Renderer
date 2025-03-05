import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const DrawingField = ({ label }) => {
  const [paths, setPaths] = React.useState([]);
  const [currentPath, setCurrentPath] = React.useState('');

  const onGestureEvent = (event) => {
    const { x, y } = event.nativeEvent;
    
    if (!currentPath) {
      setCurrentPath(`M ${x} ${y}`);
    } else {
      setCurrentPath(prevPath => `${prevPath} L ${x} ${y}`);
    }
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (currentPath) {
        setPaths(prevPaths => [...prevPaths, currentPath]);
        setCurrentPath('');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.canvasContainer}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <View style={styles.canvas}>
            <Svg style={StyleSheet.absoluteFill}>
              {paths.map((d, index) => (
                <Path
                  key={index}
                  d={d}
                  stroke="black"
                  strokeWidth={2}
                  fill="none"
                />
              ))}
              {currentPath ? (
                <Path
                  d={currentPath}
                  stroke="black"
                  strokeWidth={2}
                  fill="none"
                />
              ) : null}
            </Svg>
          </View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#000',
  },
  canvasContainer: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  canvas: {
    width: 315,
    height: 135,
  },
});

export default DrawingField;