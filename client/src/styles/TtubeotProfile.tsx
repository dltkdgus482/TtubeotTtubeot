import React from 'react';
import styled from 'styled-components/native';
import {Image, View} from 'react-native';
import Icon from '../components/Icon';
import StyledText from './StyledText';

const Profile = styled.View`
  position: relative;
  height: 80px;
  display: 'flex';
  flex-direction: row;
`;

const ProfileImageContainer = styled.View`
  position: absolute;
  left: -65px;
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

const ProfileDetails = styled.View`
  background-color: #b1baaa;
  border-radius: 25px;
  padding-left: 15px;
  padding-right: 5px;
  flex-direction: column;
  justify-content: center;
  width: 215px;
`;

const ProfileTop = styled.View`
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

const TtubeotProfile = () => {
  return (
    <Profile>
      <ProfileDetails>
        <ProfileTop>
          <ProfileName bold>우리마루</ProfileName>
          <RemainDays bold>D-4</RemainDays>
        </ProfileTop>
        <ProfileBottom>
          <StyledText bold style={{color: 'white'}}>
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
      <ProfileImageContainer>
        <ProfileImage source={require('../assets/ttubeot/mockTtu.png')} />
      </ProfileImageContainer>
    </Profile>
  );
};

export default TtubeotProfile;
