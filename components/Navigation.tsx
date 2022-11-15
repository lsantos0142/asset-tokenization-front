import { Anchor, Button, Center, Navbar, NavLink } from "@mantine/core";
import Link from "next/link";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navigation: React.FC = () => {
    const { user } = useContext(AuthContext);

    return (
        <Navbar width={{ md: 200, lg: 250, base: 170 }} p="xl">
            <Navbar.Section>
                <NavLink
                    label={
                        <Link href={"/tokenization"}>
                            <Center>Tokenização</Center>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    label={
                        <Link href={"/createOffer"}>
                            <Center>Criar Oferta</Center>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    label={
                        <Link href={"/marketplace"}>
                            <Center>Marketplace</Center>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    label={
                        <Link href={"/loan"}>
                            <Center sx={{ textAlign: "center" }}>
                                Garantias de Empréstimos
                            </Center>
                        </Link>
                    }
                />
            </Navbar.Section>
            <Navbar.Section grow>
                <NavLink
                    label={
                        <Link href={"/rent-payments"}>
                            <Center>Pagamentos de aluguéis</Center>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    label={
                        user ? (
                            <Link href={"/user"}>
                                <Center>{user.username}</Center>
                            </Link>
                        ) : (
                            <Link href={"/login"}>
                                <Center>Fazer Login/Registrar</Center>
                            </Link>
                        )
                    }
                />
            </Navbar.Section>

            {user?.isAdmin ? (
                <Navbar.Section>
                    <NavLink
                        label={
                            <Link href={"/admin"}>
                                <Center>Portal Admin</Center>
                            </Link>
                        }
                    />
                </Navbar.Section>
            ) : null}
        </Navbar>
    );
};

export default Navigation;
