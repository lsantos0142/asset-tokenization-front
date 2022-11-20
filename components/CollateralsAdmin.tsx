import {
    Badge,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    Modal,
    Space,
    Text,
    Title,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconRefresh, IconX } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { formatDate } from "../helpers/FormatDate";
import { Collateral } from "../types/Collateral";
import { User } from "../types/User";

const CollateralsAdmin: NextPage = () => {
    const [collaterals, setCollaterals] = useState<Collateral[]>([]);
    const [openedRejectModal, setOpenedRejectModal] = useState<boolean>(false);
    const [openedConfirmModal, setOpenedConfirmModal] =
        useState<boolean>(false);
    const [selectedCollateralId, setSelectedCollateralId] =
        useState<string>("");
    const [allUsers, setAllUsers] = useState<User[]>([]);

    const getAllPendingCollaterals = () => {
        axios
            .get(
                `${process.env.BACK}/tokenized-asset/collateral/get-all?status=PENDING_CONFIRMATION`,
            )
            .then((res) => {
                setCollaterals(res.data);
            })
            .catch((e) => {
                console.log(e.response?.data?.message);
            });
    };

    const handleRejectCollateral = () => {
        showNotification({
            id: "reject_collateral_" + selectedCollateralId,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Rejeitando Empréstimo</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        axios
            .put(
                `${process.env.BACK}/tokenized-asset/collateral/reject/${selectedCollateralId}`,
            )
            .then((res) => {
                getAllPendingCollaterals();
                updateNotification({
                    id: "reject_collateral_" + selectedCollateralId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconCheck size={16} />,
                    color: "green",
                    title: <Text size="xl">Empréstimo Rejeitado</Text>,
                    message: (
                        <Text size="xl">Empréstimo rejeitado com sucesso</Text>
                    ),
                });
            })
            .catch((e) => {
                updateNotification({
                    id: "reject_collateral_" + selectedCollateralId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconX size={16} />,
                    color: "red",
                    title: (
                        <Text size="xl">Erro na Rejeição do Empréstimo</Text>
                    ),
                    message: <Text size="xl">{e.response?.data?.message}</Text>,
                });
            });
    };

    const handleConfirmCollateral = () => {
        showNotification({
            id: "confirm_collateral_" + selectedCollateralId,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Confirmando Empréstimo</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        axios
            .put(
                `${process.env.BACK}/tokenized-asset/collateral/validate/${selectedCollateralId}`,
            )
            .then((res) => {
                getAllPendingCollaterals();
                updateNotification({
                    id: "confirm_collateral_" + selectedCollateralId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconCheck size={16} />,
                    color: "green",
                    title: <Text size="xl">Empréstimo Confirmado</Text>,
                    message: (
                        <Text size="xl">Empréstimo confirmado com sucesso</Text>
                    ),
                });
            })
            .catch((e) => {
                updateNotification({
                    id: "confirm_collateral_" + selectedCollateralId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconX size={16} />,
                    color: "red",
                    title: (
                        <Text size="xl">Erro na Confimação do Empréstimo</Text>
                    ),
                    message: <Text size="xl">{e.response?.data?.message}</Text>,
                });
            });
    };

    useEffect(() => {
        getAllPendingCollaterals();
    }, []);

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
        return allUsers.filter(
            (user) => user.walletAddress === collateral.bankWallet,
        )[0]?.username;
    };

    return (
        <>
            <Modal
                centered
                opened={openedRejectModal}
                onClose={() => setOpenedRejectModal(false)}
                title={
                    <Title order={3}>Deseja Rejeitar Este Empréstimo?</Title>
                }
            >
                <Group position="apart">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={() => setOpenedRejectModal(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="outline"
                        color="red"
                        onClick={() => {
                            handleRejectCollateral();
                            setOpenedRejectModal(false);
                        }}
                    >
                        Rejeitar
                    </Button>
                </Group>
            </Modal>

            <Modal
                centered
                opened={openedConfirmModal}
                onClose={() => setOpenedConfirmModal(false)}
                title={
                    <Title order={3}>Deseja Confirmar Este Empréstimo?</Title>
                }
            >
                <Group position="apart">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={() => setOpenedConfirmModal(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="outline"
                        color="green"
                        onClick={() => {
                            handleConfirmCollateral();
                            setOpenedConfirmModal(false);
                        }}
                    >
                        Confirmar
                    </Button>
                </Group>
            </Modal>

            <div className="d-flex flex-column gap-2 mt-4 mb-5">
                <Title order={3}>
                    Validação de novas garantias de empréstimo
                </Title>
                <div className="d-flex gap-5 align-items-center justify-content-between">
                    <Text size={20}>
                        Gerencie as novas garantias cadastradas pelos usuários
                        no portal. Caso uma garantia tenha sido de fato acordada
                        entre as partes envolvidas e esteja com os dados
                        corretos, valide a criação em seu respectivo card.
                    </Text>
                    <Button
                        variant="outline"
                        color={"blue"}
                        onClick={getAllPendingCollaterals}
                    >
                        <IconRefresh />
                    </Button>
                </div>
            </div>
            {!!collaterals?.length ? (
                <Grid gutter={30}>
                    {collaterals.map((collateral) => {
                        return (
                            <Grid.Col md={6} xl={4} key={collateral.id}>
                                <Card shadow="sm" p="lg" radius="lg" withBorder>
                                    <Text size={22} weight={500}>
                                        {
                                            collateral.ownership?.tokenizedAsset
                                                ?.address
                                        }
                                    </Text>

                                    <Badge color="pink" variant="light" mt="md">
                                        Esperando Confirmação
                                    </Badge>

                                    <Space h="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Usuário Mutuário</Text>
                                        <Text>
                                            {
                                                collateral.ownership.user
                                                    ?.username!
                                            }
                                        </Text>
                                    </Group>

                                    <Divider size="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Usuário Mutuante</Text>
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
                                        <Text>
                                            Data de Expiração do Empréstimo
                                        </Text>
                                        <Text>
                                            {formatDate.format(
                                                new Date(
                                                    collateral.expirationDate,
                                                ),
                                            )}
                                        </Text>
                                    </Group>

                                    <Divider size="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>
                                            Número de Registro do Imóvel
                                        </Text>
                                        <Text>
                                            {
                                                collateral?.ownership
                                                    ?.tokenizedAsset
                                                    ?.registration
                                            }
                                        </Text>
                                    </Group>

                                    <Space h="xl" />

                                    <Group position="apart" my="xs">
                                        <Button
                                            variant="outline"
                                            color="red"
                                            onClick={() => {
                                                setOpenedRejectModal(true);
                                                setSelectedCollateralId(
                                                    collateral?.id,
                                                );
                                            }}
                                        >
                                            Rejeitar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            color="green"
                                            onClick={() => {
                                                setOpenedConfirmModal(true);
                                                setSelectedCollateralId(
                                                    collateral?.id,
                                                );
                                            }}
                                        >
                                            Confirmar
                                        </Button>
                                    </Group>
                                </Card>
                            </Grid.Col>
                        );
                    })}
                </Grid>
            ) : (
                <Text size={20} className="my-3 text-center">
                    Nenhuma garantia pendente de validação.
                </Text>
            )}
        </>
    );
};

export default CollateralsAdmin;
