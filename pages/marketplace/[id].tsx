import { Anchor, Breadcrumbs, Divider, Grid, Title } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const OfferDetails: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const items = [
        { title: "Home", href: "/" },
        { title: "Marketplace", href: "/marketplace/" },
        { title: id, href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    return (
        <>
            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <Title order={1}>Oferta #{id}</Title>
        </>
    );
};

export default OfferDetails;
