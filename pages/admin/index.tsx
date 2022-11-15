import { Anchor, Breadcrumbs, Divider, Space, Title } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import CollateralsAdmin from "../../components/CollateralsAdmin";
import OffersAdmin from "../../components/OffersAdmin";
import TokenizationProposalAdmin from "../../components/TokenizationProposalAdmin";

const Admin: NextPage = () => {
    const items = [
        { title: "Home", href: "/" },
        { title: "Portal Admin", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    return (
        <>
            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <Title order={2}>Portal Admin</Title>

            <Space h="xl" />

            <TokenizationProposalAdmin />

            <OffersAdmin />

            <CollateralsAdmin />
        </>
    );
};

export default Admin;
