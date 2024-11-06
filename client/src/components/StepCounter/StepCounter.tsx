import React, { useEffect, useState } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Button,
  Text,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';

const { RnSensorStep } = NativeModules;
const stepCounterEmitter = new NativeEventEmitter(RnSensorStep);

const StepCounter = () => {
  const [steps, setSteps] = useState<number>(0);
  const [initialSteps, setInitialSteps] = useState<number>(0);

  const startStepCounter = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission denied');
      return;
    }

    RnSensorStep.start(500, 'COUNTER');
    stepCounterEmitter.addListener('StepCounter', event => {
      if (initialSteps === 0) {
        setInitialSteps(event.steps);
      } else {
        setSteps(event.steps - initialSteps);
      }
    });
  };

  const stopStepCounter = () => {
    RnSensorStep.stop();
    stepCounterEmitter.removeAllListeners('StepCounter');
    setSteps(0);
    setInitialSteps(0);
  };

  return (
    <View>
      <Text>Steps: {steps}</Text>
      <Button title="Start Counting" onPress={startStepCounter} />
      <Button title="Stop Counting" onPress={stopStepCounter} />
    </View>
  );
};

export default StepCounter;
