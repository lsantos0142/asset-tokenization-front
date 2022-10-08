import { Anchor, Button, Center, Navbar, NavLink } from "@mantine/core";
import Link from "next/link";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navigation: React.FC = () => {
    const { user } = useContext(AuthContext);
    return (
        <Navbar width={{ base: 250 }} height={"90%"} p="xl">
            <Navbar.Section>
                <NavLink
                    sx={{ margin: 0, padding: "0.5em 0" }}
                    label={
                        <Link href={"/tokenization"}>
                            <Center>Tokenização</Center>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    sx={{ margin: 0, padding: "0.5em 0" }}
                    label={
                        <Link href={"/createOffer"}>
                            <Center>Criar Oferta</Center>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    sx={{ margin: 0, padding: "0.5em 0" }}
                    label={
                        <Link href={"/marketplace"}>
                            <Center>Marketplace</Center>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section grow>
                <NavLink
                    sx={{ margin: 0, padding: "0.5em 0" }}
                    label={
                        <Link href={"/loan"}>
                            <Center>Empréstimo</Center>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    sx={{ margin: 0, padding: "0.5em 0" }}
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
        </Navbar>
    );
};

export default Navigation;
