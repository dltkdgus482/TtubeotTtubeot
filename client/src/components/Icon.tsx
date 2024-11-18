import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Octicons from 'react-native-vector-icons/Octicons';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  type: 'Ionicons' | 'FontAwesome5' | 'FontAwesome6' | 'Octicons' | undefined;
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 30,
  color = '#000',
  type,
}) => {
  switch (type) {
    case 'Ionicons':
      return <Ionicons name={name} size={size} color={color} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={name} size={size} color={color} />;
    case 'FontAwesome6':
      return <FontAwesome6 name={name} size={size} color={color} />;
    case 'Octicons':
      return <Octicons name={name} size={size} color={color} />;
    default:
      return null;
  }
};

export default Icon;
