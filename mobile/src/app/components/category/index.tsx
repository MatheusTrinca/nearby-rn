import { Text, View, Pressable, PressableProps } from 'react-native';
import { s } from './styles';

export default function Category() {
  return (
    <View style={s.container}>
      <Text style={s.name}>Categoria</Text>
    </View>
  );
}
