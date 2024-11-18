import React, { useRef, useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import StyledText from '../../styles/StyledText';
import styles from './CharacterShopModal.styles';
import { TtuBeotList, FoodList, EtcList } from './dummydata';
import { getBreakUpTtubeotInfoApi } from '../../utils/apis/Draw/Draw';
import { useUser } from '../../store/user';
import ButtonFlat from '../Button/ButtonFlat';
import WebView from 'react-native-webview';
import { ScrollView } from 'react-native-gesture-handler';
import { profileColor } from '../ProfileImageUrl';
import BuyConfirmModal from './BuyConfirmModal';
import SetTtubeotNameModal from './SetTtubeotNameModal';

interface ItemProps {
  name: string;
  source: any;
  description: string;
  price: number;
}

interface CharacterShopItemListProps {
  selectedMenu: string;
}

interface TtubeotData {
  ttubeotId: number;
  userTtubeotOwnershipId: number;
}

const CoinIcon = require('../../assets/icons/coinIcon.png');
const EggImage = require('../../assets/images/EggWithShadow.png');

const CharacterShopitemList = ({ selectedMenu }) => {
  const { accessToken, setAccessToken } = useUser.getState();
  const webViewRef = useRef(null);
  const [randomButtonContent, setRandomButtonContent] = useState(100);
  const [groupButtonContent, setGroupButtonContent] = useState(200);
  const [choiceButtonContent, setChoiceButtonContent] = useState(300);
  const [confirmModalVisible, setconfirmModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [selectedTtubeotId, setSelectedTtubeotId] = useState(null);
  const [modalType, setModalType] = useState(1); // 1(랜덤), 2(확정), 3(그룹)
  const [modalGrade, setModalGrade] = useState<number | null>(null);
  const [modalPrice, setModalPrice] = useState(0);
  const [ttubeotData, setTtubeotData] = useState<TtubeotData | null>(null);
  const { ttubeotId } = useUser.getState();

  const openModal = (
    ttubeotId: number | null = null,
    grade: number | null = null,
  ) => {
    let price = 0;
    if (selectedMenu === '랜덤') {
      setModalType(1);
      setSelectedTtubeotId(null);
      setModalGrade(null);
      price = randomButtonContent;
    } else if (selectedMenu === '확정') {
      setModalType(2);
      setSelectedTtubeotId(ttubeotId);
      setModalGrade(null);
      price = choiceButtonContent;
    } else if (selectedMenu === '그룹') {
      setModalType(3);
      setSelectedTtubeotId(null);
      setModalGrade(grade);
      price = groupButtonContent;
    }
    setModalPrice(price);
    setconfirmModalVisible(true);
  };

  const closeConfirmModal = () => {
    setconfirmModalVisible(false);
    setSelectedTtubeotId(null);
    setModalGrade(null);
  };

  const closeNameModal = () => {
    setNameModalVisible(false);
  };

  const handleBuySuccess = data => {
    setTtubeotData(data); // ttubeotData 전달
    setNameModalVisible(true);
  };

  useEffect(() => {
    const fetchBreakUpInfo = async () => {
      const response = await getBreakUpTtubeotInfoApi(
        accessToken,
        setAccessToken,
      );

      if (response === false) {
        console.error('Failed to fetch breakup info.');
        return;
      }

      if (response === null || response.graduationStatus === 1) {
        // status code가 204이거나 graduationStatus가 1(정상졸업)일 때
        setRandomButtonContent(100);
        setGroupButtonContent(200);
        setChoiceButtonContent(300);
      } else if (response.graduationStatus === 2) {
        // graduationStatus가 2(중퇴)일 때
        setRandomButtonContent(300);
        setGroupButtonContent(400);
        setChoiceButtonContent(600);
      }
    };

    fetchBreakUpInfo();
  }, [accessToken, setAccessToken]);

  const renderCharacterGroup = (
    title: string,
    startId: number,
    endId: number,
    grade: number,
  ) => (
    <View style={styles.groupContainer}>
      <View style={styles.groupHeader}>
        {/* <Image source={EggImage} style={styles.randomEggImage} /> */}
        <StyledText bold style={styles.groupTitle}>
          {title}
        </StyledText>
        {ttubeotId === 46 && (
          <TouchableOpacity
            style={styles.groupPriceContainer}
            onPress={() => openModal(null, grade)}>
            <Image source={CoinIcon} style={styles.groupCoinIcon} />
            <ButtonFlat
              content={`     ${groupButtonContent}`}
              color="#FBFAF5"
              borderRadius={30}
              width={80}
              height={40}
              fontSize={15}
            />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.characterList}>
        {Array.from({ length: endId - startId + 1 }, (_, i) => {
          const id = startId + i;
          return (
            <View key={id} style={styles.characterImageContainer}>
              <Image source={profileColor[id]} style={styles.characterImage} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <>
      {selectedMenu === '랜덤' && (
        <View style={styles.randomItem}>
          <View style={styles.eggImageContainer}>
            {/* <Image source={EggImage} style={styles.eggImage} /> */}
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ uri: 'file:///android_asset/renderEggModel.html' }}
              style={styles.ttubeotWebview}
              allowFileAccess={true}
              allowFileAccessFromFileURLs={true}
              allowUniversalAccessFromFileURLs={true}
              onLoadStart={syntheticEvent => {
                const { nativeEvent } = syntheticEvent;
                // console.log('WebView Start: ', nativeEvent);
              }}
              onError={syntheticEvent => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView onError: ', nativeEvent);
              }}
              onHttpError={syntheticEvent => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView onHttpError: ', nativeEvent);
              }}
              onMessage={event => {
                // console.log('Message from WebView:', event.nativeEvent.data);
              }}
            />
          </View>
          {ttubeotId === 46 && (
            <TouchableOpacity
              style={styles.randomItemPriceContainer}
              onPress={() => openModal()}>
              <Image source={CoinIcon} style={styles.coinIcon} />
              <ButtonFlat
                content={`     ${randomButtonContent}`}
                color="#FBFAF5"
                borderRadius={30}
                width={100}
                height={50}
                fontSize={18}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {selectedMenu === '그룹' && (
        <View style={styles.groupItem}>
          {renderCharacterGroup('짝은 애들', 1, 21, 1)}
          {renderCharacterGroup('중간 애들', 22, 36, 2)}
          {renderCharacterGroup('큰 애들', 37, 45, 3)}
        </View>
      )}
      {selectedMenu === '확정' && (
        <View style={styles.choiceItem}>
          <View style={styles.characterGrid}>
            {Array.from({ length: 45 }, (_, i) => (
              <TouchableOpacity
                key={i + 1}
                style={styles.choiceCharacterImageContainer}
                onPress={() => openModal(i + 1)}
                disabled={ttubeotId !== 46}>
                <Image
                  source={profileColor[i + 1]}
                  style={styles.characterImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <BuyConfirmModal
        confirmModalVisible={confirmModalVisible}
        closeConfirmModal={closeConfirmModal}
        onSuccess={handleBuySuccess}
        ttubeotId={selectedTtubeotId}
        selectedMenu={selectedMenu}
        type={modalType}
        grade={modalGrade}
        price={modalPrice}
      />
      <SetTtubeotNameModal
        nameModalVisible={nameModalVisible}
        closeNameModal={closeNameModal}
        ttubeotData={ttubeotData}
      />
    </>
  );
};

export default CharacterShopitemList;
