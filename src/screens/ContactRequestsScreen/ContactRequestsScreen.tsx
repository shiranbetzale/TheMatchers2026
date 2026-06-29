import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AxiosError} from 'axios';

import CustomText from '../../components/CustomText/CustomText';
import HomeScreen from '../HomeScreen/HomeScreen';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import api from '../../services/api';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
import {styles} from './ContactRequestsScreen.style';

type ContactRequestStatus = 'new' | 'read' | 'handled';

type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactRequestStatus;
  emailSent?: boolean;
  emailError?: string;
  createdAt?: string;
  readAt?: string;
  handledAt?: string;
};

const getRequestStatusKey = (status: ContactRequestStatus) => {
  if (status === 'handled') {
    return 'contactRequestHandled';
  }

  if (status === 'read') {
    return 'contactRequestRead';
  }

  return 'contactRequestNew';
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

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

  const updateRequest = async (
    request: ContactRequest,
    action: 'read' | 'handled',
  ) => {
    if (updatingId) {
      return;
    }

    try {
      setUpdatingId(request.id);
      const response = await api.patch(`/api/contact/requests/${request.id}`, {
        action,
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
        message:
          action === 'handled'
            ? t('contactRequestMarkedHandled')
            : t('contactRequestMarkedRead'),
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

  const renderRequest = ({item}: {item: ContactRequest}) => {
    const isHandled = item.status === 'handled';
    const isRead = item.status === 'read' || isHandled;
    const isUpdating = updatingId === item.id;
    const createdAtText = formatDateTime(item.createdAt);

    return (
      <WhiteCard customStyle={styles.card}>
        <View
          style={[
            styles.cardHeader,
            isRTL ? styles.rowReverse : styles.row,
          ]}>
          <View style={styles.titleBlock}>
            <Text
              style={[
                styles.requestName,
                isRTL ? styles.textRight : styles.textLeft,
              ]}>
              {item.name || t('unknown')}
            </Text>
            <Text
              style={[
                styles.requestMeta,
                isRTL ? styles.textRight : styles.textLeft,
              ]}>
              {[item.email, item.phone, createdAtText].filter(Boolean).join(' | ')}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              item.status === 'new' && styles.statusBadgeNew,
              isHandled && styles.statusBadgeHandled,
            ]}>
            <CustomText
              text={getRequestStatusKey(item.status)}
              customStyle={styles.statusText}
            />
          </View>
        </View>

        <Text
          style={[
            styles.messageText,
            isRTL ? styles.textRight : styles.textLeft,
          ]}>
          {item.message}
        </Text>

        {!item.emailSent && item.emailError ? (
          <CustomText
            text={`${t('contactRequestEmailFailed')}: ${item.emailError}`}
            customStyle={styles.emailError}
          />
        ) : null}

        <View
          style={[
            styles.actions,
            isRTL ? styles.rowReverse : styles.row,
          ]}>
          <TouchableOpacity
            activeOpacity={0.84}
            disabled={isRead || isUpdating}
            style={[
              styles.actionButton,
              isRead && styles.actionButtonDisabled,
            ]}
            onPress={() => updateRequest(item, 'read')}>
            <CustomText
              text="markAsRead"
              customStyle={styles.actionButtonText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.84}
            disabled={isHandled || isUpdating}
            style={[
              styles.actionButton,
              styles.handledButton,
              isHandled && styles.actionButtonDisabled,
            ]}
            onPress={() => updateRequest(item, 'handled')}>
            <CustomText
              text="markAsHandled"
              customStyle={styles.handledButtonText}
            />
          </TouchableOpacity>
        </View>
      </WhiteCard>
    );
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

          <View style={[styles.statsRow, isRTL ? styles.rowReverse : styles.row]}>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <CustomText text="all" customStyle={styles.statLabel} />
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statValue}>{stats.unread}</Text>
              <CustomText text="contactRequestNew" customStyle={styles.statLabel} />
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
          renderItem={renderRequest}
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
