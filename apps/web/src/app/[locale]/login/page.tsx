"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chrome, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { createBrowserClient } from "@supabase/ssr";
import { type Provider } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      router.push("/home");
      router.refresh();
    },
  });

  const handleSocialLogin = async (providerName: string) => {
    const provider = providerName as Provider;
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-radial from-slate-200 to-slate-500 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {loginMutation.isError && (
              <p className="text-sm text-red-500">{loginMutation.error.message}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "กำลังเข้าสู่ระบบ..." : t("signInButton")}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("orContinueWith")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("line")}
              >
                <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
                {t("loginWithLine")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin("google")}
              >
                <Chrome className="mr-2 h-4 w-4 text-red-500" />
                {t("loginWithGoogle")}
              </Button>
            </div>
          </CardContent>
        </form>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground text-center">
            {t("noAccount")}{" "}
            <Link
              href="/signup"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              {t("signUpLink")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}