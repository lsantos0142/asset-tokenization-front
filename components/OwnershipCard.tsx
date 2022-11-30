import { Badge, Button, Card, Divider, Group, Text } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons";
import { Ownership } from "../types/Ownership";

interface IOwnershipCardProps {
    children?: React.ReactNode;
    ownership: Ownership;
}
export function OwnershipCard({ children, ownership }: IOwnershipCardProps) {
    return (
        <Card
            key={ownership.id}
            shadow="sm"
            p="lg"
            radius="lg"
            withBorder
            style={{ width: "400px" }}
        >
            <Group position="apart" className="mb-4">
                <Text size={22} weight={500}>
                    {ownership.tokenizedAsset?.address}
                </Text>
                {ownership?.isEffectiveOwner && (
                    <Badge color="green" variant="light">
                        Dono
                    </Badge>
                )}
            </Group>

            <Group position="apart" my="xs">
                <Text>Área Útil</Text>
                <Text>
                    {ownership.tokenizedAsset?.usableArea} m<sup>2</sup>
                </Text>
            </Group>

            <Divider size="xs" />

            <Group position="apart" my="xs">
                <Text>Número do Registro</Text>
                <Text>{ownership.tokenizedAsset?.registration}</Text>
            </Group>

            <Divider size="xs" />

            <Group position="apart" my="xs">
                <Text>Porcentagem de Posse</Text>
                <Text>
                    {Math.round(ownership.percentageOwned * 10000) / 100} %
                </Text>
            </Group>

            <Divider size="xs" />

            <Group position="apart" my="xs">
                <Text>Visualizar no Etherscan</Text>
                <div className="d-flex gap-1 align-items-center">
                    <Button className="p-0 m-0" variant="subtle">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://goerli.etherscan.io/address/${ownership.tokenizedAsset?.contractAddress}`}
                        >
                            <IconExternalLink size={20} />
                        </a>
                    </Button>
                </div>
            </Group>

            {children}
        </Card>
    );
}
