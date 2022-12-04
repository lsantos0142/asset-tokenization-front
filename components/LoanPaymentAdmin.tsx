import {
    Text,
    Button,
    Card,
    Divider,
    Group,
    Space,
    Title,
    Badge,
    Grid,
    Modal,
    Loader,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconRefresh, IconX } from "@tabler/icons";
import axios from "axios";
import { cp } from "fs";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import formatCPF from "../helpers/FormatCPF";
import { formatNumber } from "../helpers/FormatCurrencyBRL";
import { formatDate } from "../helpers/FormatDate";
import { Collateral } from "../types/Collateral";
import { User } from "../types/User";

const LoanPaymentAdmin: NextPage = () => {
    const [collaterals, setCollaterals] = useState<Collateral[]>([]);
    const [openedSeizeCollateralModal, setOpenedSeizeCollateralModal] =
        useState<boolean>(false);
    const [openedConfirmLoanPaymentModal, setOpenedConfirmLoanPaymentModal] =
        useState<boolean>(false);
    const [selectedCollateralId, setSelectedCollateralId] =
        useState<string>("");
    const [allUsers, setAllUsers] = useState<User[]>([]);

    const selectedCollateral = collaterals.find(
        (o) => o?.id === selectedCollateralId,
    );

    const getAllPendingCollaterals = () => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/collateral/get-all?status=AWAITING_LOAN_PAYMENT_VALIDATION`,
            )
            .then((res) => {
                let c = res.data;
                axios
                    .get(
                        `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/collateral/get-all?status=ACTIVE`,
                    )
                    .then((r) => {
                        c.push(...r.data);
                        setCollaterals(c);
                    })
                    .catch((e) => {
                        console.log(e.response?.data?.message);
                    });
            })
            .catch((e) => {
                console.log(e.response?.data?.message);
            });
    };

    const handleConfirmLoanPayment = () => {
        let body = {
            bankUserId: getBankId(selectedCollateral!),
            ownerUserId: selectedCollateral?.ownership.user?.id,
            collateralShares: Number(selectedCollateral?.percentage),
            expirationDateISOString: selectedCollateral?.expirationDate,
            contractAddress:
                selectedCollateral?.ownership.tokenizedAsset?.contractAddress,
        };

        showNotification({
            id: "seize_collateral_" + selectedCollateralId,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Confirmando Pagamento do Empréstimo</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        axios
            .delete(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/collateral/delete`,
                {
                    headers: { ContentType: "application/json" },
                    data: body,
                },
            )
            .then((res) => {
                getAllPendingCollaterals();
                updateNotification({
                    id: "seize_collateral_" + selectedCollateralId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconCheck size={16} />,
                    color: "green",
                    title: (
                        <Text size="xl">
                            Pagamento do Empréstimo Confirmado
                        </Text>
                    ),
                    message: (
                        <Text size="xl">
                            Pagamento do empréstimo confirmado com sucesso
                        </Text>
                    ),
                });
            })
            .catch((e) => {
                updateNotification({
                    id: "seize_collateral_" + selectedCollateralId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconX size={16} />,
                    color: "red",
                    title: (
                        <Text size="xl">
                            Erro na Confirmação do Pagamento do Empréstimo
                        </Text>
                    ),
                    message: <Text size="xl">{e.response.data.message}</Text>,
                });
            });
    };

    const handleSeizeCollateral = () => {
        let body = {
            bankUserId: getBankId(selectedCollateral!),
            ownerUserId: selectedCollateral?.ownership.user?.id,
            collateralShares: Number(selectedCollateral?.percentage),
            expirationDateISOString: selectedCollateral?.expirationDate,
            contractAddress:
                selectedCollateral?.ownership.tokenizedAsset?.contractAddress,
            isOwnershipTransfer: false,
        };

        showNotification({
            id: "seize_collateral_" + selectedCollateralId,
            disallowClose: true,
            autoClose: false,
            title: (
                <Text size="xl">Confirmando Tomada de Posse da Garantia</Text>
            ),
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        axios
            .put(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/collateral/seize/${selectedCollateralId}`,
                body,
            )
            .then((res) => {
                getAllPendingCollaterals();
                updateNotification({
                    id: "seize_collateral_" + selectedCollateralId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconCheck size={16} />,
                    color: "green",
                    title: (
                        <Text size="xl">
                            Tomada de Posse da Garantia Confirmada
                        </Text>
                    ),
                    message: (
                        <Text size="xl">
                            Tomada de posse da garantia confirmada com sucesso
                        </Text>
                    ),
                });
            })
            .catch((e) => {
                updateNotification({
                    id: "seize_collateral_" + selectedCollateralId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconX size={16} />,
                    color: "red",
                    title: (
                        <Text size="xl">
                            Erro na Tomada de Posse da Garantia
                        </Text>
                    ),
                    message: <Text size="xl">{e.response.data.message}</Text>,
                });
            });
    };

    useEffect(() => {
        getAllPendingCollaterals();
    }, []);

    const getAllUsers = () => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BACK}/users`)
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

    const getBankId = (collateral: Collateral) => {
        return allUsers.filter(
            (user) => user.walletAddress === collateral.bankWallet,
        )[0]?.id;
    };

    return (
        <>
            <Modal
                centered
                opened={openedSeizeCollateralModal}
                onClose={() => setOpenedSeizeCollateralModal(false)}
                title={
                    <Title order={3}>
                        Deseja Registrar a Tomada de Posse da Garantia?
                    </Title>
                }
            >
                <Group position="apart">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={() => setOpenedSeizeCollateralModal(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="outline"
                        color="red"
                        onClick={() => {
                            handleSeizeCollateral();
                            setOpenedSeizeCollateralModal(false);
                        }}
                    >
                        Registrar
                    </Button>
                </Group>
            </Modal>

            <Modal
                centered
                opened={openedConfirmLoanPaymentModal}
                onClose={() => setOpenedConfirmLoanPaymentModal(false)}
                title={
                    <Title order={3}>
                        Deseja Confirmar o Pagamento Deste Empréstimo?
                    </Title>
                }
            >
                <Group position="apart">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={() => setOpenedConfirmLoanPaymentModal(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="outline"
                        color="green"
                        onClick={() => {
                            handleConfirmLoanPayment();
                            setOpenedConfirmLoanPaymentModal(false);
                        }}
                    >
                        Confirmar
                    </Button>
                </Group>
            </Modal>

            <div className="d-flex flex-column gap-2 mt-4 mb-5">
                <Title order={3}>
                    Empréstimos Esperando Confirmação de Pagamento
                </Title>
                <div className="d-flex gap-5 align-items-center justify-content-between">
                    <Text size={20}>
                        Valide os pagamentos de empréstimos com imóveis
                        tokenizados como garantia. Caso o pagamento tenha sido
                        feito, confirme para desalienar o imóvel da operação,
                        caso contrário, se a data de expiração for atingida,
                        confirme a tomada da garantia pelo banco.
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
                                        Esperando Confirmação de Pagamento
                                    </Badge>

                                    <Space h="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Usuário Devedor</Text>
                                        <Text>
                                            {
                                                collateral.ownership.user
                                                    ?.username!
                                            }
                                        </Text>
                                    </Group>

                                    <Divider size="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Usuário Credor</Text>
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
                                            disabled={
                                                new Date(
                                                    collateral.expirationDate,
                                                ) > new Date()
                                            }
                                            color="red"
                                            onClick={() => {
                                                setOpenedSeizeCollateralModal(
                                                    true,
                                                );
                                                setSelectedCollateralId(
                                                    collateral?.id,
                                                );
                                            }}
                                        >
                                            Tomada de posse
                                        </Button>
                                        <Button
                                            variant="outline"
                                            color="green"
                                            disabled={collateral.status === 1}
                                            onClick={() => {
                                                setOpenedConfirmLoanPaymentModal(
                                                    true,
                                                );
                                                setSelectedCollateralId(
                                                    collateral?.id,
                                                );
                                            }}
                                        >
                                            Confirmar Pagamento
                                        </Button>
                                    </Group>
                                </Card>
                            </Grid.Col>
                        );
                    })}
                </Grid>
            ) : (
                <Text size={20} className="my-3 text-center">
                    Nenhuma pagamento de empréstimo pendente de validação.
                </Text>
            )}
        </>
    );
};

export default LoanPaymentAdmin;
