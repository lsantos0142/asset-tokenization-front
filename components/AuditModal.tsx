import {
    Badge,
    Button,
    Card,
    Divider,
    LoadingOverlay,
    Modal,
    Table,
    Text,
    Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconExternalLink, IconX } from "@tabler/icons";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import formatCPF from "../helpers/FormatCPF";
import { formatNumber } from "../helpers/FormatCurrencyBRL";
import { IAuditResponse } from "../types/Audit";
import { TokenizedAsset } from "../types/TokenizedAsset";

interface IAudidModalProps {
    selectedAsset?: TokenizedAsset;
    showModal: boolean;
    setShowModal: (newState: boolean) => void;
}

export function AuditModal({
    selectedAsset,
    showModal,
    setShowModal,
}: IAudidModalProps) {
    const [loading, setLoading] = useState(false);
    const [auditData, setAuditData] = useState<IAuditResponse[]>([]);

    const getAuditData = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await axios.get<IAuditResponse[]>(
                `${process.env.BACK}/tokenized-asset/audit/${selectedAsset?.contractAddress}`,
            );

            setAuditData(data);
        } catch (e) {
            showNotification({
                title: "Erro!",
                message: "Não foi possível auditar os dados do imóvel.",
                color: "red",
                icon: <IconX />,
            });
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [selectedAsset]);

    useEffect(() => {
        if (!selectedAsset) return;
        getAuditData();
    }, [getAuditData, selectedAsset]);

    return (
        <>
            <Modal
                size="auto"
                centered
                opened={showModal}
                onClose={() => setShowModal(false)}
                title={
                    <>
                        <Title order={3}>
                            Dados do imóvel registrados em Blockchain
                        </Title>
                        <div className="d-flex gap-2 align-items-center mt-0">
                            <Text size={18}>
                                {`Endereço do Smart Contract: ${selectedAsset?.contractAddress}`}
                            </Text>
                            <Button className="p-0 m-0" variant="subtle">
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`https://goerli.etherscan.io/address/${selectedAsset?.contractAddress}`}
                                >
                                    <IconExternalLink size={20} />
                                </a>
                            </Button>
                        </div>
                    </>
                }
            >
                <LoadingOverlay visible={loading} overlayBlur={2} />

                <div className="d-flex flex-column gap-3 mt-4">
                    {auditData.map((ownerData, index) => (
                        <Card
                            shadow="sm"
                            radius="md"
                            withBorder
                            key={index}
                            className="d-flex flex-column gap-5"
                        >
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Text weight={"bold"} size={22}>
                                        {`Nome do proprietário: ${ownerData.owner?.name}`}
                                    </Text>
                                    {ownerData.isEffectiveOwner && (
                                        <Badge
                                            color="green"
                                            variant="light"
                                            className="p-2"
                                        >
                                            Proprietário efetivo
                                        </Badge>
                                    )}
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <Text>
                                        CPF: {formatCPF(ownerData.owner?.cpf)}
                                    </Text>
                                    <Text>
                                        Percentual do imóvel:{" "}
                                        {ownerData.shares * 100}%
                                    </Text>
                                    <Text>
                                        Endereço da carteira:{" "}
                                        {ownerData.owner?.walletAddress}
                                    </Text>
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-3">
                                <Text weight={"bold"} size={20}>
                                    Pagamentos de aluguéis
                                </Text>
                                {!!ownerData.rentPayments?.length ? (
                                    <Table
                                        striped
                                        horizontalSpacing="xl"
                                        border={1}
                                    >
                                        <thead>
                                            <tr>
                                                <th>Data do pagamento</th>
                                                <th>% do total</th>
                                                <th>Valor recebido</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ownerData.rentPayments.map(
                                                (rp, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {rp.paymentDate?.toString()}
                                                        </td>
                                                        <td>
                                                            {rp.shares * 100} %
                                                        </td>
                                                        <td>
                                                            {formatNumber.format(
                                                                rp.amount,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Text>
                                        Proprietário não possui nenhum pagamento
                                        de aluguel associado a este imóvel.
                                    </Text>
                                )}
                            </div>

                            <div className="d-flex flex-column gap-3">
                                <Text weight={"bold"} size={20}>
                                    Garantias de empréstimo realizadas
                                </Text>
                                {!!ownerData.collaterals?.length ? (
                                    <Table striped horizontalSpacing="xl">
                                        <thead>
                                            <tr>
                                                <th>Data de expiração</th>
                                                <th>% do imóvel</th>
                                                <th>Carteira do banco</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ownerData.collaterals.map(
                                                (c, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {c.expirationDate?.toString()}
                                                        </td>
                                                        <td>
                                                            {c.collateralShares *
                                                                100}{" "}
                                                            %
                                                        </td>
                                                        <td>{c.bankId}</td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Text>
                                        Proprietário não possui nenhuma garantia
                                        associada a este imóvel.
                                    </Text>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </Modal>
        </>
    );
}
