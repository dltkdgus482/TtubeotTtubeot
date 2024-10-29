import React from 'react';
import { View, Image } from 'react-native';
import styled from 'styled-components';
import StyledText from '../styles/StyledText';

const coinIcon = require('../assets/icons/coinIcon.png');

const CurrencyDisplayContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CurrencyBackground = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-radius: 5px;
  opacity: 0.5;
`;

const IconContainer = styled(View)`
  position: absolute;
  left: -25px;
`;

const CurrencyContainer = styled(View)`
  border-radius: 5px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 5px;
`;

const CurrencyDisplay = () => {
  return (
    <CurrencyDisplayContainer>
      <CurrencyBackground />
      <CurrencyContainer>
        <StyledText bold style={{ fontSize: 16 }}>
          1,250
        </StyledText>
      </CurrencyContainer>
      <IconContainer>
        <Image source={coinIcon} style={{ width: 40, height: 40 }} />
      </IconContainer>
    </CurrencyDisplayContainer>
  );
};

export default CurrencyDisplay;
