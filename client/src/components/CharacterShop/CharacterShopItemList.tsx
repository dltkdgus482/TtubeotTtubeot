import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import StyledText from '../../styles/StyledText';
import styles from './CharacterShopModal.styles';
import { TtuBeotList, FoodList, EtcList } from './dummydata';
import { drawTtubeot, confirmTtubeotName } from '../../utils/apis/Draw/Draw';
import { useUser } from '../../store/user';
import ButtonFlat from '../Button/ButtonFlat';

interface ItemProps {
  name: string;
  source: any;
  description: string;
  price: number;
}

interface CharacterShopItemListProps {
  selectedMenu: string;
}

const CoinIcon = require('../../assets/icons/coinIcon.png');

const CharacterShopitemList = ({ selectedMenu }) => {
  const { accessToken, setAccessToken } = useUser.getState();

  const buyItem = async () => {
    const drawTtubeotRes = await drawTtubeot(accessToken, setAccessToken, 2, 1);

    if (drawTtubeotRes === false) {
      return;
    }

    const userTtubeotOwnershipId = drawTtubeotRes.user_ttubeot_ownership_id;
    const ttubeotId = drawTtubeotRes.ttubeotId;
    const userTtubeotOwnershipName = 'falcon';

    const confirmTtubeotNameRes = await confirmTtubeotName(
      userTtubeotOwnershipId,
      userTtubeotOwnershipName,
    );
  };

  return (
    <>
      {selectedMenu === '뚜벗' &&
        TtuBeotList.map((item, index) => {
          return (
            <View style={styles.item} key={index}>
              <View style={styles.itemImageContainer}>
                <Image source={item.source} style={styles.itemImage} />
              </View>
              <View style={styles.itemInfoContainer}>
                <StyledText bold style={styles.itemName}>
                  {item.name}
                </StyledText>
                <StyledText bold>{item.description}</StyledText>
                <TouchableOpacity
                  style={styles.itemPriceContainer}
                  onPress={buyItem}>
                  <View style={styles.itemPriceInnerContainer}>
                    <Image source={CoinIcon} style={styles.coinIcon} />
                    <StyledText bold style={styles.itemPrice}>
                      {item.price}
                    </StyledText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      {selectedMenu === '밥' &&
        FoodList.map((item, index) => {
          return (
            <View style={styles.item} key={index}>
              <View style={styles.itemImageContainer}>
                <Image source={item.source} style={styles.itemImage} />
              </View>
              <View style={styles.itemInfoContainer}>
                <StyledText bold style={styles.itemName}>
                  {item.name}
                </StyledText>
                <StyledText bold>{item.description}</StyledText>
                <TouchableOpacity
                  style={styles.itemPriceContainer}
                  onPress={buyItem}>
                  <View style={styles.itemPriceInnerContainer}>
                    <Image source={CoinIcon} style={styles.coinIcon} />
                    <StyledText bold style={styles.itemPrice}>
                      {item.price}
                    </StyledText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      {selectedMenu === '기타' &&
        EtcList.map((item, index) => {
          return (
            <View style={styles.item} key={index}>
              <View style={styles.itemImageContainer}>
                <Image source={item.source} style={styles.itemImage} />
              </View>
              <View style={styles.itemInfoContainer}>
                <StyledText bold style={styles.itemName}>
                  {item.name}
                </StyledText>
                <StyledText bold>{item.description}</StyledText>
                <TouchableOpacity
                  style={styles.itemPriceContainer}
                  onPress={buyItem}>
                  <Image source={CoinIcon} style={styles.coinIcon} />
                  <ButtonFlat
                    content={item.price.toLocaleString()}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
    </>
  );
};

export default CharacterShopitemList;
