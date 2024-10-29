import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import StyledText from '../../styles/StyledText';
import LinearGradient from 'react-native-linear-gradient';

const FlatButton = styled(View)<{ height: number; width: number }>`
  position: relative;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
`;

const ButtonContainer = styled(View)<{ borderRadius: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: ${({ borderRadius }) => `${borderRadius}px`};
  background-color: #4c669f;
`;

const GradientContainer = styled(LinearGradient)<{ borderRadius: number }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: ${({ borderRadius }) => `${borderRadius}px`};
  width: 100%;
  height: 100%;
`;

type ButtonDefaultProps = {
  content: string;
  height?: number;
  width?: number;
  borderRadius?: number;
};

const ButtonFlat = ({
  content,
  height = 40,
  width = 100,
  borderRadius = 25,
}: ButtonDefaultProps) => {
  return (
    <FlatButton height={height} width={width}>
      <ButtonContainer borderRadius={borderRadius}>
        <GradientContainer
          colors={['#F9FBDD', '#ECCFAE']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          borderRadius={borderRadius}>
          <StyledText bold>{content}</StyledText>
        </GradientContainer>
      </ButtonContainer>
    </FlatButton>
  );
};

export default ButtonFlat;
