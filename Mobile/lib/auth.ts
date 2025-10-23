import { api } from "@/lib/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";

const TOKEN_KEY = "@user_token";

export async function saveToken(token: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export async function getToken(): Promise<string | null> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return token;
}

export async function removeToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
}

export function decodeJwt(token?: string) {
    if (!token) return null;
    try {
        const payload = token.split(".")[1];
        const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, "=");
        const json = Buffer.from(padded.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/**
 * Busca o usuário atual:
 * 1) tenta endpoint /employees/me (se existir)
 * 2) se falhar, decodifica o token, pega id (claims: id | sub | userId) e chama GET por id
 */
export async function fetchCurrentUser(): Promise<any | null> {
    const token = await getToken();
    const payload = decodeJwt(token ?? undefined);
    const id = payload?.id ?? payload?.sub ?? payload?.userId;
    if (!id) return null;

    try {
        const res = await api.get(`/employees/getUnique/${id}`); // ajuste se seu backend usar outro path
        if (res?.data) return res.data;
    } catch {
    }



    try {
        // ajuste endpoint se seu backend tiver outro path para buscar por id
        const res = await api.get(`/employees/getUnique/${id}`);
        return res.data;
    } catch {
        return null;
    }
}