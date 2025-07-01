import { useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Flex,
    Heading,
    Image,
    Input,
    Text,
    VStack,
    Divider
} from "@chakra-ui/react";
import { Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <Flex height="100vh" bg="gray.50">
            <Flex flex={1} justify="center" align="center" bg="white">
                <Box w="full" maxW="md" p={8}>
                    <Flex justify="center" mb={6}>
                        <Image src="/logo.png" alt="Logo" height="50px" />
                    </Flex>
                    <Heading size="lg" mb={6} textAlign="center">Bienvenue</Heading>

                    <form onSubmit={submit}>
                        <VStack spacing={4}>
                            <Input
                                name="email"
                                placeholder="Veuillez entrer votre adresse e-mail"
                                bg="gray.100"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <Input
                                name="password"
                                type="password"
                                placeholder="Veuillez entrer votre mot de passe"
                                bg="gray.100"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
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
