import { AppProps } from "next/app";
import Head from "next/head";
import {
    ActionIcon,
    AppShell,
    Burger,
    Button,
    Center,
    ColorScheme,
    Header,
    MantineProvider,
    MediaQuery,
    ScrollArea,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";
import Navigation from "../components/Navigation";
import { useState } from "react";
import Link from "next/link";
import { IconSun, IconMoonStars } from "@tabler/icons";
import axios from "axios";
import { AuthProvider } from "../context/AuthContext";
import { NotificationsProvider } from "@mantine/notifications";
import { RouteGuard } from "../components/RouteGuard";

const client = axios.create({
    baseURL: process.env.BACK,
    timeout: 10000,
});

export default function App(props: AppProps) {
    const { Component, pageProps } = props;
    const theme = useMantineTheme();
    const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    const dark = colorScheme === "dark";

    return (
        <>
            <Head>
                <title>Tokenização</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: colorScheme,
                    fontSizes: "xl",
                }}
            >
                <AuthProvider>
                    <AppShell
                        padding="lg"
                        navbar={<Navigation />}
                        header={
                            <Header height={100} p="xl">
                                <div
                                    style={{
                                        marginLeft: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        height: "100%",
                                    }}
                                >
                                    <Link href="/">
                                        <Center>
                                            <Title
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                order={1}
                                            >
                                                Tokenização de Ativos
                                                Imobiliários
                                            </Title>
                                        </Center>
                                    </Link>
                                    <ActionIcon
                                        variant="outline"
                                        color={dark ? "yellow" : "blue"}
                                        onClick={() => toggleColorScheme()}
                                        title="Toggle color scheme"
                                    >
                                        {dark ? (
                                            <IconSun size={18} />
                                        ) : (
                                            <IconMoonStars size={18} />
                                        )}
                                    </ActionIcon>
                                </div>
                            </Header>
                        }
                        styles={(theme) => ({
                            main: {
                                backgroundColor:
                                    theme.colorScheme === "dark"
                                        ? theme.colors.dark[8]
                                        : theme.colors.gray[0],
                            },
                        })}
                    >
                        <NotificationsProvider>
                            <RouteGuard>
                                <Component {...pageProps} />
                            </RouteGuard>
                        </NotificationsProvider>
                    </AppShell>
                </AuthProvider>
            </MantineProvider>
        </>
    );
}
