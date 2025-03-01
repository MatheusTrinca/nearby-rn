import { ActivityIndicator } from 'react-native';
import { colors } from '@/styles/colors';
import { s } from './styles';

export function Loading() {
  return <ActivityIndicator color={colors.green.base} style={s.container} />;
}
