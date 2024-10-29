import styled from 'styled-components/native';

interface StyledTextProps {
  bold?: boolean;
  color?: string;
}

const StyledText = styled.Text<StyledTextProps>`
  font-family: ${props =>
    props.bold ? props.theme.fontFamilyBold : props.theme.fontFamilyRegular};
  color: ${props => props.color || 'black'};
`;

export default StyledText;
