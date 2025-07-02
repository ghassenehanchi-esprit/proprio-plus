import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Spacer,
    useDisclosure,
    IconButton,
    useColorModeValue,
    useBreakpointValue,
    Image
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import NotificationBell from "../UI/NotificationBell";
import { Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Navbar() {
    const { auth } = usePage().props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const [isScrolled, setIsScrolled] = useState(false);

    // 🔁 Scroll effect to reduce height and change background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const bg = useColorModeValue(isScrolled ? "gray.50" : "white", isScrolled ? "gray.700" : "gray.800");
    const shadow = isScrolled ? "md" : "sm";
    const height = isScrolled ? "60px" : "80px";
    const transition = "all 0.3s ease";

    return (
        <Flex
            as="nav"
            bg={bg}
            boxShadow={shadow}
            p={4}
            align="center"
            zIndex={20}
            position="sticky"
            top="0"
            transition={transition}
            h={height}
        >
            <Link href="/">
                <Image
                    src="/logo.png"
                    alt="Logo PRIMO"
                    height={isScrolled ? "30px" : "40px"}
                    transition="height 0.3s ease"
                    objectFit="contain"
                />
            </Link>

            <Spacer />

            {auth?.user ? (
                <>
                {auth.isAdmin && (
                    <Button as={Link} href="/admin/users" mr={4}>Admin</Button>
                )}
                <NotificationBell />
                <Menu>
                    <MenuButton as={Button} variant="ghost" rightIcon={<HamburgerIcon />}>
                        <Avatar size="sm" name={auth.user.first_name} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem as={Link} href="/favorites">Favoris</MenuItem>
                        <MenuItem as={Link} href="/messages">Messages</MenuItem>
                        <MenuItem as={Link} href="/profile">Profil</MenuItem>
                        <MenuItem as={Link} href={route('account.settings')}>Paramètres du compte</MenuItem>
                        <MenuItem as={Link} href="/logout" method="post">Déconnexion</MenuItem>
                    </MenuList>
                </Menu>
                </>
            ) : (
                isMobile ? (
                    <Menu>
                        <MenuButton as={IconButton} icon={<HamburgerIcon />} variant="ghost" />
                        <MenuList>
                            <MenuItem as={Link} href="/login">Se connecter</MenuItem>
                            <MenuItem as={Link} href="/register">S’inscrire</MenuItem>
                        </MenuList>
                    </Menu>
                ) : (
                    <Flex gap={2}>
                        <Link href="/login"><Button variant="ghost">Se connecter</Button></Link>
                        <Link href="/register"><Button colorScheme="orange">S’inscrire</Button></Link>
                    </Flex>
                )
            )}
        </Flex>
    );
}
