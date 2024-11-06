import React, { useEffect, useState } from 'react';
import { View, Modal, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from './CharacterShopModal.styles';
import StyledText from '../../styles/StyledText';
import Icon from 'react-native-vector-icons/AntDesign';
import { useUser } from '../../store/user';
import CharacterShopitemList from './CharacterShopItemList';

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
  const menuList: string[] = ['뚜벗', '밥', '기타'];

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
            <StyledText bold style={styles.title}>
              상점
            </StyledText>
            <Icon
              name="close"
              size={30}
              color="black"
              style={styles.closeButton}
              onPress={closeShopModal}
            />
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
                  <View style={styles.stitchedBorder}></View>
                  <StyledText bold style={styles.menuText}>
                    {menu}
                  </StyledText>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.itemContainer}>
            <CharacterShopitemList selectedMenu={selectedMenu} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CharacterShopModal;
