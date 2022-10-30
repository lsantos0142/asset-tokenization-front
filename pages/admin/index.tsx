import { Anchor, Box, Breadcrumbs, Divider, Space, Title } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const Admin: NextPage = () => {
    const { user } = useContext(AuthContext);

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
        </>
    );
};

export default Admin;
