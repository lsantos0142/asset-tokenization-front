import {
    Text,
    Anchor,
    Grid,
    Notification,
    Breadcrumbs,
    Divider,
    Space,
    Title,
    TextInput,
    Group,
    Button,
    NumberInput,
    Affix,
    ScrollArea,
} from "@mantine/core";
import type { NextPage } from "next";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";

const Tokenization: NextPage = () => {
    const { user } = useContext(AuthContext);

    const createTokenizationProposalForm = useForm({
        initialValues: {
            effectiveOwner: "",
            address: "",
            usableArea: undefined,
            registration: undefined,
            deed: "",
            userId: "",
        },

        validate: {
            effectiveOwner: (value) => (!value ? "Campo Obrigatório" : null),
            address: (value) => (!value ? "Campo Obrigatório" : null),
            usableArea: (value) =>
                value && value > 0 ? null : "Campo Obrigatório",
            registration: (value) =>
                value && value > 0 ? null : "Campo Obrigatório",
            deed: (value) => (!value ? "Campo Obrigatório" : null),
        },
    });

    const handleCreateTokenizationProposal = (
        values: typeof createTokenizationProposalForm.values,
    ) => {
        values.userId = user.sub;
        console.log(values);
        // createTokenizationProposalForm.reset();
        showNotification({
            id: "create_tokenization_proposal_" + values.registration,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Criando Proposta</Text>,
            message: <Text size="xl">Favor espere até a conclusão</Text>,
            loading: true,
        });

        setTimeout(() => {
            updateNotification({
                id: "create_tokenization_proposal_" + values.registration,
                disallowClose: true,
                autoClose: 5000,
                icon: <IconCheck size={16} />,
                color: "green",
                title: <Text size="xl">Proposta Criada</Text>,
                message: <Text size="xl">Proposta criada com sucesso</Text>,
            });
        }, 3000);
    };

    const items = [
        { title: "Home", href: "/" },
        { title: "Criar Proposta de Tokenização", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    return (
        <>
            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <Title order={1}>Criar Proposta de Tokenização</Title>

            <Space h="xl" />

            <form
                onSubmit={createTokenizationProposalForm.onSubmit((values) =>
                    handleCreateTokenizationProposal(values),
                )}
            >
                <Grid gutter={30}>
                    <Grid.Col md={6} xl={4}>
                        <TextInput
                            withAsterisk
                            label="Endereço da Carteira do Dono Efetivo"
                            placeholder="Ex: 0x7E2CdEcA4cC308B5253118d7dC99B124EB3a0556"
                            {...createTokenizationProposalForm.getInputProps(
                                "effectiveOwner",
                            )}
                        />
                    </Grid.Col>
                    <Grid.Col md={6} xl={3}>
                        <TextInput
                            withAsterisk
                            label="Endereço do Imóvel"
                            placeholder="Ex: Av. Prof. Luciano Gualberto, 380"
                            {...createTokenizationProposalForm.getInputProps(
                                "address",
                            )}
                        />
                    </Grid.Col>
                    <Grid.Col md={6} xl={2}>
                        <NumberInput
                            min={1}
                            withAsterisk
                            label="Área Útil do Imóvel"
                            placeholder="Ex: 100"
                            {...createTokenizationProposalForm.getInputProps(
                                "usableArea",
                            )}
                            stepHoldDelay={500}
                            stepHoldInterval={100}
                        />
                    </Grid.Col>
                    <Grid.Col md={6} xl={3}>
                        <NumberInput
                            min={1}
                            withAsterisk
                            label="Número do Registro em Cartório"
                            placeholder="Ex: 27"
                            {...createTokenizationProposalForm.getInputProps(
                                "registration",
                            )}
                            stepHoldDelay={500}
                            stepHoldInterval={100}
                        />
                    </Grid.Col>
                    <Grid.Col md={6} xl={2}>
                        <TextInput
                            withAsterisk
                            label="Escritura do Imóvel"
                            placeholder="Ex: Escritura do Imóvel"
                            {...createTokenizationProposalForm.getInputProps(
                                "deed",
                            )}
                        />
                    </Grid.Col>
                </Grid>

                <Group position="right" my="xl">
                    <Button type="submit">Criar Proposta de Tokenização</Button>
                </Group>
            </form>
        </>
    );
};

export default Tokenization;
