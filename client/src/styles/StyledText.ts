import styled from 'styled-components/native';

interface StyledTextProps {
  bold?: boolean;
}

const StyledText = styled.Text<StyledTextProps>`
  font-family: ${props =>
    props.bold ? props.theme.fontFamilyBold : props.theme.fontFamilyRegular};
`;

export default StyledText;
