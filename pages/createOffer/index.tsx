import {
    Anchor,
    Text,
    Breadcrumbs,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    Space,
    Title,
    Badge,
    Modal,
    NumberInput,
    Stack,
    Checkbox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Ownership } from "../../types/Ownership";

const CreateOffer: NextPage = () => {
    const { user } = useContext(AuthContext);

    const [ownerships, setOwnerships] = useState<Ownership[]>([]);
    const [selectedOwnershipId, setSelectedOwnershipId] = useState<string>("");
    const [openedModal, setOpenedModal] = useState<boolean>(false);

    const getAllOwnerships = useCallback(() => {
        axios
            .get(
                `${process.env.BACK}/tokenized-asset/ownership/get-by-user/${user?.sub}`,
            )
            .then((res) => {
                setOwnerships(res.data);
            })
            .catch((e) => {
                console.log(e.response.data.message);
            });
    }, [user]);

    useEffect(() => {
        getAllOwnerships();
    }, [getAllOwnerships]);

    const createOfferForm = useForm({
        initialValues: {
            percentage: 0.0,
            amount: 0,
            isEffectiveTransfer: false,
            ownershipId: "",
        },

        validate: {
            percentage: (value) =>
                !value
                    ? "Campo Obrigatório"
                    : value > selectedOwnership?.percentageOwned! * 100
                    ? "Porcentagem maior do que a que possui"
                    : null,
            amount: (value) => (!value ? "Campo Obrigatório" : null),
        },
    });

    const handleCreateOffer = (values: typeof createOfferForm.values) => {
        values.ownershipId = selectedOwnershipId;
        values.percentage = values.percentage / 100;
        setOpenedModal(false);
        createOfferForm.reset();

        showNotification({
            id: "create_offer_" + values.ownershipId + "_" + values.amount,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Criando Proposta</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        setTimeout(() => {
            axios
                .post(
                    `${process.env.BACK}/tokenized-asset/offer/create`,
                    values,
                )
                .then((res) => {
                    updateNotification({
                        id:
                            "create_offer_" +
                            values.ownershipId +
                            "_" +
                            values.amount,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconCheck size={16} />,
                        color: "green",
                        title: <Text size="xl">Oferta Criada</Text>,
                        message: (
                            <Text size="xl">Oferta criada com sucesso</Text>
                        ),
                    });
                })
                .catch((e) => {
                    console.log(e);
                    updateNotification({
                        id:
                            "create_offer_" +
                            values.ownershipId +
                            "_" +
                            values.amount,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconX size={16} />,
                        color: "red",
                        title: <Text size="xl">Erro na Criação da Oferta</Text>,
                        message: (
                            <Text size="xl">{e.response.data.message}</Text>
                        ),
                    });
                });
        }, 2000);
    };

    const items = [
        { title: "Home", href: "/" },
        { title: "Criar Oferta", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    const selectedOwnership = ownerships.find(
        (o) => o?.id === selectedOwnershipId,
    );

    return (
        <>
            <Modal
                size="auto"
                centered
                opened={openedModal}
                onClose={() => setOpenedModal(false)}
                title={
                    <Title order={3}>
                        Criar oferta do imóvel{" "}
                        {selectedOwnership?.tokenizedAsset?.registration}
                    </Title>
                }
            >
                <form
                    onSubmit={createOfferForm.onSubmit((values) =>
                        handleCreateOffer(values),
                    )}
                >
                    <Stack spacing="md">
                        <NumberInput
                            min={0.1}
                            max={selectedOwnership?.percentageOwned! * 100}
                            step={1}
                            precision={1}
                            withAsterisk
                            label="Porcentagem Ofertada (%)"
                            placeholder="Ex: 27"
                            {...createOfferForm.getInputProps("percentage")}
                            stepHoldDelay={500}
                            stepHoldInterval={100}
                        />

                        <NumberInput
                            min={0.1}
                            hideControls
                            precision={2}
                            parser={(value: string) =>
                                value.replace(/R\$\s?|(,*)|(\.*)/g, "")
                            }
                            formatter={(value: string) =>
                                !Number.isNaN(parseFloat(value))
                                    ? `R$ ${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          ",",
                                      )
                                    : "R$ "
                            }
                            withAsterisk
                            label="Valor da Oferta (R$)"
                            placeholder="Ex: R$ 100,000.00"
                            {...createOfferForm.getInputProps("amount")}
                        />

                        <Checkbox
                            ml="auto"
                            labelPosition="left"
                            label="Deseja Transferir a Posse do Imóvel?"
                            color="green"
                            size="md"
                            {...createOfferForm.getInputProps(
                                "isEffectiveTransfer",
                            )}
                        />
                    </Stack>

                    <Space h="xl" />

                    <Group position="apart">
                        <Button
                            variant="outline"
                            color="gray"
                            onClick={() => setOpenedModal(false)}
                        >
                            Cancelar
                        </Button>

                        <Button variant="outline" color="green" type="submit">
                            Criar Oferta
                        </Button>
                    </Group>
                </form>
            </Modal>

            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <Title order={2}>Criar Oferta</Title>

            <Space h="xl" />

            <Group position="apart">
                <Title order={3}>Selecione o Imóvel Tokenizado</Title>
                <Button
                    variant="outline"
                    color={"blue"}
                    onClick={getAllOwnerships}
                >
                    Atualizar Imóveis
                </Button>
            </Group>

            <Space h="xl" />

            <Grid gutter={30}>
                {ownerships.map((ownership) => {
                    return (
                        <Grid.Col key={ownership.id} md={6} lg={4} xl={3}>
                            <Card
                                shadow="sm"
                                p="lg"
                                radius="lg"
                                withBorder
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                    setOpenedModal(true);
                                    createOfferForm.reset();
                                    setSelectedOwnershipId(ownership?.id);
                                }}
                            >
                                <Text size={22} weight={500}>
                                    {ownership.tokenizedAsset?.address}
                                </Text>
                                <Badge
                                    color="green"
                                    variant="light"
                                    mt="md"
                                    sx={
                                        ownership?.isEffectiveOwner
                                            ? { visibility: "visible" }
                                            : { visibility: "hidden" }
                                    }
                                >
                                    Dono
                                </Badge>

                                <Space h="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Área Útil</Text>
                                    <Text>
                                        {ownership.tokenizedAsset?.usableArea} m
                                        <sup>2</sup>
                                    </Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Número do Registro</Text>
                                    <Text>
                                        {ownership.tokenizedAsset?.registration}
                                    </Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Porcentagem de Posse</Text>
                                    <Text>
                                        {ownership.percentageOwned * 100} %
                                    </Text>
                                </Group>
                            </Card>
                        </Grid.Col>
                    );
                })}
            </Grid>
        </>
    );
};

export default CreateOffer;
