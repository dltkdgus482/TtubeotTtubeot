import React from 'react';
import styled from 'styled-components/native';
import { Image, View } from 'react-native';
import Icon from './Icon';
import StyledText from '../styles/StyledText';

const Profile = styled(View)`
  position: relative;
  height: 80px;
  display: 'flex';
  flex-direction: row;
`;

const ProfileImageContainer = styled(View)`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  background-color: #b1baaa;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled(Image)`
  width: 65px;
  height: 65px;
`;

const ProfileDetails = styled(View)`
  background-color: #b1baaa;
  border-radius: 25px;
  padding-left: 15px;
  padding-right: 5px;
  flex-direction: column;
  justify-content: center;
  width: 215px;
  height: 97%;
`;

const ProfileTop = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
  position: relative;
`;

const ProfileName = styled(StyledText)`
  font-size: 18px;
  color: #fff;
`;

const RemainDays = styled(StyledText)`
  font-size: 16px;
  color: #fff;
  position: absolute;
  top: 2px;
  right: 10px;
  background-color: rgba(96, 92, 80, 0.5);
  border-radius: 15px;
  padding: 2px 8px;
`;

const ProfileBottom = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  position: relative;
`;

const WalkWith = styled(StyledText)`
  position: absolute;
  right: 5px;
  color: #fff;
`;

const ShadowBox = styled(View)`
  position: relative;
`;

const Shadow = styled(View)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-color: rgba(0, 0, 0, 0.45);
  border-width: 3px;
  border-radius: 25px;
`;

const ImageShadowBox = styled(View)`
  position: relative;
  left: -280px;
  width: 80px;
  height: 80px;
`;

const ImageShadow = styled(View)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 82.5px;
  border-bottom-width: 12px;
  border-left-width: 13px;
  border-color: rgba(0, 0, 0, 0.45);
  border-radius: 50px;
`;

const TtubeotProfile = () => {
  return (
    <Profile>
      <ShadowBox>
        <Shadow />
        <ProfileDetails>
          <ProfileTop>
            <ProfileName bold>우리마루</ProfileName>
            <RemainDays bold>D-4</RemainDays>
          </ProfileTop>
          <ProfileBottom>
            <StyledText bold style={{ color: 'white' }}>
              함께한 거리
            </StyledText>
            <View
              style={{
                backgroundColor: '#605C50',
                opacity: 0.5,
                padding: 3,
                borderRadius: 5,
              }}>
              <Icon type="FontAwesome5" name="paw" size={12} color="#000" />
            </View>
            <WalkWith bold>55,000 걸음</WalkWith>
          </ProfileBottom>
        </ProfileDetails>
      </ShadowBox>
      <ImageShadowBox>
        <ImageShadow />
        <ProfileImageContainer>
          <ProfileImage source={require('../assets/ttubeot/mockTtu.png')} />
        </ProfileImageContainer>
      </ImageShadowBox>
    </Profile>
  );
};

export default TtubeotProfile;
