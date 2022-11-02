import { Anchor, Breadcrumbs, Divider, Space, Title } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import MarketplaceOffers from "../../components/MarketplaceOffers";

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

            <MarketplaceOffers />
        </>
    );
};

export default Marketplace;
