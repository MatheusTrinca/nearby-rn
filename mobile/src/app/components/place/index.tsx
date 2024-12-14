import { TouchableOpacity, Image, Text } from 'react-native';

import { s } from './styles';
import { View } from 'react-native';
import { IconTicket } from '@tabler/icons-react-native';
import { colors } from '@/styles/colors';

export type PlaceProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  coupons: number;
  cover: string;
  address: string;
};

type Props = {
  data: PlaceProps;
};

export function Place({ data, ...rest }: Props) {
  return (
    <TouchableOpacity style={s.container} {...rest}>
      <Image source={{ uri: data.cover }} style={s.image} />
      <View style={s.content}>
        <Text style={s.name}>{data.name}</Text>
        <Text style={s.description}>{data.description}</Text>

        <View style={s.footer}>
          <IconTicket size={16} color={colors.red.base} />
          <Text style={s.tickets}>{data.coupons} cupons disponíveis</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
