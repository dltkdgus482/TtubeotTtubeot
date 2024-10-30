import React, { useState } from 'react';
import { View, Image, ImageBackground, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './TermsOfUseScreen.styles';
import defaulStyles from './SignUpScreen.styles';
import StyledText from '../../styles/StyledText';
import ButtonDefault from '../../components/Button/ButtonDefault';
import Icon from 'react-native-vector-icons/AntDesign';

const background = require('../../assets/images/IntroBackground.png');
const title = require('../../assets/images/TtubeotTitle.png');
const withTtubeot = require('../../assets/images/WithTtubeot.png');

const TermsOfUseScreen = () => {
  const navigation = useNavigation();
  const [serviceTermsChecked, setServiceTermsChecked] = useState(false);
  const [pushTermsChecked, setPushTermsChecked] = useState(false);
  const [locationTermsChecked, setLocationTermsChecked] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);


  const handleNextPress = () => {
    navigation.navigate('LastSignUpScreen'); // '회원가입 마지막 페이지'로 이동
  };

  return (
    <View style={defaulStyles.container}>
      <ImageBackground source={background} style={defaulStyles.backgroundImage} />
      <View style={defaulStyles.titleContainer}>
        <Image source={title} style={defaulStyles.title} />
      </View>
      <View style={defaulStyles.withContainer}>
        <Image source={withTtubeot} style={defaulStyles.withTtubeot} />
      </View>

      <View style={defaulStyles.formContainer}>
        {/* 서비스 이용약관 */}
        <View style={styles.termsRow}>
          <TouchableOpacity onPress={() => setServiceTermsChecked(!serviceTermsChecked)}>
            <Icon name={serviceTermsChecked ? 'checkcircle' : 'checkcircleo'} size={18} color="#373737" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.termsButton} onPress={() => setServiceModalVisible(true)}>
            <StyledText style={styles.containerText}>서비스 이용약관 동의 (필수)</StyledText>
            <Icon name="right" size={12} color="gray" />
          </TouchableOpacity>
        </View>

        {/* 앱 푸시알림 동의 */}
        <View style={styles.termsRow}>
          <TouchableOpacity onPress={() => setPushTermsChecked(!pushTermsChecked)}>
            <Icon name={pushTermsChecked ? 'checkcircle' : 'checkcircleo'} size={18} color="#373737" />
          </TouchableOpacity>
          <View style={styles.termsButton}>
            <StyledText style={styles.containerText}>앱 푸시알림 동의 (선택)</StyledText>
          </View>
        </View>

        {/* 위치정보 타인 제공 동의 */}
        <View style={styles.termsRow}>
          <TouchableOpacity onPress={() => setLocationTermsChecked(!locationTermsChecked)}>
            <Icon name={locationTermsChecked ? 'checkcircle' : 'checkcircleo'} size={18} color="#373737" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.termsButton} onPress={() => setLocationModalVisible(true)}>
            <StyledText style={styles.containerText}>위치정보 타인 제공 동의 (선택)</StyledText>
            <Icon name="right" size={12} color="gray" />
          </TouchableOpacity>
        </View>
        {/* 다음 버튼 */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <ButtonDefault content="다음" color="#FDFBF4" width={120} height={50} />
        </TouchableOpacity>
      </View>

      {/* 서비스 이용약관 모달 */}
      <Modal visible={serviceModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <StyledText style={styles.modalTitle}>서비스 이용약관</StyledText>
              <StyledText style={styles.modalSubtitle}>1. 목적</StyledText>
              <StyledText style={styles.modalDetailText}>본 약관은 모험을 통해 성장하는 가상 애완동물 앱(뚜벗) 서비스의 이용에 관한 조건과 절차를 규정함을 목적으로 합니다.</StyledText>
              
              <StyledText style={styles.modalSubtitle}>2. 서비스 제공 및 변경</StyledText>
              <StyledText style={styles.modalDetailText}>1) 회사는 어린이의 야외활동을 촉진하고, 가상 애완동물과의 상호작용을 통해 사회성과 감정 발달을 목표로 서비스를 제공합니다.</StyledText>
              <StyledText style={styles.modalDetailText}>2) 회사는 서비스의 향상을 위해 필요하다고 판단될 경우 서비스의 내용을 추가, 변경 또는 종료할 수 있습니다.</StyledText>
              <StyledText style={styles.modalDetailText}>3) 서비스의 주요 변경 사항이 발생할 경우, 사전에 사용자에게 공지합니다.</StyledText>

              <StyledText style={styles.modalSubtitle}>3. 개인정보 보호</StyledText>
              <StyledText style={styles.modalDetailText}>1) 회사는 사용자의 개인정보 보호를 최우선으로 생각하며, 관련 법령에 따라 개인정보를 수집, 이용 및 관리합니다.</StyledText>
              <StyledText style={styles.modalDetailText}>2) 서비스의 원활한 제공을 위해 위치 정보, 건강 데이터, 음성 데이터 등을 수집할 수 있으며, 수집된 정보는 서비스 제공 외의 목적으로 사용되지 않습니다.</StyledText>
              <StyledText style={styles.modalDetailText}>3) 사용자는 언제든지 개인정보 수집 및 이용에 대한 동의를 철회할 수 있습니다.</StyledText>
              
              <StyledText style={styles.modalSubtitle}>4. 사용자 의무</StyledText>
              <StyledText style={styles.modalDetailText}>1) 사용자는 서비스 이용 시 법령, 본 약관, 회사가 정한 이용지침을 준수해야 합니다.</StyledText>
              <StyledText style={styles.modalDetailText}>2) 서비스 내에서 타인과의 상호작용 시 건전한 언어와 행동을 유지해야 하며, 타인에게 불쾌감을 줄 수 있는 행위를 해서는 안 됩니다.</StyledText>
              <StyledText style={styles.modalDetailText}>3) 사용자는 서비스 이용 중 다른 사람의 정보를 부정하게 사용하는 행위를 해서는 안 됩니다.</StyledText>

              <StyledText style={styles.modalSubtitle}>5. 서비스 제한 및 중단</StyledText>
              <StyledText style={styles.modalDetailText}>1)회사는 아래와 같은 경우 서비스 제공을 제한하거나 중단할 수 있습니다.</StyledText>
              <StyledText style={styles.modalDetailText}>a. 서비스 시스템에 문제가 발생한 경우</StyledText>
              <StyledText style={styles.modalDetailText}>b. 불가피한 기술적 사유로 인해 서비스가 제한되는 경우</StyledText>
              <StyledText style={styles.modalDetailText}>2) 회사는 서비스 중단에 대한 사전 공지를 위해 노력하며, 긴급한 경우 사후 공지할 수 있습니다.</StyledText>
              
              <StyledText style={styles.modalSubtitle}>6. 책임 제한</StyledText>
              <StyledText style={styles.modalDetailText}>1) 회사는 사용자 간의 상호작용에서 발생하는 문제에 대해 직접적인 책임을 지지 않습니다.</StyledText>
              <StyledText style={styles.modalDetailText}>2) 사용자는 본인의 부주의로 인해 발생한 문제에 대해 책임을 져야 합니다.</StyledText>
              <StyledText style={styles.modalDetailText}>3) 회사는 천재지변 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</StyledText>

              <TouchableOpacity onPress={() => setServiceModalVisible(false)} style={styles.closeIcon}>
                <Icon name="closecircle" size={18} color="#797979" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 위치정보 타인 제공 동의 모달 */}
      <Modal visible={locationModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <StyledText style={styles.modalTitle}>위치정보 타인 제공 동의 약관</StyledText>
              <StyledText style={styles.modalSubtitle}>1. 목적</StyledText>
              <StyledText style={styles.modalDetailText}>본 약관은 사용자의 위치 정보를 타인에게 제공하는 조건과 절차를 규정함으로써, 주변에 있는 친구와의 상호작용을 촉진하고자 합니다.</StyledText>

              <StyledText style={styles.modalSubtitle}>2. 위치정보 제공 내용</StyledText>
              <StyledText style={styles.modalDetailText}>1) 사용자의 위치 정보는 앱의 '모험' 기능을 통해 근처에 있는 다른 사용자에게 표시될 수 있습니다.</StyledText>
              <StyledText style={styles.modalDetailText}>2) 제공되는 위치 정보는 친구 찾기 기능에만 활용되며, 이 외의 목적에는 사용되지 않습니다.</StyledText>
              
              <StyledText style={styles.modalSubtitle}>3. 위치정보 제공 범위</StyledText>
              <StyledText style={styles.modalDetailText}>1) 위치 정보 제공은 사용자가 모험을 진행하는 동안에만 활성화되며, 모험이 종료되면 자동으로 위치 정보 제공이 중단됩니다.</StyledText>
              <StyledText style={styles.modalDetailText}>2) 제공되는 위치 정보는 사용자의 정확한 위치가 아닌 주변 반경을 표시하여, 타인에게 사용자의 위치가 노출되지 않도록 합니다.</StyledText>
              
              <StyledText style={styles.modalSubtitle}>4. 위치정보 제공 거부 및 철회</StyledText>
              <StyledText style={styles.modalDetailText}>1) 사용자는 언제든지 위치 정보 제공에 대한 동의를 거부하거나 철회할 수 있습니다.</StyledText>
              <StyledText style={styles.modalDetailText}>2) 동의 철회 시, 모험 중 친구 찾기 기능은 제한될 수 있습니다.</StyledText>

              <StyledText style={styles.modalSubtitle}>5. 책임 제한</StyledText>
              <StyledText style={styles.modalDetailText}>1) 회사는 사용자가 위치 정보 제공 동의를 철회하지 않아 발생하는 문제에 대해 책임을 지지 않습니다.</StyledText>
              <StyledText style={styles.modalDetailText}>2) 위치 정보 제공을 통한 상호작용에서 발생하는 문제에 대해 회사는 책임을 지지 않습니다.</StyledText>

              <StyledText style={styles.modalSubtitle}>6. 위치정보의 안전한 관리</StyledText>
              <StyledText style={styles.modalDetailText}>1) 회사는 사용자의 위치 정보를 안전하게 관리하기 위해 노력하며, 관련 법령에 따라 위치 정보를 보호합니다.</StyledText>
              <StyledText style={styles.modalDetailText}>2) 위치 정보는 서비스 제공을 위한 기간 동안만 보관되며, 이후 즉시 파기됩니다.</StyledText>

              <TouchableOpacity onPress={() => setLocationModalVisible(false)} style={styles.closeIcon}>
                <Icon name="closecircle" size={18} color="#797979" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TermsOfUseScreen;
