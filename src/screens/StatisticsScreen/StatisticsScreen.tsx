import React, {useCallback, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import HomeScreen from '../HomeScreen/HomeScreen';
import WhiteCard from '../../components/WhiteCard/WhiteCard';
import api from '../../services/api';
import {useLanguage} from '../../utils/LanguageProvider';
import {styles} from './StatisticsScreen.style';

type StatsSection = Record<string, number>;

type StatsResponse = {
  profiles?: StatsSection;
  users?: StatsSection;
  meetings?: StatsSection;
};

const sectionLabels: Record<string, string> = {
  profiles: 'Cards',
  users: 'Users',
  meetings: 'Meetings',
};

const statLabels: Record<string, string> = {
  total: 'Total',
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
  engaged: 'Engaged',
  married: 'Married',
  admins: 'Admins',
  matchmakers: 'Matchmakers',
  candidates: 'Candidates',
  busy: 'Busy',
  available: 'Available',
};

const StatCard = ({label, value}: {label: string; value: number}) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{String(value)}</Text>
    <Text style={styles.statLabel}>{statLabels[label] || label}</Text>
  </View>
);

const StatisticsScreen = () => {
  const {isRTL} = useLanguage();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      setError('');
      const response = await api.get('/api/stats');
      setStats(response.data?.stats || null);
    } catch (nextError) {
      console.warn('Failed to load statistics', nextError);
      setStats(null);
      setError('Failed to load statistics');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats]),
  );

  const sections = Object.entries(stats || {});

  return (
    <HomeScreen disableScroll>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerWrapper}>
          <Text style={styles.title}>Statistics</Text>
          <Text style={styles.subtitle}>System overview for cards, users and meetings</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {sections.map(([sectionKey, sectionValue]) => (
          <WhiteCard key={sectionKey} customStyle={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{sectionLabels[sectionKey] || sectionKey}</Text>
            <View style={[styles.grid, isRTL ? styles.rowReverse : styles.row]}>
              {Object.entries(sectionValue || {}).map(([key, value]) => (
                <StatCard key={key} label={key} value={Number(value || 0)} />
              ))}
            </View>
          </WhiteCard>
        ))}
      </ScrollView>
    </HomeScreen>
  );
};

export default StatisticsScreen;
