import React from 'react';
import styled from 'styled-components/native';
import {Image, Text, View} from 'react-native';
import Icon from '../components/Icon';

const Profile = styled.View`
  position: relative;
  width: 275px;
  height: 85px;
  display: 'flex';
  flex-direction: row;
`;

const ProfileImageContainer = styled.View`
  position: absolute;
  left: -75px;
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
  border-radius: 20px;
  padding-left: 15px;
  flex-direction: column;
  justify-content: center;
  width: 200px;
`;

const ProfileTop = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  margin-left: 5px;
  position: relative;
`;

const ProfileName = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
`;

const RemainDays = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  position: absolute;
  top: 2px;
  right: 20px;
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

const WalkWith = styled(Text)`
  position: absolute;
  bottom: 2px;
  right: 10px;
  font-weight: bold;
  color: #fff;
`;

const TtubeotProfile = () => {
  return (
    <Profile>
      <ProfileImageContainer>
        <ProfileImage source={require('../assets/ttubeot/mockTtu.png')} />
      </ProfileImageContainer>
      <ProfileDetails>
        <ProfileTop>
          <ProfileName>우리마루</ProfileName>
          <RemainDays>D-4</RemainDays>
        </ProfileTop>
        <ProfileBottom>
          <Text style={{color: 'white', fontWeight: 'bold'}}>함께한 거리</Text>
          <View
            style={{
              backgroundColor: '#605C50',
              opacity: 0.5,
              padding: 3,
              borderRadius: 5,
            }}>
            <Icon type="FontAwesome5" name="paw" size={12} color="#000" />
          </View>
          <WalkWith>55,000 걸음</WalkWith>
        </ProfileBottom>
      </ProfileDetails>
    </Profile>
  );
};

export default TtubeotProfile;
