import {useCallback} from 'react';
import {getSessionRole, getSessionUser} from '../services/session';
import {setMonitoringUser} from '../services/monitoring';

export const useMonitoringUser = () =>
  useCallback(async () => {
    const [role, user] = await Promise.all([getSessionRole(), getSessionUser()]);

    await setMonitoringUser({
      id: user?.id,
      phone: user?.phone,
      role: role || undefined,
    });
  }, []);
