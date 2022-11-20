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

const OffersByUser: NextPage = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const { user } = useContext(AuthContext);

    const getUserOffers = useCallback(() => {
        axios
            .get(
                `${process.env.BACK}/tokenized-asset/offer/get-by-user/${user.sub}`,
            )
            .then((res) => {
                setOffers(res.data);
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
            <div className="d-flex flex-column gap-2 mt-4 mb-5">
                <Title order={3}>Ofertas abertas no Marketplace</Title>
                <div className="d-flex gap-2 align-items-center justify-content-between">
                    <Text size={20}>
                        Gerencie as suas ofertas criadas no Marketplace.
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

                                    {offer.status === 0 && (
                                        <Badge
                                            color="green"
                                            variant="light"
                                            mt="md"
                                        >
                                            Em aberto
                                        </Badge>
                                    )}
                                    {offer.status === 1 && (
                                        <Badge
                                            color="pink"
                                            variant="light"
                                            mt="md"
                                        >
                                            Esperando Pagamento
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
                                        <Text>Usuário Comprador</Text>
                                        <Text>
                                            {offer?.currentBuyer?.username ??
                                                "-"}
                                        </Text>
                                    </Group>
                                    <Divider size="xs" />
                                    <Group position="apart" my="xs">
                                        <Text>Nome do Comprador</Text>
                                        <Text>
                                            {offer?.currentBuyer?.name ?? "-"}
                                        </Text>
                                    </Group>
                                    <Divider size="xs" />
                                    <Group position="apart" my="xs">
                                        <Text>CPF do Comprador</Text>
                                        <Text>
                                            {offer?.currentBuyer?.cpf
                                                ? formatCPF(
                                                      offer.currentBuyer.cpf,
                                                  )
                                                : "-"}
                                        </Text>
                                    </Group>
                                </Card>
                            </Grid.Col>
                        );
                    })}
                </Grid>
            ) : (
                <Text size={20} className="my-3 text-center">
                    Você não possui ofertas abertas ou aguardando pagamento.
                </Text>
            )}
        </>
    );
};

export default OffersByUser;
