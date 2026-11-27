"use server";

import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import {headers} from "next/headers";
import { DEFAULT_AUTH_CALLBACK,getSafeCallbackPath,SIGN_IN_PATH } from "../utils";


export async function signInWithGithub(formData: FormData){
    const callbackUrl = formData.get("callbackUrl");

    const redirectTo = getSafeCallbackPath(callbackUrl as string | null | undefined);
    const result = await auth.api.signInSocial({
        body: {
            provider: "github",
            callbackURL: redirectTo
        },
        headers: await headers()
    });

    if (result.url) {
        redirect(result.url);
    }
}

export async function getServerSession() {
    return await auth.api.getSession({
        headers: await headers()
    });
}

export async function requireAuth(redirectTo = SIGN_IN_PATH) {
    const session = await getServerSession();

    if(!session){
        return redirect(redirectTo);
    }

    return session;
}

export async function requireUnAuth(redirectTo =DEFAULT_AUTH_CALLBACK ) {
    const session = await getServerSession();

    if(session){
        return redirect(redirectTo);
    }

}

