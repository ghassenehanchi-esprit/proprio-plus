
import { useForm } from '@inertiajs/react';
import {
    Box,
    Heading,
    Input,
    Button,
    VStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Flex,
    Image,
    Text
} from '@chakra-ui/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <Flex minH="100vh">
            {/* Left side form */}
            <Box flex="1" p={10} bg="white" display="flex" flexDirection="column" justifyContent="center">
                <Image src="/logo.png" alt="Logo" mb={6} w="150px" />
                <Heading size="lg" mb={6}>Créer votre compte</Heading>
                <form onSubmit={submit}>
                    <VStack spacing={4}>
                        <FormControl isInvalid={errors.first_name}>
                            <Input
                                name="first_name"
                                placeholder="Prénom"
                                bg="gray.50"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                            />
                            <FormErrorMessage>{errors.first_name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.last_name}>
                            <Input
                                name="last_name"
                                placeholder="Nom"
                                bg="gray.50"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                            />
                            <FormErrorMessage>{errors.last_name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.phone}>
                            <Input
                                name="phone"
                                placeholder="Téléphone"
                                bg="gray.50"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <FormErrorMessage>{errors.phone}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.email}>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Adresse email"
                                bg="gray.50"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.password}>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Mot de passe"
                                bg="gray.50"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.password_confirmation}>
                            <Input
                                name="password_confirmation"
                                type="password"
                                placeholder="Confirmez le mot de passe"
                                bg="gray.50"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <FormErrorMessage>{errors.password_confirmation}</FormErrorMessage>
                        </FormControl>

                        <Button colorScheme="orange" width="full" type="submit" isLoading={processing}>
                            Créer mon compte
                        </Button>
                    </VStack>
                </form>
                <Text mt={6} fontSize="sm">
                    Vous avez déjà un compte ? <a href="/login" style={{ color: "#ED8936" }}>Se connecter</a>
                </Text>
            </Box>

            {/* Right image side */}
            <Box flex="1" bgImage="url('/images/auth-back.png')" bgSize="cover" bgPos="center" />
        </Flex>
    );
}
