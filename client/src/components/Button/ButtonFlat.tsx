import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import StyledText from '../../styles/StyledText';

const FlatButton = styled(View)<{ height: number; width: number }>`
  position: relative;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
`;

const ButtonShadowBox = styled(View)`
  position: relative;
  height: 100%;
  width: 100%;
`;

const ButtonShadow = styled(View)<{ borderRadius: number }>`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-color: rgba(210, 183, 164, 0.75);
  border-width: 4px;
  border-radius: ${({ borderRadius }) => `${borderRadius}px`};
`;

const ButtonContainer = styled(View)<{
  height: number;
  color?: string;
  borderRadius?: number;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${({ height }) => `${height - 2.5}px`};
  background-color: ${({ color }) => (color ? `${color}` : '#fbfaf5')};
  border-radius: ${({ borderRadius }) => `${borderRadius}px`};
`;

type ButtonFlatProps = {
  content: string;
  color?: string;
  height?: number;
  width?: number;
  borderRadius?: number;
  shadowDisplay?: boolean;
  fontSize?: number;
  fontColor?: string;
};

const ButtonFlat = ({
  content,
  color,
  height = 40,
  width = 100,
  borderRadius = 12,
  shadowDisplay = true,
  fontSize = 16,
  fontColor = 'black',
}: ButtonFlatProps) => {
  return (
    <FlatButton height={height} width={width}>
      <ButtonShadowBox>
        {shadowDisplay && <ButtonShadow borderRadius={borderRadius} />}
        <ButtonContainer
          height={height}
          color={color}
          borderRadius={borderRadius}>
          <StyledText bold style={{ fontSize: fontSize, color: fontColor }}>
            {content}
          </StyledText>
        </ButtonContainer>
      </ButtonShadowBox>
    </FlatButton>
  );
};

export default ButtonFlat;
