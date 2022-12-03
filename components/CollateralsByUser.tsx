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
import { IconCheck, IconRefresh, IconX } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { formatDate } from "../helpers/FormatDate";
import { Collateral } from "../types/Collateral";
import { User } from "../types/User";

const CollateralsByUser: NextPage = () => {
    const [collaterals, setCollaterals] = useState<Collateral[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    const [selectedCollateralId, setSelectedCollateralId] =
        useState<string>("");
    const { user } = useContext(AuthContext);

    const getAllCollaterals = useCallback(() => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/collateral/get-by-user/${user?.sub}?status=ACTIVE`,
            )
            .then((res) => {
                setCollaterals(res.data);
            })
            .catch((e) => {
                console.log(e.response?.data?.message);
            });
    }, [user]);

    useEffect(() => {
        getAllCollaterals();
    }, [getAllCollaterals]);

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
                    `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/collateral/register-loan-payment/${selectedCollateralId}`,
                )
                .then((res) => {
                    setShowSuccessModal(true);
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
                centered
                size={540}
                opened={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={
                    <Title size={23} order={3}>
                        Sucesso!
                    </Title>
                }
            >
                <Text size={22} className="my-5">
                    O imóvel será desalienado assim que a quitação do empréstimo
                    for validada pelo administrador.
                </Text>
                <div className="text-center mt-1">
                    <Button
                        size="md"
                        onClick={() => setShowSuccessModal(false)}
                        color="dark"
                    >
                        Confirmar
                    </Button>
                </div>
            </Modal>

            <Modal
                size="auto"
                centered
                opened={showModal}
                onClose={() => setShowModal(false)}
                title={
                    <Title order={3}>
                        {`Deseja registrar a quitação do empréstimo?`}
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

            <div className="d-flex flex-column gap-2 mt-4 mb-5">
                <Title order={3}>Garantias de empréstimos</Title>
                <div className="d-flex gap-3 align-items-center justify-content-between">
                    <Text size={20}>
                        Visualize as garantias de empréstimos associadas aos
                        seus imóveis tokenizados.
                    </Text>
                    <Button
                        variant="outline"
                        color={"blue"}
                        onClick={getAllCollaterals}
                    >
                        <IconRefresh />
                    </Button>
                </div>
            </div>

            {!collaterals?.length ? (
                <Text size={20} className="my-3 text-center">
                    Você não possui garantias de empréstimos ativas.
                </Text>
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
                                        Quitar empréstimo
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
