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

  const startStepCounter = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission denied');
      return;
    }

    stepCounterEmitter.addListener('StepCounter', event => {
      if (initialSteps === null) {
        // 최초 이벤트에서 초기 걸음 수를 설정
        setInitialSteps(event.steps);
      } else {
        // 초기 걸음 수를 설정한 이후에는 차이를 계산
        setSteps(event.steps - initialSteps);
      }
    });

    setTimeout(() => {
      RnSensorStep.start(500, 'COUNTER');
    }, 1000);
  };

  const stopStepCounter = () => {
    RnSensorStep.stop();
    stepCounterEmitter.removeAllListeners('StepCounter');
    setSteps(0);
    setInitialSteps(null); // 초기화 시 초기 걸음 수도 리셋
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
