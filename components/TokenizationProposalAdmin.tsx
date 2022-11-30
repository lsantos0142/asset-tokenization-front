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
import { IconCheck, IconDownload, IconRefresh, IconX } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import formatCPF from "../helpers/FormatCPF";
import { Proposal } from "../types/Proposal";

const TokenizationProposalAdmin: NextPage = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [openedRejectModal, setOpenedRejectModal] = useState<boolean>(false);
    const [openedAcceptModal, setOpenedAcceptModal] = useState<boolean>(false);
    const [selectedProposalId, setSelectedProposalId] = useState<string>("");

    const getAllActiveProposals = () => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/proposal/get-pending`,
            )
            .then((res) => {
                setProposals(res.data);
            })
            .catch((e) => {
                console.log(e.response?.data?.message);
            });
    };

    const downloadDocument = useCallback(async (id: string) => {
        try {
            const { data } = await axios.get<string>(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/proposal/get-document/${id}`,
            );
            var a = document.createElement("a");
            a.href = data;
            a.download = "document.pdf";
            a.click();
        } catch (e) {}
    }, []);

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
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/proposal/refuse/${selectedProposalId}`,
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
                    message: <Text size="xl">{e.response?.data?.message}</Text>,
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
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/proposal/accept/${selectedProposalId}`,
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
                    message: <Text size="xl">{e.response?.data?.message}</Text>,
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

            <div className="d-flex flex-column gap-2 mt-4 mb-5">
                <Title order={3}>Propostas de Tokenização Ativas</Title>
                <div className="d-flex gap-3 align-items-center justify-content-between">
                    <Text size={20}>
                        Gerencie as propostas de tokenização ativas, aceite ou
                        rejeite de acordo com os dados fornecidos.
                    </Text>
                    <Button
                        variant="outline"
                        color={"blue"}
                        onClick={getAllActiveProposals}
                    >
                        <IconRefresh />
                    </Button>
                </div>
            </div>

            {!!proposals.length ? (
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

                                    <Divider size="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Visualizar documentos</Text>
                                        <Button
                                            className="p-0 m-0"
                                            variant="subtle"
                                            onClick={() =>
                                                downloadDocument(proposal.id)
                                            }
                                        >
                                            <IconDownload size={20} />
                                        </Button>
                                    </Group>

                                    <Space h="xl" />

                                    <Group position="apart" my="xs">
                                        <Button
                                            variant="outline"
                                            color="red"
                                            onClick={() => {
                                                setOpenedRejectModal(true);
                                                setSelectedProposalId(
                                                    proposal.id,
                                                );
                                            }}
                                        >
                                            Rejeitar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            color="green"
                                            onClick={() => {
                                                setOpenedAcceptModal(true);
                                                setSelectedProposalId(
                                                    proposal.id,
                                                );
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
            ) : (
                <Text size={20} className="my-3 text-center">
                    Não há nehuma proposta de tokenização ativa.
                </Text>
            )}
        </>
    );
};

export default TokenizationProposalAdmin;
