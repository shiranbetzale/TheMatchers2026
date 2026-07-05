import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AxiosError} from 'axios';

import CustomText from '../../components/CustomText/CustomText';
import HomeScreen from '../HomeScreen/HomeScreen';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import api from '../../services/api';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
import {styles} from './ContactRequestsScreen.style';
import ContactRequestCard, {ContactRequest} from './ContactRequestCard';

const ContactRequestsScreen = () => {
  const {t, isRTL} = useLanguage();
  const {showMessage} = useMessage();
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [updatingId, setUpdatingId] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      const response = await api.get('/api/contact/requests');
      const nextRequests = Array.isArray(response.data?.requests)
        ? response.data.requests
        : [];

      setRequests(nextRequests);
    } catch (error) {
      const axiosError = error as AxiosError;
      const messageKey =
        axiosError.response?.status === 404
          ? 'contactRequestsEndpointMissing'
          : 'contactRequestsLoadError';

      showMessage({
        type: 'error',
        message: t(messageKey),
      });
    }
  }, [showMessage, t]);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests]),
  );

  const stats = useMemo(
    () => ({
      total: requests.length,
      unread: requests.filter(request => request.status === 'new').length,
      handled: requests.filter(request => request.status === 'handled').length,
    }),
    [requests],
  );

  const updateRequest = async (request: ContactRequest) => {
    if (updatingId) {
      return;
    }

    try {
      setUpdatingId(request.id);
      const response = await api.patch(`/api/contact/requests/${request.id}`, {
        action: 'handled',
      });
      const updatedRequest = response.data?.request;

      if (updatedRequest) {
        setRequests(currentRequests =>
          currentRequests.map(item =>
            item.id === request.id ? updatedRequest : item,
          ),
        );
      } else {
        fetchRequests();
      }

      showMessage({
        type: 'success',
        message: t('contactRequestMarkedHandled'),
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      const messageKey =
        axiosError.response?.status === 404
          ? 'contactRequestsEndpointMissing'
          : 'contactRequestUpdateError';

      showMessage({
        type: 'error',
        message: t(messageKey),
      });
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <HomeScreen
      disableScroll
      pinChildren={
        <View style={styles.headerWrapper}>
          <CustomText text="contactRequests" customStyle={styles.title} />
          <CustomText
            text="contactRequestsSubtitle"
            customStyle={styles.subtitle}
          />

          <View
            style={[styles.statsRow, isRTL ? styles.rowReverse : styles.row]}>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <CustomText text="all" customStyle={styles.statLabel} />
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>{stats.unread}</Text>
              <CustomText
                text="contactRequestNew"
                customStyle={styles.statLabel}
              />
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>{stats.handled}</Text>
              <CustomText
                text="contactRequestHandled"
                customStyle={styles.statLabel}
              />
            </View>
          </View>
        </View>
      }>
      <View style={styles.container}>
        <FlatList
          data={requests}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ContactRequestCard
              request={item}
              isUpdating={updatingId === item.id}
              onUpdate={updateRequest}
            />
          )}
          refreshing={false}
          onRefresh={fetchRequests}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <WhiteCard customStyle={styles.emptyCard}>
              <CustomText
                text="contactRequestsEmpty"
                customStyle={styles.emptyText}
              />
            </WhiteCard>
          }
        />
      </View>
    </HomeScreen>
  );
};

export default ContactRequestsScreen;
