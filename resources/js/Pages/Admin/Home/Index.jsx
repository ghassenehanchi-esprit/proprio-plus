import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Select,
  Button,
  Icon,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import {
  FaUsers,
  FaHome,
  FaCheckCircle,
  FaFlag,
  FaFileAlt,
  FaListUl,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import AdminLayout from '@/Components/Admin/AdminLayout';

export default function Index({ stats: initialStats = {}, listingStatus = {}, categories = {} }) {
  const [stats, setStats] = useState(initialStats);
  const [statusData, setStatusData] = useState(listingStatus);
  const [categoryData, setCategoryData] = useState({});
  const [filters, setFilters] = useState({ status: '', category_id: '' });
  const statusChart = useRef(null);
  const categoryChart = useRef(null);
  const cardBg = useColorModeValue('white', 'gray.800');
  const chartColors = ['#2a6ab2', '#ff6384', '#ff9f40', '#4bc0c0', '#9966ff', '#36a2eb'];

  const fetchData = async () => {
    const { data } = await axios.get(route('admin.dashboard.data'), { params: filters });
    setStats(data.stats);
    setStatusData(data.listingStatus);
    setCategoryData(data.listingCategories);
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!window.Chart) return;

    const statusCtx = document.getElementById('statusChart').getContext('2d');
    if (statusChart.current) statusChart.current.destroy();
    statusChart.current = new window.Chart(statusCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(statusData),
        datasets: [
          {
            data: Object.values(statusData),
            backgroundColor: chartColors[0],
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    const catCtx = document.getElementById('categoryChart').getContext('2d');
    if (categoryChart.current) categoryChart.current.destroy();
    categoryChart.current = new window.Chart(catCtx, {
      type: 'pie',
      data: {
        labels: Object.entries(categories).map(([_, name]) => name),
        datasets: [
          {
            data: Object.values(categoryData),
            backgroundColor: chartColors,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      },
    });
  }, [statusData, categoryData]);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const MotionBox = motion(Box);
  const StatLinkCard = ({ icon, label, value, href }) => (
    <ChakraLink as={Link} href={href} _hover={{ textDecoration: 'none' }}>
      <MotionBox
        bg={cardBg}
        p={4}
        rounded="md"
        shadow="md"
        display="flex"
        alignItems="center"
        gap={3}
        whileHover={{ scale: 1.05 }}
      >
        <Icon as={icon} boxSize={5} color="brand.600" />
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber>{value}</StatNumber>
        </Stat>
      </MotionBox>
    </ChakraLink>
  );

  return (
    <Box>
      <Heading size="lg" mb={6}>Tableau de bord</Heading>
      <Box as="form" onSubmit={handleSubmit} mb={4} display="flex" gap={2} flexWrap="wrap">
        <Select name="status" placeholder="Statut" value={filters.status} onChange={handleChange} w="200px">
          <option value="">Tous</option>
          {Object.keys(listingStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Select name="category_id" placeholder="Catégorie" value={filters.category_id} onChange={handleChange} w="200px">
          <option value="">Toutes</option>
          {Object.entries(categories).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </Select>
        <Button type="submit">Filtrer</Button>
      </Box>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} mb={8}>
        <StatLinkCard icon={FaUsers} label="Utilisateurs" value={stats.users} href={route('admin.users.index')} />
        <StatLinkCard icon={FaUsers} label="En attente" value={stats.pending_users} href={`${route('admin.users.index')}?status=en_attente`} />
        <StatLinkCard icon={FaCheckCircle} label="Certifiés" value={stats.verified_users} href={`${route('admin.users.index')}?status=certifié`} />
        <StatLinkCard icon={FaListUl} label="En ligne" value={stats.online_users} href={`${route('admin.users.index')}?online=1`} />
        <StatLinkCard icon={FaHome} label="Annonces" value={stats.listings} href={route('admin.listings.index')} />
        <StatLinkCard icon={FaHome} label="En attente" value={stats.pending_listings} href={`${route('admin.listings.index')}?status=pending`} />
        <StatLinkCard icon={FaHome} label="Vendues" value={stats.sold_listings} href={`${route('admin.listings.index')}?status=vendue`} />
        <StatLinkCard icon={FaCheckCircle} label="Actives" value={stats.active_listings} href={`${route('admin.listings.index')}?status=active`} />
        <StatLinkCard icon={FaFlag} label="Signalements" value={stats.reports} href={route('admin.reports.index')} />
        <StatLinkCard icon={FaFlag} label="Signalements en attente" value={stats.pending_reports} href={`${route('admin.reports.index')}?status=pending`} />
        <StatLinkCard icon={FaFileAlt} label="Pages" value={stats.pages} href={route('admin.pages.index')} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Box bg={cardBg} p={4} rounded="md" shadow="md">
          <Heading size="md" mb={4}>Annonces par statut</Heading>
          <Box h="300px">
            <canvas id="statusChart" />
          </Box>
        </Box>
        <Box bg={cardBg} p={4} rounded="md" shadow="md">
          <Heading size="md" mb={4}>Annonces par catégorie</Heading>
          <Box h="300px">
            <canvas id="categoryChart" />
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
