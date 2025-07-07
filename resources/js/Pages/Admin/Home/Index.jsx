import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Select,
  Button,
} from '@chakra-ui/react';
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
        datasets: [{ data: Object.values(statusData), backgroundColor: '#3182ce' }]
      },
      options: { plugins: { legend: { display: false } } }
    });

    const catCtx = document.getElementById('categoryChart').getContext('2d');
    if (categoryChart.current) categoryChart.current.destroy();
    categoryChart.current = new window.Chart(catCtx, {
      type: 'pie',
      data: {
        labels: Object.entries(categories).map(([_, name]) => name),
        datasets: [{ data: Object.values(categoryData) }]
      }
    });
  }, [statusData, categoryData]);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

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
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={8}>
        <Stat>
          <StatLabel>Utilisateurs</StatLabel>
          <StatNumber>{stats.users}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Annonces</StatLabel>
          <StatNumber>{stats.listings}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Annonces actives</StatLabel>
          <StatNumber>{stats.active_listings}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Signalements</StatLabel>
          <StatNumber>{stats.reports}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Signalements en attente</StatLabel>
          <StatNumber>{stats.pending_reports}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Pages</StatLabel>
          <StatNumber>{stats.pages}</StatNumber>
        </Stat>
      </SimpleGrid>
      <Box mb={8}>
        <Heading size="md" mb={4}>Annonces par statut</Heading>
        <canvas id="statusChart" height="200" />
      </Box>
      <Box>
        <Heading size="md" mb={4}>Annonces par catégorie</Heading>
        <canvas id="categoryChart" height="200" />
      </Box>
    </Box>
  );
}

Index.layout = (page) => <AdminLayout>{page}</AdminLayout>;
