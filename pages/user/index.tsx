import {
    Anchor,
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Grid,
    Group,
    Space,
    Text,
    Title,
} from "@mantine/core";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import OwnershipsByUser from "../../components/OwnershipsByUser";
import AuthContext from "../../context/AuthContext";

const User: NextPage = () => {
    const router = useRouter();

    const { user, logout, refresh } = useContext(AuthContext);
    const [walletAddress, setWalletAddress] = useState("");

    const requestAccount = async () => {
        if ((window as any).ethereum) {
            try {
                const accounts = await (window as any).ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0]);
                console.log(accounts[0]);
            } catch (error) {
                console.log("Error Connecting");
            }
        } else {
            console.log("No metamask");
        }
    };

    const handleConnectWallet = () => {
        axios
            .put(`${process.env.BACK}/users/${user.sub}/${walletAddress}`)
            .then((res) => {
                if (res.status === 200) {
                    refresh();
                }
            })
            .catch((e) => {});
    };

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
            <Group position="apart">
                <Breadcrumbs>{items}</Breadcrumbs>
                <Button
                    variant="outline"
                    color={"red"}
                    onClick={() => {
                        logout(), router.push("/login");
                    }}
                >
                    Logout
                </Button>
            </Group>

            <Divider my="xl" />

            {/* Conectar Carteira */}
            <Group position="apart">
                {user?.walletAddress ? (
                    <Box>
                        <Title order={2}>Carteira Conectada</Title>
                    </Box>
                ) : (
                    <Box>
                        <Title order={2}>Conectar Carteira</Title>
                    </Box>
                )}

                {user?.walletAddress ? (
                    <Box>
                        <Text size="xl">Endereço da Carteira: </Text>
                        <Text size="xl">{user?.walletAddress}</Text>
                    </Box>
                ) : walletAddress !== "" ? (
                    <Box>
                        <Text size="xl" color="yellow">
                            Carteira Metamask:{" "}
                        </Text>
                        <Text size="xl" color="yellow">
                            {walletAddress}
                        </Text>
                        <Space h="xl" />
                        <Button
                            variant="outline"
                            color="green"
                            onClick={handleConnectWallet}
                        >
                            Salvar Carteira
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button variant="outline" onClick={requestAccount}>
                            Conectar Metamask
                        </Button>
                    </Box>
                )}
            </Group>

            <Divider my="xl" />

            {/* Listar imóveis do usuário */}
            <OwnershipsByUser userId={user?.sub} />

            <Divider my="xl" />

            {/* Listar garantias do usuário */}
            <Title order={2}>Empréstimos</Title>
            <Grid justify="space-between">
                <Grid.Col span="content"></Grid.Col>
                <Grid.Col span="content"></Grid.Col>
            </Grid>
        </>
    );
};

export default User;
