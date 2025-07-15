import { IconButton, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function DarkModeToggleButton({ userPref }) {
  const { colorMode, toggleColorMode } = useColorMode();

  const handleClick = async () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light';
    toggleColorMode();
    try {
      await axios.post('/account/theme', { dark_mode: newMode === 'dark' });
      localStorage.setItem('chakra-ui-color-mode', newMode);
    } catch (e) {}
  };

  return (
    <IconButton
      aria-label="Toggle dark mode"
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      variant="ghost"
      onClick={handleClick}
    />
  );
}
