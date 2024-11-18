import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Animated, Easing, TouchableOpacity } from 'react-native';

const ToggleContainer = styled(TouchableOpacity)<{ isOn: boolean }>`
  width: 50px;
  height: 30px;
  border-radius: 100px;
  justify-content: center;
  background-color: ${({ isOn }) => (isOn ? '#96be92' : '#D8D8D8')};
  padding: 2px;
`;

const ToggleWheel = styled(Animated.View)`
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 99px;
`;

type Props = {
  onToggle: () => void;
  isOn: boolean;
};

const Toggle = ({ onToggle, isOn }: Props) => {
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 27],
  });

  return (
    <ToggleContainer onPress={onToggle} isOn={isOn}>
      <ToggleWheel
        style={{
          transform: [{ translateX }],
        }}
      />
    </ToggleContainer>
  );
};

export default Toggle;
