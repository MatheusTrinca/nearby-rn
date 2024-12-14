import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { Categories, CategoryProps } from './components/categories';
import { Place, PlaceProps } from './components/place';
import { Places } from './components/places';

export default function Home() {
  const [categories, setCategories] = useState<CategoryProps>([]);
  const [category, setCategory] = useState('');
  const [markets, setMarkets] = useState<PlaceProps[]>([]);

  async function fetchCategories() {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
      setCategory(data[0].id);
    } catch (error) {
      console.error(error);
      Alert.alert('Categorias', 'Erro ao buscar categorias');
    }
  }

  async function fetchMarkets() {
    if (!category) {
      return;
    }
    try {
      const { data } = await api.get(`/markets/category/${category}`);
      setMarkets(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Estabelecimentos', 'Erro ao buscar estabelecimentos');
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [category]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Categories
        data={categories}
        onSelect={setCategory}
        selected={category}
      />

      <Places data={markets} />
    </View>
  );
}
