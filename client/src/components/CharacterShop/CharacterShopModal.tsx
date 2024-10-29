import React, {useState} from 'react';
import {
  View,
  Modal,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import styles from './CharacterShopModal.styles';

const CharacterShopTitleContainer = require('../../assets/images/CharacterShopTitleContainer.png');
const CharacterShopBackgound = require('../../assets/images/CharacterShopBackground.png');
const CoinIcon = require('../../assets/icons/coinIcon.png');

interface CharacterShopModalProps {
  modalVisible: boolean;
  closeShopModal: () => void;
}

const CharacterShopModal: React.FC<CharacterShopModalProps> = ({
  modalVisible,
  closeShopModal,
}) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('뚜벗');
  const menuList = ['뚜벗', '밥', '기타'];
  const TtuBeotList = [
    {
      name: '뚜벗 Lv. 1',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 1000,
    },
    {
      name: '뚜벗 Lv. 2',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 2000,
    },
  ];
  const FoodList = [
    {
      name: '밥 Lv. 1',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 1000,
    },
    {
      name: '밥 Lv. 2',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 2000,
    },
  ];
  const EtcList = [
    {
      name: '기타 Lv. 1',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 1000,
    },
    {
      name: '기타 Lv. 2',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 2000,
    },
    {
      name: '기타 Lv. 2',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 2000,
    },
    {
      name: '기타 Lv. 2',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 2000,
    },
    {
      name: '기타 Lv. 2',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 2000,
    },
    {
      name: '기타 Lv. 2',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 2000,
    },
    {
      name: '기타 Lv. 2',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 2000,
    },
    {
      name: '기타 Lv. 2',
      source: require('../../assets/images/RandomCharacter.png'),
      description: '아이템 설명입니다.',
      price: 2000,
    },
  ];

  const buyItem = () => {
    console.log('buy item');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeShopModal}>
      <View style={styles.modalBackground}>
        <View style={styles.modalView}>
          <View style={styles.titleBackContainer}>
            <Image
              source={CharacterShopBackgound}
              style={styles.titleBackImage}
            />
          </View>
          <View style={styles.titleContainer}>
            <Image
              source={CharacterShopTitleContainer}
              style={styles.titleImage}
            />
            <Text style={styles.title}>상점</Text>
            <Text style={styles.closeButton} onPress={closeShopModal}>
              X
            </Text>
          </View>

          <View style={styles.menuContainer}>
            {menuList.map((menu, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedMenu(menu)}>
                <View
                  style={
                    selectedMenu === menu
                      ? [styles.menu, styles.selectedMenu]
                      : styles.menu
                  }>
                  <Text style={styles.menuText}>{menu}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.itemContainer}>
            {selectedMenu === '뚜벗' &&
              TtuBeotList.map((item, index) => {
                return (
                  <View style={styles.item} key={index}>
                    <View style={styles.itemImageContainer}>
                      <Image source={item.source} style={styles.itemImage} />
                    </View>
                    <View style={styles.itemInfoContainer}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text>{item.description}</Text>
                      <TouchableOpacity
                        style={styles.itemPriceContainer}
                        onPress={buyItem}>
                        <View style={styles.itemPriceInnerContainer}>
                          <Image source={CoinIcon} style={styles.coinIcon} />
                          <Text style={styles.itemPrice}>{item.price}</Text>
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
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text>{item.description}</Text>
                      <TouchableOpacity
                        style={styles.itemPriceContainer}
                        onPress={buyItem}>
                        <View style={styles.itemPriceInnerContainer}>
                          <Image source={CoinIcon} style={styles.coinIcon} />
                          <Text style={styles.itemPrice}>{item.price}</Text>
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
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text>{item.description}</Text>
                      <TouchableOpacity
                        style={styles.itemPriceContainer}
                        onPress={buyItem}>
                        <View style={styles.itemPriceInnerContainer}>
                          <Image source={CoinIcon} style={styles.coinIcon} />
                          <Text style={styles.itemPrice}>{item.price}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CharacterShopModal;
