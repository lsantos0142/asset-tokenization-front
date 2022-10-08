import {
    Affix,
    Alert,
    Box,
    Button,
    Center,
    Group,
    PasswordInput,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons";
import axios from "axios";
import jwtDecode from "jwt-decode";
import type { NextPage } from "next";
import { Router, useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";

const Login: NextPage = () => {
    const router = useRouter();

    const { login } = useContext(AuthContext);

    const [error, setError] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);

    const form = useForm({
        initialValues: {
            username: "",
            password: "",
        },

        validate: {},
    });

    const handleSubmit = (values: typeof form.values) => {
        axios
            .post(`${process.env.BACK}/auth/login`, {
                username: values.username,
                password: values.password,
            })
            .then((res) => {
                if (res.status === 200) {
                    login(jwtDecode(res.data.accessToken), res.data);
                    router.push("/");
                }
            })
            .catch((e) => {
                if (e.response.data.statusCode == 401) {
                    if (e.response.data.message === "Unauthorized") {
                        setError("Digite um usuário e senha");
                    } else {
                        setError(e.response.data.message);
                    }
                    setShow(true);
                } else {
                    alert(e.response.data.message);
                }
            });
    };

    return (
        <>
            <Box sx={{ maxWidth: 400 }} mx="auto">
                <form
                    onSubmit={form.onSubmit((values) => handleSubmit(values))}
                >
                    <TextInput
                        withAsterisk
                        label="Usuário"
                        placeholder="Digite seu usuário"
                        {...form.getInputProps("username")}
                    />

                    <PasswordInput
                        withAsterisk
                        label="Senha"
                        placeholder="Digite sua senha"
                        {...form.getInputProps("password")}
                    />

                    <Group position="right" mt="md">
                        <Button type="submit">Fazer Login</Button>
                    </Group>
                </form>
            </Box>

            <Affix position={{ bottom: "2rem", right: "2rem" }}>
                <Alert
                    withCloseButton
                    closeButtonLabel="Fechar alerta"
                    onClose={() => setShow(false)}
                    hidden={!show}
                    icon={<IconAlertCircle size={16} />}
                    title="Erro!"
                    color="red"
                >
                    {error}
                </Alert>
            </Affix>
        </>
    );
};

export default Login;
