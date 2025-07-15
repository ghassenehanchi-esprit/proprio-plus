
import {
  Box,
  TextInput,
  Button,
  Group,
  Popover,
  RangeSlider,
  Checkbox,
  Text,
  Stack,
  Autocomplete
} from '@mantine/core';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SearchBarMantine() {
  const { data, setData, get } = useForm({
    city: '',
    postal_code: '',
    min_price: 0,
    max_price: 1000000,
    min_surface: 0,
    max_surface: 500,
    rooms: '',
    bedrooms: '',
    has_terrace: false,
    has_parking: false,
    lat: '',
    lng: '',
  });

  const [addressOptions, setAddressOptions] = useState([]);
  const [popoverOpened, setPopoverOpened] = useState(false);

  useEffect(() => {
    if (data.city.length > 2) {
        axios.get(`https://nominatim.openstreetmap.org/search?country=france&city=${data.city}&format=json`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'ImmoConnect/1.0'
            }
        });
    }
  }, [data.city]);

  const handleAddressSelect = (val) => {
    const selected = addressOptions.find(opt => opt.value === val);
    if (selected) {
      setData('lat', selected.lat);
      setData('lng', selected.lon);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    get('/listings');
  };

  return (
    <Box maw={1000} mx="auto" p="md" bg="surface" radius="md" shadow="md">
      <form onSubmit={handleSubmit}>
        <Stack spacing="sm">
          <Autocomplete
            label="Adresse ou ville"
            placeholder="Ex: Paris, Marseille..."
            data={addressOptions}
            value={data.city}
            onChange={(val) => {
              setData('city', val);
              handleAddressSelect(val);
            }}
          />

          <Group grow>
            <RangeSlider
              labelAlwaysOn
              label={(val) => String(val) + "€"}
              min={0}
              max={1000000}
              step={10000}
              defaultValue={[data.min_price, data.max_price]}
              onChange={([min, max]) => {
                setData('min_price', min);
                setData('max_price', max);
              }}
            />
            <RangeSlider
              labelAlwaysOn
                label={(val) => String(val) + " m²"}
              min={0}
              max={500}
              step={10}
              defaultValue={[data.min_surface, data.max_surface]}
              onChange={([min, max]) => {
                setData('min_surface', min);
                setData('max_surface', max);
              }}
            />
          </Group>

          <Popover opened={popoverOpened} onChange={setPopoverOpened} width={300} position="bottom">
            <Popover.Target>
              <Button variant="outline" color="gray" onClick={() => setPopoverOpened((o) => !o)}>
                Filtres avancés
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Stack spacing="xs">
                <TextInput
                  label="Nombre de pièces min"
                  value={data.rooms}
                  onChange={(e) => setData('rooms', e.currentTarget.value)}
                />
                <TextInput
                  label="Nombre de chambres min"
                  value={data.bedrooms}
                  onChange={(e) => setData('bedrooms', e.currentTarget.value)}
                />
                <Checkbox
                  label="Terrasse"
                  checked={data.has_terrace}
                  onChange={(e) => setData('has_terrace', e.currentTarget.checked)}
                />
                <Checkbox
                  label="Parking"
                  checked={data.has_parking}
                  onChange={(e) => setData('has_parking', e.currentTarget.checked)}
                />
              </Stack>
            </Popover.Dropdown>
          </Popover>

          <Button type="submit" color="blue" fullWidth mt="md">
            Rechercher
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
