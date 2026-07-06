import React, {useCallback, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AxiosError} from 'axios';

import CustomText from '../../components/CustomText/CustomText';
import HomeScreen from '../HomeScreen/HomeScreen';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import api from '../../services/api';
import {useLanguage} from '../../utils/LanguageProvider';
import {useMessage} from '../../utils/MessageProvider';
import {styles} from './LogsScreen.style';

type LogItem = {
  id?: string;
  _id?: string;
  action?: string;
  message?: string;
  userName?: string;
  userPhone?: string;
  createdAt?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
};

const getLogId = (item: LogItem, index: number) =>
  String(item.id || item._id || item.createdAt || item.timestamp || index);

const formatDate = (value?: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('he-IL');
};

const LogsScreen = () => {
  const {t, isRTL} = useLanguage();
  const {showMessage} = useMessage();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await api.get('/api/logs');
      const nextLogs = Array.isArray(response.data?.logs)
        ? response.data.logs
        : Array.isArray(response.data)
          ? response.data
          : [];

      setLogs(nextLogs);
    } catch (error) {
      const axiosError = error as AxiosError;
      const messageKey =
        axiosError.response?.status === 404
          ? 'logsEndpointMissing'
          : 'logsLoadError';

      showMessage({
        type: 'error',
        message: t(messageKey),
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [showMessage, t]);

  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [fetchLogs]),
  );

  return (
    <HomeScreen
      disableScroll
      pinChildren={
        <View style={styles.headerWrapper}>
          <CustomText text="logs" customStyle={styles.title} />
          <CustomText text="logsSubtitle" customStyle={styles.subtitle} />
        </View>
      }>
      <View style={styles.container}>
        <FlatList
          data={logs}
          keyExtractor={getLogId}
          refreshing={isRefreshing}
          onRefresh={fetchLogs}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => {
            const createdAt = item.createdAt || item.timestamp;
            const userLabel = [item.userName, item.userPhone]
              .filter(Boolean)
              .join(' · ');

            return (
              <WhiteCard customStyle={styles.card}>
                <View
                  style={[
                    styles.cardHeader,
                    isRTL ? styles.rowReverse : styles.row,
                  ]}>
                  <CustomText
                    text={item.action || 'logsUnknownAction'}
                    customStyle={styles.actionText}
                  />
                  {createdAt ? (
                    <Text style={styles.dateText}>{formatDate(createdAt)}</Text>
                  ) : null}
                </View>

                {item.message ? (
                  <Text style={styles.messageText}>{item.message}</Text>
                ) : null}

                {userLabel ? <Text style={styles.metaText}>{userLabel}</Text> : null}
              </WhiteCard>
            );
          }}
          ListEmptyComponent={
            <WhiteCard customStyle={styles.emptyCard}>
              <CustomText text="logsEmpty" customStyle={styles.emptyText} />
            </WhiteCard>
          }
        />
      </View>
    </HomeScreen>
  );
};

export default LogsScreen;
