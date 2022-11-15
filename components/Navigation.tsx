import { Center, Navbar, NavLink } from "@mantine/core";
import {
    IconBook,
    IconCash,
    IconCurrencyEthereum,
    IconHome2,
    IconReceipt,
    IconReportAnalytics,
    IconUser,
    IconUserCheck,
} from "@tabler/icons";
import Link from "next/link";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navigation: React.FC = () => {
    const { user } = useContext(AuthContext);

    return (
        <Navbar width={{ md: 200, lg: 250, base: 170 }} p="xl">
            <Navbar.Section>
                <NavLink
                    label={
                        <Link href={"/tokenization"}>
                            <div className="d-flex gap-3 align-items-center">
                                <IconCurrencyEthereum />
                                <Center>Tokenização</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    label={
                        <Link href={"/create-offer"}>
                            <div className="d-flex gap-3 align-items-center">
                                <IconCash />
                                <Center>Criar Oferta</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    label={
                        <Link href={"/marketplace"}>
                            <div className="d-flex gap-3 align-items-center">
                                <IconHome2 />
                                <Center>Marketplace</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    label={
                        <Link href={"/loan"}>
                            <div className="d-flex gap-3 align-items-center">
                                <IconBook />
                                <Center>Garantias de Empréstimos</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>
            <Navbar.Section grow>
                <NavLink
                    label={
                        <Link href={"/rent-payments"}>
                            <div className="d-flex gap-3 align-items-center">
                                <IconReceipt />
                                <Center>Pagamentos de aluguéis</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    label={
                        user ? (
                            <Link href={"/user"}>
                                <div className="d-flex gap-3 align-items-center">
                                    <IconUserCheck />
                                    <Center>{user.username}</Center>
                                </div>
                            </Link>
                        ) : (
                            <Link href={"/login"}>
                                <div className="d-flex gap-3 align-items-center">
                                    <IconUser />
                                    <Center>Login / Registro</Center>
                                </div>
                            </Link>
                        )
                    }
                />
            </Navbar.Section>

            {user?.isAdmin && (
                <Navbar.Section>
                    <NavLink
                        label={
                            <Link href={"/admin"}>
                                <div className="d-flex gap-3 align-items-center">
                                    <IconReportAnalytics />
                                    <Center>Portal Admin</Center>
                                </div>
                            </Link>
                        }
                    />
                </Navbar.Section>
            )}
        </Navbar>
    );
};

export default Navigation;
