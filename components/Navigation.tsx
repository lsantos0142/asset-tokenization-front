import { Center, Navbar, NavLink } from "@mantine/core";
import {
    IconBook,
    IconCash,
    IconCurrencyEthereum,
    IconHome2,
    IconReceipt,
    IconReportAnalytics,
    IconUser,
} from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navigation: React.FC = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    if (!user) return <></>;

    return (
        <Navbar width={{ md: 200, lg: 250, base: 170 }}>
            <Navbar.Section>
                <NavLink
                    py={0}
                    active={router.pathname.includes("marketplace")}
                    label={
                        <Link href={"/marketplace"}>
                            <div className="py-3 d-flex gap-3 align-items-center">
                                <div>
                                    <IconHome2 />
                                </div>
                                <Center>Marketplace</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    py={0}
                    active={router.pathname.includes("tokenization")}
                    label={
                        <Link href={"/tokenization"}>
                            <div className="py-3 d-flex gap-3 align-items-center">
                                <div>
                                    <IconCurrencyEthereum />
                                </div>
                                <Center>Tokenização</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    py={0}
                    active={router.pathname.includes("create-offer")}
                    label={
                        <Link href={"/create-offer"}>
                            <div className="py-3 d-flex gap-3 align-items-center">
                                <div>
                                    <IconCash />
                                </div>
                                <Center>Criar Oferta</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    py={0}
                    active={router.pathname.includes("loan")}
                    label={
                        <Link href={"/loan"}>
                            <div className="py-3 d-flex gap-3 align-items-center">
                                <div>
                                    <IconBook />
                                </div>
                                <Center>Criar garantia</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>
            <Navbar.Section grow>
                <NavLink
                    py={0}
                    active={router.pathname.includes("rent-payments")}
                    label={
                        <Link href={"/rent-payments"}>
                            <div className="py-3 d-flex gap-3 align-items-center">
                                <div>
                                    <IconReceipt />
                                </div>
                                <Center>Pagamentos de aluguéis</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>

            <Navbar.Section>
                <NavLink
                    py={0}
                    active={router.pathname.includes("/user")}
                    label={
                        <Link href={"/user"}>
                            <div className="py-3 d-flex gap-3 align-items-center">
                                <div>
                                    <IconUser />
                                </div>
                                <Center>{user.username}</Center>
                            </div>
                        </Link>
                    }
                />
            </Navbar.Section>

            {user?.isAdmin && (
                <Navbar.Section>
                    <NavLink
                        py={0}
                        active={router.pathname.includes("/admin")}
                        label={
                            <Link href={"/admin"}>
                                <div className="py-3 d-flex gap-3 align-items-center">
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
