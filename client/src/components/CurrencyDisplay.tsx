import React from 'react';
import { View, Image } from 'react-native';
import styled from 'styled-components';
import StyledText from '../styles/StyledText';

const coinIcon = require('../assets/icons/coinIcon.png');

const CurrencyDisplayContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 30px;
`;

const CurrencyBackground = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f4f3e6;
  height: 30px;
  border-radius: 20px;
  opacity: 1;
`;

const CurrencyShadow = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-color: #c5c1b6;
  border-width: 4px;
  width: 80px;
  height: 33px;
  border-radius: 20px;
  opacity: 0.5;
`;

const IconContainer = styled(View)`
  position: absolute;
  left: -25px;
`;

const CurrencyContainer = styled(View)`
  border-radius: 20px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 5px;
  padding-right: 8px;
`;

const CurrencyDisplay = () => {
  return (
    <CurrencyDisplayContainer>
      <CurrencyShadow />
      <CurrencyBackground />
      <CurrencyContainer>
        <StyledText bold style={{ fontSize: 16 }}>
          99,999
        </StyledText>
      </CurrencyContainer>
      <IconContainer>
        <Image source={coinIcon} style={{ width: 40, height: 40 }} />
      </IconContainer>
    </CurrencyDisplayContainer>
  );
};

export default CurrencyDisplay;
