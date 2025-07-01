import { Box, IconButton, Badge } from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';
import { Link, usePage } from '@inertiajs/react';

export default function NotificationBell() {
  const { unreadNotifications = 0 } = usePage().props;
  return (
    <Box position="relative" mr={2}>
      <IconButton
        as={Link}
        href="/messages"
        icon={<BellIcon />}
        variant="ghost"
        aria-label="Notifications"
      />
      {unreadNotifications > 0 && (
        <Badge position="absolute" top="0" right="0" bg="brand.500" color="white" borderRadius="full">
          {unreadNotifications}
        </Badge>
      )}
    </Box>
  );
}
