import {
    Anchor,
    AppShell,
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Header,
    Navbar,
} from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";

const CreateOffer: NextPage = () => {
    const items = [
        { title: "Home", href: "/" },
        { title: "Criar Oferta", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));
    return (
        <>
            <Breadcrumbs>{items}</Breadcrumbs>
            <Divider my="xl" />
            <Box>Criar Oferta</Box>
        </>
    );
};

export default CreateOffer;
