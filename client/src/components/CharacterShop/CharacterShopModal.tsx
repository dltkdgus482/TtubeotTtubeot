import React, { useEffect, useState } from 'react';
import { View, Modal, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from './CharacterShopModal.styles';
import StyledText from '../../styles/StyledText';
import Icon from 'react-native-vector-icons/AntDesign';
import ButtonFlat from '../Button/ButtonFlat';

import {
  initialize,
  requestPermission,
  readRecords,
  getGrantedPermissions,
  getSdkStatus,
  revokeAllPermissions,
} from 'react-native-health-connect';

const CharacterShopTitleContainer = require('../../assets/images/CharacterShopTitleContainer.png');
const CharacterShopBackgound = require('../../assets/images/CharacterShopBackground.png');
const CoinIcon = require('../../assets/icons/coinIcon.png');

interface CharacterShopModalProps {
  modalVisible: boolean;
  closeShopModal: () => void;
}

interface ItemProps {
  name: string;
  source: any;
  description: string;
  price: number;
}

const CharacterShopModal: React.FC<CharacterShopModalProps> = ({
  modalVisible,
  closeShopModal,
}) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('뚜벗');
  const menuList: string[] = ['뚜벗', '밥', '기타'];
  const TtuBeotList: ItemProps[] = [
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
  const FoodList: ItemProps[] = [
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
  const EtcList: ItemProps[] = [
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

  //   -------------------------------------
  // const [healthData, setHealthData] = useState(null);
  //
  //  const init = async () => {
  //     await initialize();
  // };
  //
  //  const isAvailable = async () => {
  //   const res = await getSdkStatus();
  //   if (res === 1) {
  //     return { status: false, message: "SDK unavailable" };
  //   } else if (res === 2) {
  //     return { status: false, message: "SDK update required" };
  //   } else if (res === 3) {
  //     return { status: true, message: "Health Connect available" };
  //   }
  // };
  //
  //  const getPermission = async () =>
  //   new Promise((resolve, reject) => {
  //     requestPermission([
  //       { accessType: 'read', recordType: 'TotalCaloriesBurned' },
  //       { accessType: 'read', recordType: 'Steps' },
  //       { accessType: 'read', recordType: 'HeartRate' },
  //       { accessType: 'read', recordType: 'Distance' },
  //       { accessType: 'read', recordType: 'SleepSession' },
  //     ])
  //       .then(permissions => {
  //         console.log('Requested permissions:', permissions);
  //         resolve(permissions.length > 0);
  //       })
  //       .catch(e => {
  //         reject(Error(e.message));
  //       });
  //   });
  //
  // useEffect(() => {
  //   const getHealthData = async () => {
  //     try {
  //       // Initialize Health Connect SDK
  //       await initialize();
  //
  //       // Check SDK status
  //       const sdkStatus = await getSdkStatus();
  //       if (sdkStatus !== 3) {
  //         console.log("Health Connect SDK not available or needs update");
  //         return;
  //       }
  //
  //       // Request permissions
  //       const hasPermission = await getPermission();
  //       if (!hasPermission) {
  //         console.log("Permission denied");
  //         return;
  //       }
  //
  //       // Confirm granted permissions
  //       const grantedPermissions = await getGrantedPermissions();
  //       console.log("Granted permissions:", grantedPermissions);
  //
  //       // Set start and end times for the past two weeks
  //       const twoWeeksAgo = new Date();
  //       twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  //
  //       const result = await readRecords('Steps', {
  //         timeRangeFilter: {
  //           operator: 'between',
  //           startTime: twoWeeksAgo.toISOString(),
  //           endTime: new Date().toISOString(),
  //         },
  //       });
  //
  //       setHealthData(result);
  //       console.log("Health data:", result);
  //
  //       const readSampleData = () => {
  //         readRecords('Steps', {
  //           timeRangeFilter: {
  //             operator: 'between',
  //             startTime: '2023-01-09T12:00:00.405Z',
  //             endTime: '2024-10-29T23:53:15.405Z',
  //           },
  //         }).then(({ records }) => {
  //           console.log('Retrieved records: ', JSON.stringify({ records }, null, 2)); // Retrieved records:  {"records":[{"startTime":"2023-01-09T12:00:00.405Z","endTime":"2023-01-09T23:53:15.405Z","energy":{"inCalories":15000000,"inJoules":62760000.00989097,"inKilojoules":62760.00000989097,"inKilocalories":15000},"metadata":{"id":"239a8cfd-990d-42fc-bffc-c494b829e8e1","lastModifiedTime":"2023-01-17T21:06:23.335Z","clientRecordId":null,"dataOrigin":"com.healthconnectexample","clientRecordVersion":0,"device":0}}]}
  //         });
  //
  //     readSampleData();
  //       };
  //     } catch (error) {
  //       console.error("Error fetching health data:", error);
  //     }
  //   };
  //
  //   if (modalVisible) {
  //     getHealthData();
  //   }
  // }, [modalVisible]);

  //     ------------------------------

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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CharacterShopModal;
