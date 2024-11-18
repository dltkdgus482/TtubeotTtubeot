import React from 'react';
import styled from 'styled-components/native';
import { Image, ImageSourcePropType, View } from 'react-native';
import StyledText from '../../styles/StyledText';
import LinearGradient from 'react-native-linear-gradient';

const DefaultButton = styled(View)<{ height: number; width: number }>`
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: ${({ borderRadius }) => `${borderRadius}px`};
  width: 100%;
  height: 100%;
`;

const IconContainer = styled(View)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type ButtonDefaultProps = {
  content: string;
  iconSource?: ImageSourcePropType;
  height?: number;
  width?: number;
  borderRadius?: number;
  fontSize?: number;
};

const ButtonDefault = ({
  content,
  iconSource,
  height = 40,
  width = 100,
  borderRadius = 25,
  fontSize = 16,
}: ButtonDefaultProps) => {
  return (
    <DefaultButton height={height} width={width}>
      <ButtonContainer borderRadius={borderRadius}>
        <GradientContainer
          colors={['#F9FBDD', '#ECCFAE']}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          borderRadius={borderRadius}>
          {iconSource && (
            <IconContainer>
              <Image
                source={iconSource}
                style={{ height: '80%', aspectRatio: 1 }}
                resizeMode="contain"
              />
            </IconContainer>
          )}
          <StyledText bold style={{ fontSize: fontSize }}>
            {content}
          </StyledText>
        </GradientContainer>
      </ButtonContainer>
    </DefaultButton>
  );
};

export default ButtonDefault;
