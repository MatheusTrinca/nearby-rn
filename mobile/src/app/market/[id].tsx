import { View, Alert, Modal, StatusBar, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams, Redirect } from 'expo-router';

import { api } from '@/services/api';
import { useEffect, useRef, useState } from 'react';
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
  const [isCouponFetching, setIsCouponFetching] = useState(false);
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);
  const [_, requestPermission] = useCameraPermissions();

  const qrLock = useRef(false);

  const params = useLocalSearchParams<{ id: string }>();

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

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        return Alert.alert(
          'Câmera',
          'Você precisa dar permissão para usar a câmera'
        );
      }

      qrLock.current = false;
      setIsVisibleCameraModal(true);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao abrir camera');
    }
  }

  async function fetchCoupon(id: string) {
    try {
      setIsCouponFetching(true);
      const { data } = await api.patch(`/coupons/${id}`);
      Alert.alert('Cupom', data.coupon);
      setCoupon(data.coupon);
      setIsCouponFetching(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao buscar cupom');
    }
  }

  function handleUseCoupon(id: string) {
    setIsVisibleCameraModal(false);

    Alert.alert(
      'Cupom',
      'Não é possível resgatar um cupom resgatado. Deseja realmente resgatar o cupom?',
      [
        {
          style: 'cancel',
          text: 'Não',
        },
        {
          text: 'Sim',
          onPress: () => fetchCoupon(id),
        },
      ]
    );
  }

  useEffect(() => {
    fetchMarket();
  }, [params.id, coupon]);

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Cover uri={data.cover} />
        <Details data={data} />
        {coupon && <Coupon code={coupon} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={handleOpenCamera}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (!qrLock.current) {
              qrLock.current = true;
              setTimeout(() => {
                handleUseCoupon(data);
              }, 500);
            }
          }}
        />

        <View style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
          <Button
            onPress={() => setIsVisibleCameraModal(false)}
            isLoading={isCouponFetching}
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
