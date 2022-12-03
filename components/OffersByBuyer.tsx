import {
    Badge,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    Space,
    Text,
    Title,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import formatCPF from "../helpers/FormatCPF";
import { formatNumber } from "../helpers/FormatCurrencyBRL";
import { Offer } from "../types/Offer";
import { AddReceiptModal } from "./AddReceiptModal";

const OffersByBuyer: NextPage = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const { user } = useContext(AuthContext);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer>();

    const getUserOffers = useCallback(() => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/offer/get-by-buyer/${user.sub}`,
            )
            .then((res) => {
                setOffers(res.data?.filter((o: Offer) => !!o.ownership));
            })
            .catch((e) => {
                console.log(e.response?.data?.message);
            });
    }, [user]);

    useEffect(() => {
        if (!user?.sub) return;
        getUserOffers();
    }, [getUserOffers, user]);

    return (
        <>
            <AddReceiptModal
                setShowModal={setShowReceiptModal}
                showModal={showReceiptModal}
                selectedOffer={selectedOffer}
                getUserOffers={getUserOffers}
            />
            <div className="d-flex flex-column gap-2 mt-4 mb-5">
                <Title order={3}>Compras realizadas no Marketplace</Title>
                <div className="d-flex gap-2 align-items-center justify-content-between">
                    <Text size={20}>
                        Gerencie suas compras realizadas no Marketplace.
                    </Text>
                    <Button
                        variant="outline"
                        color={"blue"}
                        onClick={getUserOffers}
                    >
                        <IconRefresh />
                    </Button>
                </div>
            </div>

            {!!offers?.length ? (
                <Grid gutter={30}>
                    {offers.map((offer) => {
                        return (
                            <Grid.Col md={6} xl={4} key={offer.id}>
                                <Card shadow="sm" p="lg" radius="lg" withBorder>
                                    <Text size={22} weight={500}>
                                        {
                                            offer.ownership?.tokenizedAsset
                                                ?.address
                                        }
                                    </Text>

                                    {offer.status === 1 && (
                                        <Badge
                                            color="pink"
                                            variant="light"
                                            mt="md"
                                        >
                                            Esperando Pagamento
                                        </Badge>
                                    )}
                                    {offer.status === 2 && (
                                        <Badge
                                            color="green"
                                            variant="light"
                                            mt="md"
                                        >
                                            Paga
                                        </Badge>
                                    )}

                                    <Space h="xs" />
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
                                        <Text>Valor da Oferta</Text>
                                        <Text>
                                            {formatNumber.format(offer?.amount)}
                                        </Text>
                                    </Group>
                                    <Divider size="xs" />
                                    <Group position="apart" my="xs">
                                        <Text>
                                            Porcentagem do Imóvel em Oferta
                                        </Text>
                                        <Text>{offer?.percentage * 100} %</Text>
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
                                        <Text>Nome do Vendedor</Text>
                                        <Text>
                                            {offer?.ownership?.user?.name}
                                        </Text>
                                    </Group>

                                    <Divider size="xs" />
                                    <Group position="apart" my="xs">
                                        <Text>Comprovante de pagamento</Text>
                                        <Text>
                                            {offer?.receipt
                                                ? offer.receipt
                                                : "-"}
                                        </Text>
                                    </Group>

                                    <div className="mt-4">
                                        <Button
                                            className="text-center"
                                            variant="outline"
                                            color={"green"}
                                            onClick={() => {
                                                setShowReceiptModal(true);
                                                setSelectedOffer(offer);
                                            }}
                                        >
                                            {!offer.receipt
                                                ? "Adicionar comprovante"
                                                : "Editar comprovante"}
                                        </Button>
                                    </div>
                                </Card>
                            </Grid.Col>
                        );
                    })}
                </Grid>
            ) : (
                <Text size={20} className="my-3 text-center">
                    Você ainda não realizou nenhuma compra no Marketplace.
                </Text>
            )}
        </>
    );
};

export default OffersByBuyer;
