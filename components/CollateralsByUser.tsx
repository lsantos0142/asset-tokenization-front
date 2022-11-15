import {
    Text,
    Badge,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    Space,
    Title,
} from "@mantine/core";
import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { formatDate } from "../helpers/FormatDate";
import { Collateral } from "../types/Collateral";
import { User } from "../types/User";

type CollateralsByUserProps = {
    userId?: string;
};

const CollateralsByUser: NextPage<CollateralsByUserProps> = ({ userId }) => {
    const [collaterals, setCollaterals] = useState<Collateral[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);

    const getAllCollaterals = useCallback(() => {
        axios
            .get(
                `${process.env.BACK}/tokenized-asset/collateral/get-by-user/${userId}?status=ACTIVE`,
            )
            .then((res) => {
                setCollaterals(res.data);
            })
            .catch((e) => {
                console.log(e.response?.data?.message);
            });
    }, [userId]);

    useEffect(() => {
        getAllCollaterals();
    }, [getAllCollaterals]);

    const getAllUsers = () => {
        axios
            .get(`${process.env.BACK}/users`)
            .then((res) => {
                setAllUsers(res.data);
            })
            .catch((e) => {
                console.log(e.response?.data?.message);
            });
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const getBankUsername = (collateral: Collateral) => {
        console.log(collateral);

        return allUsers.filter(
            (user) => user.walletAddress === collateral.bankWallet,
        )[0]?.username;
    };

    return (
        <>
            <Group position="apart">
                <Title order={2}>Empréstimos</Title>
                <Button
                    variant="outline"
                    color={"blue"}
                    onClick={getAllCollaterals}
                >
                    Atualizar Empréstimos
                </Button>
            </Group>

            <Space h="xl" />
            {!collaterals?.length ? (
                <Text>Você não possui empréstimos ativos.</Text>
            ) : (
                <Grid gutter={30}>
                    {collaterals.map((collateral) => {
                        return (
                            <Grid.Col key={collateral.id} md={6} lg={4} xl={3}>
                                <Card shadow="sm" p="lg" radius="lg" withBorder>
                                    <Group position="apart" mb="xs">
                                        <Text size={22} weight={500}>
                                            {
                                                collateral.ownership
                                                    .tokenizedAsset?.address
                                            }
                                        </Text>
                                        {collateral?.ownership
                                            .isEffectiveOwner && (
                                            <Badge
                                                color="green"
                                                variant="light"
                                            >
                                                Dono
                                            </Badge>
                                        )}
                                    </Group>

                                    <Space h="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Número do Registro</Text>
                                        <Text>
                                            {
                                                collateral.ownership
                                                    .tokenizedAsset
                                                    ?.registration
                                            }
                                        </Text>
                                    </Group>

                                    <Divider size="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Mutuante</Text>
                                        <Text>
                                            {getBankUsername(collateral)}
                                        </Text>
                                    </Group>

                                    <Divider size="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Porcentagem em Garantia</Text>
                                        <Text>
                                            {collateral.percentage * 100} %
                                        </Text>
                                    </Group>

                                    <Divider size="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Data de expiração</Text>
                                        <Text>
                                            {formatDate.format(
                                                new Date(
                                                    collateral.expirationDate,
                                                ),
                                            )}
                                        </Text>
                                    </Group>
                                </Card>
                            </Grid.Col>
                        );
                    })}
                </Grid>
            )}
        </>
    );
};

export default CollateralsByUser;
