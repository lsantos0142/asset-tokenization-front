import { Anchor, Box, Breadcrumbs, Divider, Space, Title } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";

const Loan: NextPage = () => {
    const items = [
        { title: "Home", href: "/" },
        { title: "Empréstimo", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));
    return (
        <>
            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <Title order={2}>Empréstimo</Title>

            <Space h="xl" />
        </>
    );
};

export default Loan;
