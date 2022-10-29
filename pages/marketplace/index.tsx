import { Anchor, Box, Breadcrumbs, Divider } from "@mantine/core";
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
            <Box>Marketplace</Box>
        </>
    );
};

export default Marketplace;
