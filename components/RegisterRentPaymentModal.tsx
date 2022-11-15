import { Button, Group, Modal, NumberInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import { useCallback, useState } from "react";
import { Ownership } from "../types/Ownership";

interface IRegisterRentPaymentModalProps {
    selectedOwnership?: Ownership;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
}

export function RegisterRentPaymentModal({
    selectedOwnership,
    showModal,
    setShowModal,
}: IRegisterRentPaymentModalProps) {
    const [loading, setLoading] = useState(false);
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
            try {
                setLoading(true);
                const payload = {
                    ...values,
                    tokenizedAssetId: selectedOwnership?.tokenizedAsset?.id,
                    contractAddress:
                        selectedOwnership?.tokenizedAsset?.contractAddress,
                };

                await axios.post(
                    `${process.env.BACK}/tokenized-asset/rent-payment/create`,
                    payload,
                );

                showNotification({
                    title: "Sucesso!",
                    message: "Pagamento de aluguel registrado.",
                    color: "green",
                    icon: <IconCheck />,
                });

                setShowModal(false);
            } catch (e) {
                showNotification({
                    title: "Erro!",
                    message: "Não foi possível registrar pagamento de aluguel",
                    color: "red",
                    icon: <IconX />,
                });
                console.error(e);
            } finally {
                setLoading(false);
            }
        },
        [createOfferForm, selectedOwnership, setShowModal],
    );

    return (
        <>
            <Modal
                size="auto"
                centered
                opened={showModal}
                onClose={() => setShowModal(false)}
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
                                loading={loading}
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
