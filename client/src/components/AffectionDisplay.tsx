import React from 'react';
import { View, Image } from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import StyledText from '../styles/StyledText';

const heartIcon = require('../assets/icons/heart.png');

const AffectionDisplayContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;

const AffectionBackground = styled(View)`
  background-color: #f4f3e6;
  height: 33px;
  width: 94px;
  border-radius: 30px;
  justify-content: center;
  overflow: hidden;
`;

const AffectionFill = styled(LinearGradient)<{ width: number }>`
  height: 90%;
  width: ${props => props.width}%;
  border-radius: 30px;
  position: absolute;
  left: 1px;
`;

const IconContainer = styled(View)`
  position: absolute;
  left: -14px;
  z-index: 1;
`;

interface AffectionDisplayProps {
  affectionPoints: number;
}

const AffectionDisplay = ({ affectionPoints }: AffectionDisplayProps) => {
  return (
    <AffectionDisplayContainer>
      <IconContainer>
        <Image source={heartIcon} style={{ width: 26, height: 26 }} />
      </IconContainer>
      <AffectionBackground>
        <AffectionFill
          width={affectionPoints}
          colors={['#FFE4B7', '#ffc466']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
        <StyledText
          bold
          style={{
            fontSize: 14,
            marginLeft: 4,
            textAlign: 'center',
            color: 'black',
          }}>
          {affectionPoints}%
        </StyledText>
      </AffectionBackground>
    </AffectionDisplayContainer>
  );
};

export default AffectionDisplay;
