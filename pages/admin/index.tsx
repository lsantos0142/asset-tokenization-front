import {
    Anchor,
    Breadcrumbs,
    Button,
    Divider,
    Space,
    Tabs,
    Title,
    Text,
} from "@mantine/core";
import { IconReportAnalytics } from "@tabler/icons";
import type { NextPage } from "next";
import Link from "next/link";
import CollateralsAdmin from "../../components/CollateralsAdmin";
import LoanPaymentAdmin from "../../components/LoanPaymentAdmin";
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

            <div className="d-flex flex-column gap-3 mb-1">
                <div className="d-flex gap-3 align-items-center">
                    <IconReportAnalytics size={35} />
                    <Title order={2}>Portal Admin</Title>
                </div>
            </div>

            <Space h="xl" />

            <Tabs defaultValue="proposal" inverted>
                <Tabs.List>
                    <Tabs.Tab value="proposal">
                        Propostas de tokenização
                    </Tabs.Tab>
                    <Tabs.Tab value="offer">Pagamentos de ofertas</Tabs.Tab>
                    <Tabs.Tab value="collateral">Novas garantias</Tabs.Tab>
                    <Tabs.Tab value="loan-payment">
                        Quitações de empréstimos
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="proposal" pb="xs">
                    <TokenizationProposalAdmin />
                </Tabs.Panel>
                <Tabs.Panel value="offer" pb="xs">
                    <OffersAdmin />
                </Tabs.Panel>
                <Tabs.Panel value="collateral" pb="xs">
                    <CollateralsAdmin />
                </Tabs.Panel>
                <Tabs.Panel value="loan-payment" pb="xs">
                    <LoanPaymentAdmin />
                </Tabs.Panel>
            </Tabs>
        </>
    );
};

export default Admin;
