import React, {useState} from 'react';
import {View, Modal, Text, Button, Image, TouchableOpacity} from 'react-native';
import styles from './CharacterShopModal.styles';

const CharacterShopTitleContainer = require('../../assets/images/CharacterShopTitleContainer.png');
const CharacterShopBackgound = require('../../assets/images/CharacterShopBackground.png');

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
      name: '기타',
      source: require('../../assets/images/CharacterShopTitleContainer.png'),
      price: 1000,
    },
    {
      name: '기타',
      source: require('../../assets/images/CharacterShopTitleContainer.png'),
      price: 1000,
    },
  ];
  const FoodList = [
    {
      name: '기타',
      source: require('../../assets/images/CharacterShopTitleContainer.png'),
      price: 1000,
    },
    {
      name: '기타',
      source: require('../../assets/images/CharacterShopTitleContainer.png'),
      price: 1000,
    },
  ];
  const EtcList = [
    {
      name: '기타',
      source: require('../../assets/images/CharacterShopTitleContainer.png'),
      price: 1000,
    },
  ];

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

          <View style={styles.itemContainer}>
            {selectedMenu === '뚜벗' &&
              TtuBeotList.map((item, index) => {
                return (
                  <View style={styles.item} key={index}>
                    <Text>{item.name}</Text>
                    <Image source={item.source} />
                    <Text>{item.price}</Text>
                  </View>
                );
              })}
          </View>
          <Button title="Close Shop" onPress={closeShopModal} />
        </View>
      </View>
    </Modal>
  );
};

export default CharacterShopModal;
