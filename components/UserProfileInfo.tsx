import { Button, Card, Text, Title } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import formatCPF from "../helpers/FormatCPF";
import { User } from "../types/User";
import Web3 from "web3";

export function UserProfileInfo() {
    const [walletAddress, setWalletAddress] = useState("");
    const [userInfo, setUserInfo] = useState<User>();

    const { user, refresh } = useContext(AuthContext);

    const requestAccount = async () => {
        if ((window as any).ethereum) {
            try {
                const accounts = await (window as any).ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(Web3.utils.toChecksumAddress(accounts[0]));
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("No metamask");
        }
    };

    const getUser = useCallback(async () => {
        try {
            const { data } = await axios.get<User>(
                `${process.env.NEXT_PUBLIC_BACK}/users/${user.sub}`,
            );

            setUserInfo(data);
        } catch (e) {
            console.error(e);
        }
    }, [user]);

    const handleConnectWallet = useCallback(async () => {
        try {
            const { status } = await axios.put(
                `${process.env.NEXT_PUBLIC_BACK}/users/${user.sub}/${walletAddress}`,
            );
            if (status === 200) refresh();
        } catch (e) {
            console.error(e);
        }
    }, [refresh, user, walletAddress]);

    useEffect(() => {
        if (!user?.sub) return;
        getUser();
    }, [getUser, user]);

    return (
        <>
            <div className="d-flex flex-column gap-2 mt-4 mb-5">
                <Title order={3}>Dados gerais</Title>
                <Text size={20}>Gerencie os seus dados de cadastro.</Text>
            </div>

            <Card
                withBorder
                radius="md"
                shadow="sm"
                className="d-flex flex-column gap-4"
            >
                <div className="w-75 d-flex justify-content-between flex-wrap mt-2">
                    <div className="d-flex flex-column gap-2 mb-3">
                        <Text size={20} weight={"bold"}>
                            Nome
                        </Text>
                        <Text size={20}>{userInfo?.name}</Text>
                    </div>

                    <div className="d-flex flex-column gap-2">
                        <Text size={20} weight={"bold"}>
                            Usuário
                        </Text>
                        <Text size={20}>{userInfo?.username}</Text>
                    </div>

                    <div className="d-flex flex-column gap-2">
                        <Text size={20} weight={"bold"}>
                            CPF
                        </Text>
                        <Text size={20}>{formatCPF(userInfo?.cpf)}</Text>
                    </div>
                </div>

                <div className="d-flex flex-column gap-3">
                    <Text size={20} weight={"bold"}>
                        Carteira digital
                    </Text>

                    {user?.walletAddress ? (
                        <Text size={20}>{user?.walletAddress}</Text>
                    ) : (
                        <>
                            {!!walletAddress ? (
                                <>
                                    <div className="d-flex gap-2">
                                        <Text size={17}>
                                            Carteira encontrada:
                                        </Text>
                                        <Text size={17}>{walletAddress}</Text>
                                    </div>
                                    <div className="d-flex gap-3 mt-1">
                                        <Button
                                            style={{ width: "40px" }}
                                            color="green"
                                            className="p-0"
                                            onClick={handleConnectWallet}
                                        >
                                            <div>
                                                <IconCheck />
                                            </div>
                                        </Button>
                                        <Button
                                            style={{ width: "40px" }}
                                            color="red"
                                            className="p-0"
                                            onClick={() => setWalletAddress("")}
                                        >
                                            <div>
                                                <IconX />
                                            </div>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Button
                                        style={{ width: "fit-content" }}
                                        color={"orange"}
                                        onClick={requestAccount}
                                    >
                                        Conectar carteira via Metamask
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </Card>
        </>
    );
}
