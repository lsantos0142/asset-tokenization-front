import { Button, LoadingOverlay, Table, Text, Title } from "@mantine/core";
import { IconExternalLink, IconReceipt, IconRefresh } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { TokenizedAsset } from "../types/TokenizedAsset";
import { AuditModal } from "./AuditModal";
import { RegisterRentPaymentModal } from "./RegisterRentPaymentModal";

const TokenizedAssetsAdmin: NextPage = () => {
    const [tokenizedAssets, setTokenizedAssets] = useState<TokenizedAsset[]>(
        [],
    );
    const [selectedAsset, setSelectedAsset] = useState<TokenizedAsset>();

    const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
    const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const getAllTokenizedAssets = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get<TokenizedAsset[]>(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/get-all`,
            );

            setTokenizedAssets(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getAllTokenizedAssets();
    }, [getAllTokenizedAssets]);

    return (
        <>
            <AuditModal
                setShowModal={setShowAuditModal}
                showModal={showAuditModal}
                selectedAsset={selectedAsset}
            />

            <RegisterRentPaymentModal
                setShowModal={setShowRegisterModal}
                showModal={showRegisterModal}
                selectedAsset={selectedAsset}
            />

            <div className="d-flex flex-column gap-2 mt-4 mb-4">
                <Title order={3}>Gestor de imóveis tokenizados</Title>
                <div className="d-flex gap-5 align-items-center justify-content-between">
                    <Text size={20}>
                        Gerencie todos os imóveis tokenizados na plataforma.
                    </Text>
                    <Button
                        variant="outline"
                        color={"blue"}
                        onClick={getAllTokenizedAssets}
                    >
                        <IconRefresh />
                    </Button>
                </div>
            </div>

            <div className="">
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <Table
                    striped
                    withBorder
                    className="mt-4"
                    horizontalSpacing="xl"
                >
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Endereço</th>
                            <th>Nº registro</th>
                            <th>Área útil</th>
                            <th>Endereço na blockchain</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokenizedAssets.map((ta) => (
                            <tr key={ta.id}>
                                <td>{ta.id}</td>
                                <td>{ta.address}</td>
                                <td>{ta.registration}</td>
                                <td>
                                    {ta.usableArea} m<sup>2</sup>
                                </td>
                                <td>
                                    <div className="d-flex gap-2 align-items-center">
                                        {ta.contractAddress}
                                        <Button
                                            className="p-0 m-0"
                                            variant="subtle"
                                        >
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={`https://goerli.etherscan.io/address/${ta.contractAddress}`}
                                            >
                                                <IconExternalLink size={20} />
                                            </a>
                                        </Button>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            color={"blue"}
                                            onClick={() => {
                                                setShowAuditModal(true);
                                                setSelectedAsset(ta);
                                                getAllTokenizedAssets();
                                            }}
                                        >
                                            <Text size={14}>Auditar</Text>
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            color={"blue"}
                                            onClick={() => {
                                                setShowRegisterModal(true);
                                                setSelectedAsset(ta);
                                                getAllTokenizedAssets();
                                            }}
                                        >
                                            <Text size={14}>
                                                Registrar aluguel
                                            </Text>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!tokenizedAssets?.length && (
                            <tr>
                                <td className="p-5" colSpan={3}>
                                    Ainda não há nenhum imóvel tokenizado na
                                    plataforma
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default TokenizedAssetsAdmin;
