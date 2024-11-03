import styled from 'styled-components/native';

interface StyledTextInputProps {
  bold?: boolean;
  color?: string;
}

const StyledTextInput = styled.TextInput.attrs({
  allowFontScaling: false,
  includeFontPadding: false,
})<StyledTextInputProps>`
  font-family: ${props =>
    props.bold ? props.theme.fontFamilyBold : props.theme.fontFamilyRegular};
  color: ${props => props.color || 'black'};
`;

export default StyledTextInput;
