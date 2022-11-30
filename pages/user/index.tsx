import {
    Anchor,
    Breadcrumbs,
    Button,
    Card,
    Divider,
    Group,
    Space,
    Tabs,
    Title,
} from "@mantine/core";
import { IconReportAnalytics, IconUser } from "@tabler/icons";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import CollateralsByUser from "../../components/CollateralsByUser";
import OffersByBuyer from "../../components/OffersByBuyer";
import OffersByUser from "../../components/OffersByUser";
import OwnershipsByUser from "../../components/OwnershipsByUser";
import { UserProfileInfo } from "../../components/UserProfileInfo";
import AuthContext from "../../context/AuthContext";

const User: NextPage = () => {
    const router = useRouter();

    const { logout } = useContext(AuthContext);

    const items = [
        { title: "Home", href: "/" },
        { title: "User", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    return (
        <>
            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <div className="d-flex  gap-3 mb-1 justify-content-between">
                <div className="d-flex gap-3 align-items-center">
                    <IconUser size={35} />
                    <Title order={2}>Meu perfil</Title>
                </div>
                <Button
                    variant="outline"
                    color={"red"}
                    onClick={() => {
                        logout(), router.push("/login");
                    }}
                >
                    Logout
                </Button>
            </div>

            <Space h="xl" />

            <Tabs defaultValue="profile">
                <Tabs.List>
                    <Tabs.Tab value="profile">Dados gerais</Tabs.Tab>
                    <Tabs.Tab value="ownership">Imóveis tokenizados</Tabs.Tab>
                    <Tabs.Tab value="collateral">Garantias</Tabs.Tab>
                    <Tabs.Tab value="offers">Ofertas abertas</Tabs.Tab>
                    <Tabs.Tab value="purchases">Compras realizadas</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="profile" pb="xs">
                    <Card withBorder radius={0}>
                        <UserProfileInfo />
                    </Card>
                </Tabs.Panel>
                <Tabs.Panel value="ownership" pb="xs">
                    <Card withBorder radius={0}>
                        <OwnershipsByUser />
                    </Card>
                </Tabs.Panel>
                <Tabs.Panel value="collateral" pb="xs">
                    <Card withBorder radius={0}>
                        <CollateralsByUser />
                    </Card>
                </Tabs.Panel>
                <Tabs.Panel value="offers" pb="xs">
                    <Card withBorder radius={0}>
                        <OffersByUser />
                    </Card>
                </Tabs.Panel>
                <Tabs.Panel value="purchases" pb="xs">
                    <Card withBorder radius={0}>
                        <OffersByBuyer />
                    </Card>
                </Tabs.Panel>
            </Tabs>
        </>
    );
};

export default User;
