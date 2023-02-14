import eye from "../assets/eye.png";

import { useEffect, useState } from "react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { Navbar } from "../components/Navbar";

interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    verified: boolean;
    email: string;
    flags: number;
    banner: string;
    accent_color: number;
    premium_type: number;
    public_flags: number;
}

export function Verify() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [
        fragment.get("access_token"),
        fragment.get("token_type"),
    ];
    const [user, setUser] = useState<DiscordUser | null>(null);

    const { address, isDisconnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { signMessageAsync } = useSignMessage();

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!accessToken || !tokenType) {
            return;
        }

        const grabDetails = async () => {
            const res = await fetch("https://discord.com/api/users/@me", {
                headers: {
                    authorization: `${tokenType} ${accessToken}`,
                },
            });
            const user = await res.json();
            console.log(user);
            setUser(user);
        };

        grabDetails();
    }, [accessToken]);

    return (
        <div
            className="dark:text-white"
            style={{
                height: "100%",
            }}
        >
            <Navbar RightElement={<ConnectButton showBalance={false} />} />

            <div className="mt-10">
                {!success && !accessToken && (
                    <div>
                        <div style={{ zIndex: 1000 }}>
                            <h1
                                style={{
                                    textAlign: "center",
                                    fontSize: 32,
                                    fontFamily: "monospace",
                                    marginBottom: "2rem",
                                }}
                            >
                                {process.env.REACT_APP_PROJECT_NAME} NFT
                                Verification
                            </h1>
                            <p
                                style={{
                                    textAlign: "center",
                                    fontSize: 24,
                                    fontFamily: "monospace",
                                    marginBottom: "2rem",
                                }}
                            >
                                You've been asked to verify holder status for{" "}
                                {process.env.REACT_APP_PROJECT_NAME}.
                                Please&nbsp;
                                <button
                                    className="underline text-pink-600 font-bold"
                                    onClick={() => {
                                        window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${
                                            process.env.REACT_APP_CLIENT_ID
                                        }&redirect_uri=${encodeURIComponent(
                                            process.env
                                                .REACT_APP_DISCORD_REDIRECT_URI!
                                        )}&response_type=token&scope=identify`;
                                    }}
                                >
                                    verify your Discord
                                </button>{" "}
                                account to begin the process.
                            </p>
                        </div>
                    </div>
                )}
                {!success && accessToken && user && (
                    <div>
                        <div style={{ zIndex: 1000 }}>
                            <div
                                style={{
                                    textAlign: "center",
                                    fontSize: 24,
                                    fontFamily: "monospace",
                                    marginBottom: "2rem",
                                }}
                            >
                                <p>
                                    Your Discord account was successfully
                                    authenticated.
                                </p>

                                <img
                                    style={{ marginTop: "1rem" }}
                                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`}
                                    className="rounded-full mx-auto h-32"
                                />
                                <p style={{ marginTop: "1rem" }}>
                                    <strong>{user.username}</strong>#
                                    {user.discriminator}
                                </p>

                                {isDisconnected && (
                                    <p style={{ marginTop: "1rem" }}>
                                        please{" "}
                                        <button
                                            onClick={openConnectModal}
                                            className="underline text-pink-600 font-bold"
                                        >
                                            connect your wallet
                                        </button>{" "}
                                        to continue
                                    </p>
                                )}
                                {!isDisconnected && address && (
                                    <p style={{ marginTop: "1rem" }}>
                                        Please{" "}
                                        <button
                                            onClick={async () => {
                                                const res = await fetch(
                                                    `${process.env
                                                        .REACT_APP_VERIFY_API!}/token`,
                                                    {
                                                        method: "POST",
                                                        body: JSON.stringify({
                                                            address,
                                                        }),
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                        },
                                                    }
                                                );

                                                if (res.status === 200) {
                                                    const {
                                                        token,
                                                    }: { token: string } =
                                                        await res.json();

                                                    const result =
                                                        await signMessageAsync({
                                                            message: token,
                                                        });

                                                    const payload = {
                                                        message: token,
                                                        signature: result,
                                                        discordToken:
                                                            accessToken,
                                                        discordTokenType:
                                                            tokenType,
                                                    };

                                                    console.log(payload);

                                                    const verifyRes =
                                                        await fetch(
                                                            `${process.env
                                                                .REACT_APP_VERIFY_API!}/verify`,
                                                            {
                                                                method: "POST",
                                                                body: JSON.stringify(
                                                                    payload
                                                                ),
                                                                headers: {
                                                                    "Content-Type":
                                                                        "application/json",
                                                                },
                                                            }
                                                        );

                                                    if (
                                                        verifyRes.status === 200
                                                    ) {
                                                        setSuccess(true);
                                                    } else {
                                                        alert(
                                                            "We couldn't verify you as an NFT holder. Ensure you've connected the right wallet. If you continue to experience problems, DM us on Twitter @FrenlyFaces"
                                                        );
                                                    }
                                                } else {
                                                    alert(res.statusText);
                                                }
                                            }}
                                            className="underline text-pink-600 font-bold"
                                        >
                                            sign a message
                                        </button>{" "}
                                        to verify your holder status for{" "}
                                        {process.env.REACT_APP_PROJECT_NAME}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {success && (
                    <div style={{ zIndex: 1000 }}>
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: 24,
                                fontFamily: "monospace",
                                marginBottom: "2rem",
                            }}
                        >
                            You have been successfully verified!
                        </p>
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: 24,
                                fontFamily: "monospace",
                                marginBottom: "2rem",
                            }}
                        >
                            You may now return to Discord.
                        </p>
                    </div>
                )}
            </div>
            <p
                style={{
                    textAlign: "center",
                    fontSize: 14,
                    fontFamily: "monospace",
                    marginBottom: "2rem",
                    marginTop: "4rem",
                }}
                className="p-2"
            >
                verification bot powered with ❤️ from{" "}
                <a
                    href="https://frenlyfaces.xyz"
                    target="__blank"
                    className="underline text-pink-600 font-bold"
                >
                    Frenly Faces
                </a>
            </p>
        </div>
    );
}
