import { Anchor, Button, Center, Navbar, NavLink } from "@mantine/core";
import Link from "next/link";

const Navigation: React.FC = () => {
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

            <Navbar.Section grow>
                <NavLink
                    label={
                        <Link href={"/loan"}>
                            <Center>Empréstimo</Center>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    label={
                        <Link href={"/user"}>
                            <Center>Usuário</Center>
                        </Link>
                    }
                />
            </Navbar.Section>
        </Navbar>
    );
};

export default Navigation;
