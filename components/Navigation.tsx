import { Anchor, Button, Center, Navbar, NavLink } from "@mantine/core";
import Link from "next/link";

const Navigation: React.FC = () => {


    return (
        <Navbar width={{ base: 250 }} height={"90%"} p="xl">
            <Navbar.Section>
                <NavLink label={<Link href={"/tokenization"}><Center>Tokenização</Center></Link>} />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink label={<Link href={"/offer"}><Center>Criar Oferta</Center></Link>} />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink label={<Link href={"/marketplace"}><Center>Marketplace</Center></Link>} />
            </Navbar.Section>

            <Navbar.Section grow>
                <NavLink label={<Link href={"/loan"}><Center>Empréstimo</Center></Link>} />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink label={<Link href={"/user"}><Center>Usuário</Center></Link>} />
            </Navbar.Section>
        </Navbar>
    );
};

export default Navigation;
