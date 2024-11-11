import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Image, View } from 'react-native';
import Icon from './Icon';
import StyledText from '../styles/StyledText';
import { useUser } from '../store/user';
import { getTtubeotDetail } from '../utils/apis/users/userTtubeot';
import { EmptyProfile, profileColor } from './ProfileImageUrl';
import { TtubeotData } from '../types/ttubeotData';

const Profile = styled(View)`
  position: relative;
  height: 90px;
  display: 'flex';
  flex-direction: row;
`;

const ProfileImageContainer = styled(View)`
  position: absolute;
  top: 7px;
  left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background-color: #d4e6ad;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled(Image)`
  width: 38px;
  height: 38px;
`;

const ProfileDetails = styled(View)`
  background-color: #b1baaa;
  border-radius: 25px;
  padding-left: 15px;
  padding-right: 5px;
  flex-direction: column;
  justify-content: center;
  width: 220px;
  height: 97%;
`;

const ProfileTop = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  margin-left: 40px;
  margin-right: 10px;
  gap: 10px;
  position: relative;
`;

const ProfileName = styled(StyledText)`
  font-size: 18px;
  color: #fff;
`;

const RemainDays = styled(StyledText)`
  font-size: 16px;
  color: #fff;
  background-color: rgba(96, 92, 80, 0.5);
  border-radius: 15px;
  padding: 2px 8px;
`;

const ProfileBottom = styled(View)`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding-right: 4px;
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

const TtubeotProfile = () => {
  const { user, ttubeotId, setTtubeotId, accessToken, setAccessToken } =
    useUser.getState();
  const [loading, setIsLoading] = useState<boolean>(true);
  const [ttubeotData, setTtubeotData] = useState<TtubeotData>(null);

  useEffect(() => {
    const fetchUserTtubeot = async () => {
      const res = await getTtubeotDetail(
        user.userId,
        accessToken,
        setAccessToken,
      );

      if (res === null) {
        setTtubeotData(null);
        setTtubeotId(46);
      } else {
        setTtubeotData(res);
        setTtubeotId(res.ttubeot_type);
        setIsLoading(false);
      }
    };
    fetchUserTtubeot();
  }, [user.userId]);

  return (
    <Profile>
      {ttubeotData && ttubeotId && (
        <ShadowBox>
          <Shadow />
          <ProfileDetails>
            <ProfileTop>
              <ProfileName bold>{ttubeotData?.ttubeot_name}</ProfileName>
              <RemainDays bold>D-4</RemainDays>
            </ProfileTop>
            <ProfileBottom>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
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
              </View>
              <StyledText color="white" bold>
                {ttubeotData?.ttubeot_score} 걸음
              </StyledText>
            </ProfileBottom>
          </ProfileDetails>
          <ProfileImageContainer>
            {!loading && <ProfileImage source={profileColor[ttubeotId]} />}
          </ProfileImageContainer>
        </ShadowBox>
      )}
    </Profile>
  );
};

export default TtubeotProfile;
