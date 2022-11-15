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
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import formatCPF from "../helpers/FormatCPF";
import { formatNumber } from "../helpers/FormatCurrencyBRL";
import { Offer } from "../types/Offer";

const OffersAdmin: NextPage = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [openedRejectModal, setOpenedRejectModal] = useState<boolean>(false);
    const [openedConfirmModal, setOpenedConfirmModal] =
        useState<boolean>(false);
    const [selectedOfferId, setSelectedOfferId] = useState<string>("");

    const getAllWaitingPaymentOffers = () => {
        axios
            .get(
                `${process.env.BACK}/tokenized-asset/offer/get-all?status=WAITING_PAYMENT`,
            )
            .then((res) => {
                setOffers(res.data);
            })
            .catch((e) => {
                console.log(e.response?.data?.message);
            });
    };

    const handleRejectOfferPayment = () => {
        showNotification({
            id: "reject_offer_payment" + selectedOfferId,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Rejeitando Proposta</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        axios
            .put(
                `${process.env.BACK}/tokenized-asset/offer/reject-payment/${selectedOfferId}`,
            )
            .then((res) => {
                getAllWaitingPaymentOffers();
                updateNotification({
                    id: "reject_offer_payment" + selectedOfferId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconCheck size={16} />,
                    color: "green",
                    title: <Text size="xl">Tokenização Rejeitada</Text>,
                    message: (
                        <Text size="xl">Tokenização rejeitada com sucesso</Text>
                    ),
                });
            })
            .catch((e) => {
                updateNotification({
                    id: "reject_offer_payment" + selectedOfferId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconX size={16} />,
                    color: "red",
                    title: (
                        <Text size="xl">Erro na Rejeição da Tokenização</Text>
                    ),
                    message: <Text size="xl">{e.response?.data?.message}</Text>,
                });
            });
    };

    const handleConfirmOfferPayment = () => {
        showNotification({
            id: "confirm_offer_payment" + selectedOfferId,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Confirmando Pagamento da Oferta</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        axios
            .put(
                `${process.env.BACK}/tokenized-asset/offer/validate-payment/${selectedOfferId}`,
            )
            .then((res) => {
                getAllWaitingPaymentOffers();
                updateNotification({
                    id: "confirm_offer_payment" + selectedOfferId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconCheck size={16} />,
                    color: "green",
                    title: (
                        <Text size="xl">Pagamento da Oferta Confirmado</Text>
                    ),
                    message: (
                        <Text size="xl">
                            Pagamento da oferta confirmado com sucesso
                        </Text>
                    ),
                });
            })
            .catch((e) => {
                updateNotification({
                    id: "confirm_offer_payment" + selectedOfferId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconX size={16} />,
                    color: "red",
                    title: (
                        <Text size="xl">
                            Erro na Confimação do Pagamento da Oferta
                        </Text>
                    ),
                    message: <Text size="xl">{e.response?.data?.message}</Text>,
                });
            });
    };

    useEffect(() => {
        getAllWaitingPaymentOffers();
    }, []);

    return (
        <>
            <Modal
                centered
                opened={openedRejectModal}
                onClose={() => setOpenedRejectModal(false)}
                title={
                    <Title order={3}>
                        Deseja Rejeitar o Pagamento Desta Oferta?
                    </Title>
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
                            handleRejectOfferPayment();
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
                    <Title order={3}>
                        Deseja Confirmar o Pagamento Desta Oferta?
                    </Title>
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
                            handleConfirmOfferPayment();
                            setOpenedConfirmModal(false);
                        }}
                    >
                        Confirmar
                    </Button>
                </Group>
            </Modal>

            <Group position="apart">
                <Title order={3}>
                    Ofertas Esperando Confirmação de Pagamento
                </Title>
                <Button
                    variant="outline"
                    color={"blue"}
                    onClick={getAllWaitingPaymentOffers}
                >
                    Atualizar Ofertas
                </Button>
            </Group>

            <Space h="xl" />

            <Grid gutter={30}>
                {offers.map((offer) => {
                    return (
                        <Grid.Col md={6} xl={4} key={offer.id}>
                            <Card shadow="sm" p="lg" radius="lg" withBorder>
                                <Text size={22} weight={500}>
                                    {offer.ownership?.tokenizedAsset?.address}
                                </Text>

                                <Badge color="pink" variant="light" mt="md">
                                    Esperando Pagamento
                                </Badge>

                                <Space h="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Usuário Comprador</Text>
                                    <Text>{offer?.currentBuyer?.username}</Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>CPF do Comprador</Text>
                                    <Text>
                                        {offer?.currentBuyer?.cpf
                                            ? formatCPF(
                                                  offer?.currentBuyer?.cpf,
                                              )
                                            : null}
                                    </Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Nome do Comprador</Text>
                                    <Text>{offer?.currentBuyer?.name}</Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Usuário Vendedor</Text>
                                    <Text>
                                        {offer?.ownership?.user?.username}
                                    </Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>CPF do Vendedor</Text>
                                    <Text>
                                        {offer?.ownership?.user?.cpf
                                            ? formatCPF(
                                                  offer?.ownership?.user?.cpf,
                                              )
                                            : null}
                                    </Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Nome do Vendedor</Text>
                                    <Text>{offer?.ownership?.user?.name}</Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Número de Registro</Text>
                                    <Text>
                                        {
                                            offer?.ownership?.tokenizedAsset
                                                ?.registration
                                        }
                                    </Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Porcentagem do Imóvel em Oferta</Text>
                                    <Text>{offer?.percentage * 100} %</Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Valor da Oferta</Text>
                                    <Text>
                                        {formatNumber.format(offer?.amount)}
                                    </Text>
                                </Group>

                                <Space h="xl" />

                                <Group position="apart" my="xs">
                                    <Button
                                        variant="outline"
                                        color="red"
                                        onClick={() => {
                                            setOpenedRejectModal(true);
                                            setSelectedOfferId(offer?.id);
                                        }}
                                    >
                                        Rejeitar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        color="green"
                                        onClick={() => {
                                            setOpenedConfirmModal(true);
                                            setSelectedOfferId(offer?.id);
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

            <Divider my="xl" />
        </>
    );
};

export default OffersAdmin;
