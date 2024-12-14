import { View, Text, Alert } from 'react-native';
import { router, useLocalSearchParams, Redirect } from 'expo-router';

import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/loading';
import Cover from '@/components/market/cover';
import { Details, PropsDetails } from '@/components/market/details';
import { Coupon } from '@/components/coupon';
import { Button } from '@/components/button';

type DataProps = PropsDetails & {
  cover: string;
};

export default function Market() {
  const [data, setData] = useState<DataProps>();
  const [coupon, setCoupon] = useState<string | null>();
  const [isLoading, setIsLoading] = useState(true);

  const params = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    fetchMarket();
  }, []);

  async function fetchMarket() {
    try {
      const { data } = await api.get(`/markets/${params.id}`);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar os dados', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Cover uri={data.cover} />
      <Details data={data} />
      {coupon && <Coupon code={coupon} />}

      <View style={{ padding: 32 }}>
        <Button>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>
    </View>
  );
}
