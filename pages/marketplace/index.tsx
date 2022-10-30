import { Anchor, Breadcrumbs, Divider, Space, Title } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";

const Marketplace: NextPage = () => {
    const items = [
        { title: "Home", href: "/" },
        { title: "Marketplace", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));
    return (
        <>
            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <Title order={2}>Marketplace</Title>

            <Space h="xl" />
        </>
    );
};

export default Marketplace;
