import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import StyledText from '../../styles/StyledText';

const DefaultButton = styled(View)<{ height?: number; width?: number }>`
  position: relative;
  height: ${({ height }) => (height ? `${height}px` : '40px')};
  width: ${({ width }) => (width ? `${width}px` : '100px')};
`;

const ButtonShadowBox = styled(View)`
  position: relative;
  height: 100%;
  width: 100%;
`;

const ButtonShadow = styled(View)<{ borderRadius?: number }>`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-color: rgba(210, 183, 164, 0.75);
  border-width: 4px;
  border-radius: 12px;
`;

const ButtonContainer = styled(View)<{
  height?: number;
  color?: string;
  borderRadius?: number;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${({ height }) => (height ? `${height - 2}px` : '38px')};
  background-color: ${({ color }) => (color ? `${color}` : '#fbfaf5')};
  border-radius: ${({ borderRadius }) => `${borderRadius}px`};
`;

type ButtonDefaultProps = {
  content: string;
  height?: number;
  width?: number;
  color?: string;
  borderRadius?: number;
  shadowDisplay?: boolean;
};

const ButtonDefault = ({
  content,
  height,
  width,
  color,
  borderRadius = 12,
  shadowDisplay = true,
}: ButtonDefaultProps) => {
  return (
    <DefaultButton height={height} width={width}>
      <ButtonShadowBox>
        {shadowDisplay && <ButtonShadow borderRadius={borderRadius} />}
        <ButtonContainer
          height={height}
          color={color}
          borderRadius={borderRadius}>
          <StyledText>{content}</StyledText>
        </ButtonContainer>
      </ButtonShadowBox>
    </DefaultButton>
  );
};

export default ButtonDefault;
