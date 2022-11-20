import { Button, Group, Modal, NumberInput, Title, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import { useCallback, useState } from "react";
import { Ownership } from "../types/Ownership";

interface IRegisterRentPaymentModalProps {
    selectedOwnership?: Ownership;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    getAllOwnerships: () => Promise<void>;
}

export function RegisterRentPaymentModal({
    getAllOwnerships,
    selectedOwnership,
    showModal,
    setShowModal,
}: IRegisterRentPaymentModalProps) {
    const createOfferForm = useForm({
        initialValues: {
            amount: 0,
        },
        validate: {
            amount: (value) => (!value ? "Campo Obrigatório" : null),
        },
    });

    const createRentPayment = useCallback(
        async (values: typeof createOfferForm.values) => {
            const payload = {
                ...values,
                tokenizedAssetId: selectedOwnership?.tokenizedAsset?.id,
                contractAddress:
                    selectedOwnership?.tokenizedAsset?.contractAddress,
            };

            showNotification({
                id: "register_rent_payment_" + values.amount,
                disallowClose: true,
                autoClose: false,
                title: <Text size="xl">Registrando Pagamento do Aluguel</Text>,
                message: <Text size="xl">Favor esperar até a conclusão</Text>,
                loading: true,
            });

            setShowModal(false);

            await axios
                .post(
                    `${process.env.BACK}/tokenized-asset/rent-payment/create`,
                    payload,
                )
                .then((res) => {
                    getAllOwnerships();
                    updateNotification({
                        id: "register_rent_payment_" + values.amount,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconCheck size={16} />,
                        color: "green",
                        title: <Text size="xl">Sucesso!</Text>,
                        message: (
                            <Text size="xl">
                                Pagamento de aluguel registrado.
                            </Text>
                        ),
                    });
                    createOfferForm.reset();
                })
                .catch((e) => {
                    updateNotification({
                        id: "register_rent_payment_" + values.amount,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconX size={16} />,
                        color: "red",
                        title: (
                            <Text size="xl">
                                Erro no Registro de Pagamento de Aluguel
                            </Text>
                        ),
                        message: (
                            <Text size="xl">{e.response?.data?.message}</Text>
                        ),
                    });
                    console.error(e);
                });
        },
        [createOfferForm, selectedOwnership, setShowModal],
    );

    return (
        <>
            <Modal
                size="auto"
                centered
                opened={showModal}
                onClose={() => {
                    setShowModal(false);
                    createOfferForm.reset();
                }}
                title={
                    <Title order={3}>
                        {`Registrar pagamento de aluguel do imóvel ${selectedOwnership?.tokenizedAsset?.registration}`}
                    </Title>
                }
            >
                <form
                    className="mt-5"
                    onSubmit={createOfferForm.onSubmit((values) =>
                        createRentPayment(values),
                    )}
                >
                    <div className="d-flex flex-column gap-5">
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
                            label="Valor pago (R$)"
                            placeholder="Ex: R$ 100,000.00"
                            {...createOfferForm.getInputProps("amount")}
                        />

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
                            >
                                Registrar
                            </Button>
                        </Group>
                    </div>
                </form>
            </Modal>
        </>
    );
}
