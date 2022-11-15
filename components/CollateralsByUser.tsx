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
    Modal,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
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
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedCollateralId, setSelectedCollateralId] =
        useState<string>("");

    const getAllCollaterals = useCallback(() => {
        axios
            .get(
                `${process.env.BACK}/tokenized-asset/collateral/get-by-user/${userId}?status=ACTIVE`,
            )
            .then((res) => {
                setCollaterals(res.data);
            })
            .catch((e) => {
                console.log(e.response.data.message);
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
                console.log(e.response.data.message);
            });
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const getBankUsername = (collateral: Collateral) => {
        return allUsers.filter(
            (user) => user.walletAddress === collateral.bankWallet,
        )[0]?.username;
    };

    const handleConfirmLoanPayment = () => {
        showNotification({
            id: "register_loan_payment_" + selectedCollateralId,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Registrando Pagamento do Empréstimo</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        setTimeout(() => {
            axios
                .put(
                    `${process.env.BACK}/tokenized-asset/collateral/register-loan-payment/${selectedCollateralId}`,
                )
                .then((res) => {
                    getAllCollaterals();
                    updateNotification({
                        id: "register_loan_payment_" + selectedCollateralId,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconCheck size={16} />,
                        color: "green",
                        title: <Text size="xl">Pagamento Registrado</Text>,
                        message: (
                            <Text size="xl">
                                Pagamento registrado com sucesso
                            </Text>
                        ),
                    });
                })
                .catch((e) => {
                    updateNotification({
                        id: "register_loan_payment_" + selectedCollateralId,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconX size={16} />,
                        color: "red",
                        title: (
                            <Text size="xl">Erro no registro do pagamento</Text>
                        ),
                        message: (
                            <Text size="xl">{e.response.data.message}</Text>
                        ),
                    });
                });
        }, 1000);
    };

    return (
        <>
            <Modal
                size="auto"
                centered
                opened={showModal}
                onClose={() => setShowModal(false)}
                title={
                    <Title order={3}>
                        {`Deseja registrar o pagamento do empréstimo?`}
                    </Title>
                }
            >
                <Group position="apart">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={() => setShowModal(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="outline"
                        color="green"
                        type="submit"
                        onClick={() => {
                            setShowModal(false);
                            handleConfirmLoanPayment();
                        }}
                    >
                        Sim, registrar
                    </Button>
                </Group>
            </Modal>

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

                                    <Space h="xs" />

                                    <Button
                                        variant="outline"
                                        color="green"
                                        onClick={() => {
                                            setShowModal(true);
                                            setSelectedCollateralId(
                                                collateral.id,
                                            );
                                        }}
                                    >
                                        Pagar empréstimo
                                    </Button>
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
