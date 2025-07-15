import { useForm } from '@inertiajs/react';
import useErrorAlert from '@/hooks/useErrorAlert';
import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Input,
    Text,
    VStack,
    Divider,
    FormControl,
    FormErrorMessage,
    useColorModeValue
} from "@chakra-ui/react";
import { Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useErrorAlert(errors);

    const logoSrc = useColorModeValue('/logo.png', '/logo - blanc.png');

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <Flex height="100vh" bg="surfaceSubtle">
            <Flex flex={1} justify="center" align="center" bg="surface">
                <Box w="full" maxW="md" p={8}>
                    <Flex justify="center" mb={6}>
                        <Image src={logoSrc} alt="Logo" height="50px" />
                    </Flex>
                    <Heading size="lg" mb={6} textAlign="center">Bienvenue</Heading>

                    <form onSubmit={submit}>
                        <VStack spacing={4} align="stretch">
                            <FormControl isInvalid={errors.email}>
                                <Input
                                    name="email"
                                    placeholder="Veuillez entrer votre adresse e-mail"
                                    bg="inputBg"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.password}>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Veuillez entrer votre mot de passe"
                                    bg="inputBg"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <FormErrorMessage>{errors.password}</FormErrorMessage>
                            </FormControl>
                            <Flex align="center" gap={2}>
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label htmlFor="remember">Se souvenir de moi</label>
                            </Flex>
                            <Button
                                colorScheme="orange"
                                size="lg"
                                w="full"
                                type="submit"
                                isLoading={processing}
                            >
                                Se connecter
                            </Button>
                        </VStack>
                    </form>

                    <Divider my={6} />

                    <Text fontSize="sm" textAlign="center">
                        Pas encore de compte ?{' '}
                        <Link href="/register">
                            <Button variant="link" colorScheme="orange" size="sm">Créer un compte</Button>
                        </Link>
                    </Text>
                </Box>
            </Flex>

            <Box
                flex={1}
                display={{ base: "none", md: "block" }}
                backgroundImage="/images/auth-back.png"
                backgroundSize="cover"
                backgroundPosition="center"
            />
        </Flex>
    );
}
