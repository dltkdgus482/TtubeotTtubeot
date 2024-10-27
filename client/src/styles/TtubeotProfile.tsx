import React from 'react';
import styled from 'styled-components/native';
import {Image, Text, View} from 'react-native';
import Icon from '../components/Icon';

const ProfileImageContainer = styled.View`
  position: absolute;
  right: 0;
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
  position: absolute;
  left: -15px;
  background-color: #b1baaa;
  border-radius: 20px;
  padding-top: 10px;
  padding-left: 15px;
  padding-bottom: 15px;
  flex-direction: column;
  width: 200px;
`;

const ProfileName = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 7px;
  margin-left: 5px;
`;

const ProfileInfo = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
`;

const TtubeotProfile = () => {
  return (
    <>
      <ProfileDetails>
        <ProfileName>우리마루</ProfileName>
        <ProfileInfo>
          <View
            style={{
              backgroundColor: '#605C50',
              opacity: 0.5,
              padding: 3,
              borderRadius: 5,
            }}>
            <Icon type="FontAwesome5" name="paw" size={12} color="#000" />
          </View>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            함께한 거리 55,000 걸음
          </Text>
        </ProfileInfo>
      </ProfileDetails>
      <ProfileImageContainer>
        <ProfileImage source={require('../assets/ttubeot/mockTtu.png')} />
      </ProfileImageContainer>
    </>
  );
};

export default TtubeotProfile;
