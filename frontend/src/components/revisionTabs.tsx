import { useEffect, useState } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import Markdown from './markdown';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabProps {
  label: string;
  value: number;
}

interface TabsProps {
  tabs: string[];
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const RevisionTabs = ({ tabs }: TabsProps) => {
  const [value, setValue] = useState(0);
  const [numberTabs, setNumberTabs] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log('value', value, tabs.length - 1);
    if (tabs.length - 1 !== numberTabs) {
      setValue(tabs.length - 1);
      setNumberTabs(tabs.length - 1);
    }
  }, [tabs]);

  const renderTabs = () => {
    return tabs.map((tab, index) => (
      <Tab
        key={index}
        label={index === 0 ? 'Original' : `Revision: ${index}`}
        value={index}
      />
    ));
  };

  const renderTabPanels = () => {
    return tabs.map((tab, index) => (
      <TabPanel key={index} value={value} index={index}>
        <Markdown message={tab} />
      </TabPanel>
    ));
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange}>
        {renderTabs()}
      </Tabs>
      {renderTabPanels()}
    </div>
  );
};

export default RevisionTabs;
