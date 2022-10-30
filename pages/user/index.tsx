import {
    Anchor,
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Title,
    Grid,
    Space,
    Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import jwtDecode from "jwt-decode";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Login from "../login";

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
            <Grid justify="space-between">
                <Grid.Col span="content">
                    <Breadcrumbs>{items}</Breadcrumbs>
                </Grid.Col>
                <Grid.Col span="content">
                    <Button
                        ml="auto"
                        color={"red"}
                        onClick={() => {
                            logout(), router.push("/login");
                        }}
                    >
                        Logout
                    </Button>
                </Grid.Col>
            </Grid>

            <Divider my="xl" />

            {/* Conectar Carteira */}
            <Grid justify="space-between">
                <Grid.Col span="content">
                    {user?.walletAddress ? (
                        <Box>
                            <Title order={2}>Carteira Conectada</Title>
                        </Box>
                    ) : (
                        <Box>
                            <Title order={2}>Conectar Carteira</Title>
                        </Box>
                    )}
                </Grid.Col>
                <Grid.Col span="content">
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
                            <Button color="green" onClick={handleConnectWallet}>
                                Salvar Carteira
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Button onClick={requestAccount}>
                                Conectar Metamask
                            </Button>
                        </Box>
                    )}
                </Grid.Col>
            </Grid>

            <Divider my="xl" />

            {/* Listar imóveis do usuário */}
            <Title order={2}>Imóveis Tokenizados</Title>
            <Grid justify="space-between">
                <Grid.Col span="content"></Grid.Col>
                <Grid.Col span="content"></Grid.Col>
            </Grid>

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
