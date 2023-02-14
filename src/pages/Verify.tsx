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
            <div>
                <img
                    style={{
                        width: "400px",
                        maxWidth: "80%",
                        zIndex: 1000,
                        margin: "auto",
                    }}
                    src={eye}
                    alt="welcome to frenly faces"
                ></img>
            </div>
            {!success && !accessToken && (
                <div>
                    <div style={{ zIndex: 1000 }}>
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: 24,
                                fontFamily: "monospace",
                                marginBottom: "2rem",
                            }}
                        >
                            please{" "}
                            <button
                                className="underline text-pink-600 font-bold"
                                onClick={() => {
                                    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=1071113835659923466&redirect_uri=${encodeURIComponent(
                                        process.env
                                            .REACT_APP_DISCORD_REDIRECT_URI!
                                    )}&response_type=token&scope=identify`;
                                }}
                            >
                                verify your Discord
                            </button>{" "}
                            to be Seen
                        </p>
                    </div>
                </div>
            )}
            {!success && accessToken && user && (
                <div>
                    <div style={{ zIndex: 1000 }}>
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: 24,
                                fontFamily: "monospace",
                                marginBottom: "2rem",
                            }}
                        >
                            <p>
                                we See you{" "}
                                <strong>
                                    {user.username}#{user.discriminator}
                                </strong>
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
                                    please{" "}
                                    <button
                                        onClick={async () => {
                                            const res = await fetch(
                                                `https://api.frenlyfaces.xyz/verify/token`,
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
                                                    discordToken: accessToken,
                                                    discordTokenType: tokenType,
                                                };

                                                console.log(payload);

                                                const verifyRes = await fetch(
                                                    `https://api.frenlyfaces.xyz/verify/verify`,
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

                                                if (verifyRes.status === 200) {
                                                    setSuccess(true);
                                                } else {
                                                    alert(
                                                        "We couldn't verify you as a frenly face. Ensure you've connected the right wallet. If you continue to experience problems, DM us on Twitter @FrenlyFaces"
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
                                    to verify your membership
                                </p>
                            )}
                        </p>
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
                        you have been Seen
                    </p>
                    <p
                        style={{
                            textAlign: "center",
                            fontSize: 24,
                            fontFamily: "monospace",
                            marginBottom: "2rem",
                        }}
                    >
                        you may return to discord
                    </p>
                </div>
            )}
        </div>
    );
}
