import { useForm } from '@inertiajs/react';
import useErrorAlert from '@/hooks/useErrorAlert';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Paper,
  Title,
  Container,
  Button,
} from '@mantine/core';
import { MantineProvider } from '@mantine/core';

export default function AdminLogin() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useErrorAlert(errors);

  const submit = (e) => {
    e.preventDefault();
    post('/admin/login');
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" mb="md">
        Connexion administrateur
      </Title>
      <Paper withBorder shadow="md" p="md">
        <form onSubmit={submit}>
          <TextInput
            label="Email"
            placeholder="Votre email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            error={errors.email}
            required
          />
          <PasswordInput
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            error={errors.password}
            mt="md"
            required
          />
          <Checkbox
            label="Se souvenir de moi"
            checked={data.remember}
            onChange={(e) => setData('remember', e.currentTarget.checked)}
            mt="md"
          />
          <Button fullWidth mt="xl" type="submit" loading={processing}>
            Se connecter
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

AdminLogin.layout = page => <MantineProvider>{page}</MantineProvider>;
