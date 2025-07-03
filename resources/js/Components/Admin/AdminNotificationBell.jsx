import { ActionIcon, Indicator, Menu, Text } from '@mantine/core';
import { FaBell } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminNotificationBell() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await axios.get('/admin/notifications');
      setNotifications(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const markAsRead = async (id) => {
    await axios.post(`/admin/notifications/${id}/read`);
    setNotifications((ns) =>
      ns.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  return (
    <Menu shadow="md" width={250}>
      <Menu.Target>
        <Indicator color="red" disabled={unreadCount === 0} label={unreadCount} size={16}>
          <ActionIcon variant="subtle" size="lg">
            <FaBell />
          </ActionIcon>
        </Indicator>
      </Menu.Target>
      <Menu.Dropdown>
        {notifications.length === 0 ? (
          <Menu.Item>Aucune notification</Menu.Item>
        ) : (
          notifications.map((n) => (
            <Menu.Item
              key={n.id}
              onClick={() => markAsRead(n.id)}
              color={n.read_at ? undefined : 'blue'}
            >
              <Text size="sm">Nouvelle demande de certification de {n.data.name}</Text>
            </Menu.Item>
          ))
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
