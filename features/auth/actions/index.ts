"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
//import { DEFAULT_AUTH_CALLBACK, getSafeCallbackPath, SIGN_IN_PATH } from "../utils";

export async function signInWithGithub(formData: FormData) {
    const callback = formData.get("callbackUrl");

    const result = await auth.api.signInSocial({
        body: {
            provider: "github",
            callbackURL: "/"
        },
        headers: await headers()
    })

    if(result.url) {
        redirect(result.url);
    }
}