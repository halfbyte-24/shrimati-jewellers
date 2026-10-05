import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const StoreSettingsContext = createContext();

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}

export function StoreSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (error) {
          throw error;
        }

        // Apply fallbacks for new fields in case migration hasn't run yet
        if (data) {
          data.languages_spoken = data.languages_spoken || ['English', 'Hindi'];
          data.payment_options = data.payment_options || ['RTGS', 'NEFT', 'UPI', 'Cash', 'Cards', 'Online Wallets', 'Gift Card'];
          data.parking = data.parking || 'Street Parking';
        }

        setSettings(data);
      } catch (err) {
        console.error('Error fetching store settings:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return (
    <StoreSettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </StoreSettingsContext.Provider>
  );
}
