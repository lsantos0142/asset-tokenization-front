import {
    Anchor,
    AppShell,
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Header,
    Navbar,
    Space,
    Title,
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

            <Title order={2}>Criar Oferta</Title>

            <Space h="xl" />
        </>
    );
};

export default CreateOffer;
