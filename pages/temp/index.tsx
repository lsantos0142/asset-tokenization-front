import { Button, LoadingOverlay, Table, Text, Title } from "@mantine/core";
import { IconExternalLink, IconReceipt, IconRefresh } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { TokenizedAsset } from "../../types/TokenizedAsset";

const Temp: NextPage = () => {
    const [tokenizedAssets, setTokenizedAssets] = useState<TokenizedAsset[]>(
        [],
    );
    const [selectedAsset, setSelectedAsset] = useState<TokenizedAsset>();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const getAllTokenizedAssets = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get<TokenizedAsset[]>(
                `${process.env.BACK}/tokenized-asset/get-all`,
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
            {/* <AuditModal
                setShowModal={setShowModal}
                showModal={showModal}
                selectedAsset={selectedAsset}
            /> */}

            <div className="d-flex flex-column gap-3 mb-5">
                <div className="d-flex gap-3 align-items-center">
                    <IconReceipt size={35} />
                    <Title order={2}>Gestor de imóveis tokenizados</Title>
                </div>
                <div className="d-flex justify-content-between">
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
                <Table striped className="mt-4" horizontalSpacing="xl">
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
                                    <Button
                                        variant="outline"
                                        color={"blue"}
                                        onClick={() => {
                                            setShowModal(true);
                                            setSelectedAsset(ta);
                                            getAllTokenizedAssets();
                                        }}
                                    >
                                        Auditar
                                    </Button>
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

export default Temp;
