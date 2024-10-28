import styled from 'styled-components/native';

const StyledText = styled.Text`
  font-family: ${props =>
    props.bold ? props.theme.fontFamilyBold : props.theme.fontFamilyRegular};
`;

export default StyledText;
