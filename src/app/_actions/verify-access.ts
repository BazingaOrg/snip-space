"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyAccessPassword } from "@/lib/auth/password";
import { generateSessionToken, getSessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export type VerifyAccessState = {
  status: "idle" | "error";
  message?: string;
};

const EMPTY_STATE: VerifyAccessState = { status: "idle" };

export async function verifyAccessAction(
  _prevState: VerifyAccessState = EMPTY_STATE,
  formData: FormData,
): Promise<VerifyAccessState | void> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return {
      status: "error",
      message: "请输入访问密码",
    };
  }

  let isValid = false;
  try {
    isValid = await verifyAccessPassword(password);
  } catch (error) {
    console.error("Access verification failed", error);
    return {
      status: "error",
      message: "访问校验不可用，请确认环境变量或 Supabase 配置",
    };
  }

  if (!isValid) {
    return {
      status: "error",
      message: "密码不正确，请重试",
    };
  }

  const token = generateSessionToken();
  cookies().set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

  redirect("/");
}
