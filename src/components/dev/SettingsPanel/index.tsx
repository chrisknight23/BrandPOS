import React from 'react';
import { TabProvider } from './TabContext';
import SettingsPanel from './SettingsPanel';

const SettingsPanelWrapper: React.FC<any> = (props) => (
  <TabProvider>
    <SettingsPanel {...props} />
  </TabProvider>
);

export default SettingsPanelWrapper; 