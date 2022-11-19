import {
    Anchor,
    Breadcrumbs,
    Button,
    Divider,
    Space,
    Tabs,
    Title,
    Text,
    Card,
} from "@mantine/core";
import { IconReportAnalytics } from "@tabler/icons";
import type { NextPage } from "next";
import Link from "next/link";
import CollateralsAdmin from "../../components/CollateralsAdmin";
import LoanPaymentAdmin from "../../components/LoanPaymentAdmin";
import OffersAdmin from "../../components/OffersAdmin";
import TokenizationProposalAdmin from "../../components/TokenizationProposalAdmin";
import TokenizedAssetsAdmin from "../../components/TokenizedAssetsAdmin";

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

            <div className="d-flex flex-column gap-3 mb-3">
                <div className="d-flex gap-3 align-items-center">
                    <IconReportAnalytics size={35} />
                    <Title order={2}>Portal Admin</Title>
                </div>
            </div>

            <Space h="xl" />

            <Tabs defaultValue="proposal">
                <Tabs.List>
                    <Tabs.Tab value="proposal">
                        Propostas de tokenização
                    </Tabs.Tab>
                    <Tabs.Tab value="offer">Pagamentos de ofertas</Tabs.Tab>
                    <Tabs.Tab value="collateral">Novas garantias</Tabs.Tab>
                    <Tabs.Tab value="loan-payment">
                        Quitações de empréstimos
                    </Tabs.Tab>
                    <Tabs.Tab value="assets">Imóveis tokenizados</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="proposal" pb="xs">
                    <Card withBorder radius={0}>
                        <TokenizationProposalAdmin />
                    </Card>
                </Tabs.Panel>
                <Tabs.Panel value="offer" pb="xs">
                    <Card withBorder radius={0}>
                        <OffersAdmin />
                    </Card>
                </Tabs.Panel>
                <Tabs.Panel value="collateral" pb="xs">
                    <Card withBorder radius={0}>
                        <CollateralsAdmin />
                    </Card>
                </Tabs.Panel>
                <Tabs.Panel value="loan-payment" pb="xs">
                    <Card withBorder radius={0}>
                        <LoanPaymentAdmin />
                    </Card>
                </Tabs.Panel>
                <Tabs.Panel value="assets" pb="xs">
                    <Card withBorder radius={0}>
                        <TokenizedAssetsAdmin />
                    </Card>
                </Tabs.Panel>
            </Tabs>
        </>
    );
};

export default Admin;
