import { Switch, FormControl, FormLabel } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';

export default function DarkModeToggle({ initial }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [checked, setChecked] = useState(initial === 'dark');

  const handleChange = async () => {
    const newMode = checked ? 'light' : 'dark';
    toggleColorMode();
    setChecked(!checked);
    try {
      await axios.post('/account/theme', { dark_mode: newMode === 'dark' });
      localStorage.setItem('chakra-ui-color-mode', newMode);
    } catch (e) {}
  };

  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor="dark-mode" mb="0">
        Mode sombre
      </FormLabel>
      <Switch id="dark-mode" isChecked={checked} onChange={handleChange} />
    </FormControl>
  );
}
