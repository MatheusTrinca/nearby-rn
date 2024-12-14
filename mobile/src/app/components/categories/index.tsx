import { View } from 'react-native';
import Category from '../category';
import { s } from './styles';

export default function Categories() {
  return (
    <View style={s.container}>
      <View style={s.content}>
        <Category />
        <Category />
        <Category />
      </View>
    </View>
  );
}
