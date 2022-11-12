import {
    Text,
    Anchor,
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
import Link from "next/link";
import { useEffect, useState } from "react";
import formatCPF from "../helpers/FormatCPF";
import { Proposal } from "../types/Proposal";

const TokenizationProposalAdmin: NextPage = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [openedRejectModal, setOpenedRejectModal] = useState<boolean>(false);
    const [openedAcceptModal, setOpenedAcceptModal] = useState<boolean>(false);
    const [selectedProposalId, setSelectedProposalId] = useState<string>("");

    const getAllActiveProposals = () => {
        axios
            .get(`${process.env.BACK}/tokenized-asset/proposal/get-pending`)
            .then((res) => {
                setProposals(res.data);
            })
            .catch((e) => {
                console.log(e.response.data.message);
            });
    };

    const handleRejectProposal = () => {
        showNotification({
            id: "reject_tokenization_proposal" + selectedProposalId,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Rejeitando Proposta</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        axios
            .put(
                `${process.env.BACK}/tokenized-asset/proposal/refuse/${selectedProposalId}`,
            )
            .then((res) => {
                getAllActiveProposals();
                updateNotification({
                    id: "reject_tokenization_proposal" + selectedProposalId,
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
                    id: "reject_tokenization_proposal" + selectedProposalId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconX size={16} />,
                    color: "red",
                    title: (
                        <Text size="xl">Erro na Rejeição da Tokenização</Text>
                    ),
                    message: <Text size="xl">{e.response.data.message}</Text>,
                });
            });
    };

    const handleAcceptProposal = () => {
        showNotification({
            id: "accept_tokenization_proposal" + selectedProposalId,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Aceitando Proposta</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        axios
            .put(
                `${process.env.BACK}/tokenized-asset/proposal/accept/${selectedProposalId}`,
            )
            .then((res) => {
                getAllActiveProposals();
                updateNotification({
                    id: "accept_tokenization_proposal" + selectedProposalId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconCheck size={16} />,
                    color: "green",
                    title: <Text size="xl">Tokenização Aceita</Text>,
                    message: (
                        <Text size="xl">Tokenização aceita com sucesso</Text>
                    ),
                });
            })
            .catch((e) => {
                updateNotification({
                    id: "accept_tokenization_proposal" + selectedProposalId,
                    disallowClose: true,
                    autoClose: 5000,
                    icon: <IconX size={16} />,
                    color: "red",
                    title: <Text size="xl">Erro no Aceite da Tokenização</Text>,
                    message: <Text size="xl">{e.response.data.message}</Text>,
                });
            });
    };

    useEffect(() => {
        getAllActiveProposals();
    }, []);

    return (
        <>
            <Modal
                centered
                opened={openedRejectModal}
                onClose={() => setOpenedRejectModal(false)}
                title={<Title order={3}>Deseja Rejeitar Esta Proposta?</Title>}
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
                            handleRejectProposal();
                            setOpenedRejectModal(false);
                        }}
                    >
                        Rejeitar
                    </Button>
                </Group>
            </Modal>

            <Modal
                centered
                opened={openedAcceptModal}
                onClose={() => setOpenedAcceptModal(false)}
                title={<Title order={3}>Deseja Aceitar Esta Proposta?</Title>}
            >
                <Group position="apart">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={() => setOpenedAcceptModal(false)}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="outline"
                        color="green"
                        onClick={() => {
                            handleAcceptProposal();
                            setOpenedAcceptModal(false);
                        }}
                    >
                        Aceitar
                    </Button>
                </Group>
            </Modal>

            <Group position="apart">
                <Title order={3}>Propostas de Tokenização Ativas</Title>
                <Button
                    variant="outline"
                    color={"blue"}
                    onClick={getAllActiveProposals}
                >
                    Atualizar Propostas
                </Button>
            </Group>

            <Space h="xl" />

            <Grid gutter={30}>
                {proposals.map((proposal) => {
                    return (
                        <Grid.Col md={6} xl={4} key={proposal.id}>
                            <Card shadow="sm" p="lg" radius="lg" withBorder>
                                <Text size={22} weight={500}>
                                    {proposal.address}
                                </Text>

                                <Badge color="pink" variant="light" mt="md">
                                    Em aberto
                                </Badge>

                                <Space h="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Nome do Usuário</Text>
                                    <Text>{proposal?.user?.username}</Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Nome</Text>
                                    <Text>{proposal?.user?.name}</Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>CPF do Usuário</Text>
                                    <Text>
                                        {formatCPF(proposal?.user?.cpf!)}
                                    </Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Área útil</Text>
                                    <Text>
                                        {proposal.usableArea} m<sup>2</sup>
                                    </Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Número de Registro</Text>
                                    <Text>{proposal.registration}</Text>
                                </Group>

                                <Space h="xl" />

                                <Group position="apart" my="xs">
                                    <Button
                                        variant="outline"
                                        color="red"
                                        onClick={() => {
                                            setOpenedRejectModal(true);
                                            setSelectedProposalId(proposal.id);
                                        }}
                                    >
                                        Rejeitar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        color="green"
                                        onClick={() => {
                                            setOpenedAcceptModal(true);
                                            setSelectedProposalId(proposal.id);
                                        }}
                                    >
                                        Aceitar
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

export default TokenizationProposalAdmin;
