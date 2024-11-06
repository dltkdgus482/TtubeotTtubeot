import React, { useEffect, useState } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Button,
  Text,
  View,
  PermissionsAndroid,
} from 'react-native';

const { RnSensorStep } = NativeModules;
const stepCounterEmitter = new NativeEventEmitter(RnSensorStep);

const StepCounter = () => {
  const [steps, setSteps] = useState<number>(0);
  const [initialSteps, setInitialSteps] = useState<number | null>(null);

  useEffect(() => {
    const stepListener = stepCounterEmitter.addListener(
      'StepCounter',
      event => {
        if (initialSteps === null) {
          setInitialSteps(event.steps);
        } else {
          setSteps(event.steps - initialSteps);
        }
      },
    );

    return () => {
      stepListener.remove();
    };
  }, [initialSteps]);

  const startStepCounter = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission denied');
      return;
    }

    setSteps(0);
    setInitialSteps(null);
    RnSensorStep.start(500, 'COUNTER');
  };

  const stopStepCounter = () => {
    RnSensorStep.stop();
    setSteps(0);
    setInitialSteps(null);
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
