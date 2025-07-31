import axios from 'axios';
import Arweave from 'arweave';
import type { JWKInterface } from 'arweave/node/lib/wallet';

// config constants
export const PROTOCOL_TYPE = "https";
export const HOST_NAME = "arweave.net";
export const PORT_NUM = 443;
export const CU_URL = "https://cu.arnode.asia";
export const MODE = "legacy";

export const GOLD_SKY_GQL = "https://arweave-search.goldsky.com/graphql";

export const GATEWAY_URL = `${PROTOCOL_TYPE}://${HOST_NAME}:${PORT_NUM}`;
export const GRAPHQL_URL = `${"https"}://${"arweave.net"}:${443}/graphql`;

// export const AOModule = 'Do_Uc2Sju_ffp6Ev0AnLVdPtot15rvMjP-a9VVaA5fM'; //regular-module on arweave
export const AOModule = "33d-3X8mpv6xYBlVB-eXMrPfH5Kzf6Hiwhcv0UA10sw"; // sqlite-module on arweave
export const AOScheduler = "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA";

export const APM_ID = "DKF8oXtPvh3q8s0fJFIeHFyHNM6oKrwMCUrPxEMroak";
export const APM_INSTALLER =
    "https://raw.githubusercontent.com/betteridea-dev/ao-package-manager/refs/heads/main/installer.lua";

// Common tags used across the application
export const CommonTags: Tag[] = [
    {
        name: "Name",
        value: "Drawwy"
    },
    { name: "Version", value: "2.0.0" },
    { name: "Authority", value: "fcoN_xJeisVsPXA-trzVAuIiqO3ydLQxM-L4XbrQKzY" },
    { name: "Scheduler", value: "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA" },
];

export interface DispatchResult {
    id: string;
    type?: 'BASE' | 'BUNDLED';
}

export interface Tag {
    name: string;
    value: string;
}

export interface WalletDetails {
    walletAddress: string;
    balance?: number;
}

interface GraphQLEdge {
    cursor: string;
    node: {
        id: string;
        recipient: string;
        block?: {
            timestamp: number;
            height: number;
        };
        tags: { name: string; value: string }[];
        data: { size: string; type?: string };
        owner: { address: string };
    };
}

interface MessageResponse {
    id: string;
    recipient: string;
    tags: { name: string; value: string }[];
    // @ts-expect-error ignore
    data;
    owner: string;
}

// GraphQL base query
const baseData = {
    query: "query ($entityId: String!, $limit: Int!, $sortOrder: SortOrder!, $cursor: String) { transactions(sort: $sortOrder first: $limit after: $cursor recipients: [$entityId] ingested_at: {min: 1696107600}) { count edges { cursor node { id recipient block { timestamp height } tags { name value } data { size } owner { address } } } } }",
    variables: {
        cursor: '',
        entityId: '',
        limit: 25,
        sortOrder: 'HEIGHT_DESC',
    },
};

// GraphQL operations
export const fetchGraphQL = async ({
    query,
    variables,
}: {
    query: string;
    variables: {
        cursor: string;
        entityId: string;
        limit: number;
        sortOrder: string;
    };
}) => {
    try {
        console.log('Fetching GraphQL data...');
        const response = await axios.post(GRAPHQL_URL, { query, variables });
        return response.data;
    } catch (error) {
        console.error('GraphQL fetch error:', error);
        throw error;
    }
};

// Message operations
export const fetchMessagesAR = async ({
    process,
}: {
    process: string;
}): Promise<MessageResponse[]> => {
    try {
        console.log('Fetching messages for process:', process);
        baseData.variables.entityId = process;

        const res = await fetchGraphQL({
            query: baseData.query,
            variables: baseData.variables,
        });

        const messages = res.data.transactions.edges.map((m: GraphQLEdge) => ({
            id: m.node.id,
            recipient: m.node.recipient,
            tags: m.node.tags,
            data: m.node.data,
            owner: m.node.owner.address,
        }));

        const detailed = await Promise.all(
            messages.map(async (m: MessageResponse) => {
                try {
                    const res = await axios.get(`${GATEWAY_URL}/${m.id}`);
                    return { ...m, data: res.data };
                } catch (error) {
                    console.error(`Failed to fetch message ${m.id}:`, error);
                    return null;
                }
            })
        );

        return detailed.filter((item): item is MessageResponse => item !== null);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        throw error;
    }
};

export const messageAR = async ({
    tags = [],
    data = '',
    process,
}: {
    tags?: Tag[];
    data?: string;
    process: string;
}): Promise<string> => {
    if (typeof window === 'undefined') {
        throw new Error('Cannot send message in non-browser environment');
    }
    // Dynamically import aoconnect functions
    const { connect, createSigner } = await import('@permaweb/aoconnect');

    const ao = connect({
        GATEWAY_URL,
        GRAPHQL_URL,
        MODE,
        CU_URL,
    });
    try {
        console.log('Sending message to process:', process);
        if (!process) throw new Error('Process ID is required.');

        const allTags = [...CommonTags, ...tags];
        const messageId = await ao.message({
            data,
            process,
            tags: allTags,
            signer: createSigner(window.arweaveWallet),
        });

        console.log('Message sent successfully:', messageId);
        return messageId;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Process operations
export const spawnProcess = async (
    name: string,
    tags: Tag[] = [],
    data?: string
): Promise<string> => {
    if (typeof window === 'undefined') {
        throw new Error('Cannot spawn process in non-browser environment');
    }
    // Dynamically import aoconnect functions
    const { connect, createSigner } = await import('@permaweb/aoconnect');
    const ao = connect({
        GATEWAY_URL,
        GRAPHQL_URL,
        MODE,
        CU_URL,

    });
    console.log('Spawning new process...');
    const allTags = [...CommonTags, ...tags];
    if (name) allTags.push({ name: 'Name', value: name });

    try {
        const processId = await ao.spawn({
            module: AOModule,
            scheduler: AOScheduler,
            signer: createSigner(window.arweaveWallet),
            tags: allTags,
            data: data
        });
        console.log('processId', processId);

        console.log('Process spawned successfully:', processId);
        return processId;
    } catch (error) {
        console.error('Spawn process error:', error);
        throw error;
    }
};

// Transaction operations
export const transactionAR = async ({
    data,
}: {
    data: string;
}): Promise<DispatchResult> => {
    if (typeof window === 'undefined' || !window.arweaveWallet) {
        throw new Error('Wallet connection required in browser environment');
    }
    const arweave = Arweave.init({
        host: HOST_NAME,
        port: PORT_NUM,
        protocol: PROTOCOL_TYPE,
    });

    try {
        console.log('Creating transaction...');
        // connectWallet should ideally be called beforehand via useAuth().login()

        const transaction = await arweave.createTransaction({ data });
        // Assuming dispatch is available after connection
        const signed: DispatchResult =
            await window.arweaveWallet.dispatch(transaction);
        console.log('Transaction signed and dispatched:', signed);
        return signed;
    } catch (error) {
        console.error('Transaction error:', error);
        throw error;
    }
};

// Lua operations
export async function runLua({
    code,
    process,
    tags = [],
}: {
    code: string;
    process: string;
    tags?: Tag[];
}): Promise<Record<string, unknown> & { id: string }> {
    if (typeof window === 'undefined') {
        throw new Error('Cannot run Lua in non-browser environment');
    }
    // Dynamically import aoconnect functions
    const { connect, createSigner } = await import('@permaweb/aoconnect');
    const ao = connect({
        GATEWAY_URL,
        GRAPHQL_URL,
        MODE,
        CU_URL,

    });
    try {
        console.log('Running Lua code...');
        const finalTags = [
            ...CommonTags,
            ...tags,
            { name: 'Action', value: 'Eval' },
        ];

        const messageId: string = await ao.message({
            process,
            data: code,
            signer: createSigner(window.arweaveWallet),
            tags: finalTags,
        });

        // const messageResult: {
        //   // @ts-expect-error ignore
        //   Output
        //   // @ts-expect-error ignore
        //   Messages
        //   // @ts-expect-error ignore
        //   Spawns
        //   // @ts-expect-error ignore
        //   Error
        // } = await ao.result({
        //   process,
        //   message: messageId,
        // });

        const finalResult = { id: messageId };
        // console.log('messageResult', messageResult);
        console.log('Lua execution completed:', finalResult);
        return finalResult;
    } catch (error) {
        console.error('Lua execution error:', error);
        throw error;
    }
}

// Handler operations
export async function readHandler({
    process,
    action,
    tags = [],
    data,
}: {
    process: string;
    action: string;
    tags?: Tag[];
    data?: Record<string, unknown>;
}): Promise<Record<string, unknown> | null> {
    // Dynamically import aoconnect connect
    const { connect } = await import('@permaweb/aoconnect');
    const ao = connect({
        GATEWAY_URL,
        GRAPHQL_URL,
        MODE,
        CU_URL,

    })
    try {
        console.log('Reading handler using legacy dryrun...');
        const allTags = [{ name: 'Action', value: action }, ...tags];
        const newData = JSON.stringify(data || {});

        const response = await ao.dryrun({
            process,
            data: newData,
            tags: allTags,
        });

        const message = response.Messages?.[0];
        if (message?.Data) {
            try {
                return JSON.parse(message.Data);
            } catch (parseError) {
                console.error('Error parsing message data:', parseError);
                return { rawData: message.Data };
            }
        }
        if (message?.Tags) {
            return message.Tags.reduce(
                (acc: Record<string, string>, { name, value }: Tag) => {
                    acc[name] = value;
                    return acc;
                },
                {}
            );
        }
        console.warn('Read handler dryrun returned no data or tags:', response);
        return null;
    } catch (error) {
        console.error('Read handler error:', error);
        throw error;
    }
}

// Wallet operations
export const useQuickWallet = async (): Promise<{
    key: JWKInterface;
    address: string;
}> => {
    // This function seems okay as Arweave.init might be safe server-side
    const arweave = Arweave.init({
        host: HOST_NAME,
        port: PORT_NUM,
        protocol: PROTOCOL_TYPE,
    });
    try {
        console.log('Generating quick wallet...');
        const key: JWKInterface = await arweave.wallets.generate();
        const address = await arweave.wallets.jwkToAddress(key);
        console.log('Quick wallet generated:', address);
        return { key, address };
    } catch (error) {
        console.error('Quick wallet error:', error);
        throw error;
    }
};

/*
export async function connectWallet(): Promise<string | undefined> {
  if (typeof window === 'undefined' || !window.arweaveWallet) {
    console.error(
      'Cannot connect wallet in non-browser environment or wallet not found'
    );
    return;
  }
  try {
    console.log('Connecting wallet...');
    // No need for explicit check again, done above

    await window.arweaveWallet.connect(
      [
        'ENCRYPT',
        'DECRYPT',
        'DISPATCH',
        'SIGNATURE',
        'ACCESS_TOKENS',
        'ACCESS_ADDRESS',
        'SIGN_TRANSACTION',
        'ACCESS_PUBLIC_KEY',
        'ACCESS_ALL_ADDRESSES',
        'ACCESS_ARWEAVE_CONFIG',
      ],
      {
        name: 'Anon',
        logo: 'https://arweave.net/pYIMnXpJRFUwTzogx_z5HCOPRRjCbSPYIlUqOjJ9Srs',
      },
      {
        host: HOST_NAME,
        port: PORT_NUM,
        protocol: PROTOCOL_TYPE,
      }
    );

    console.log('Wallet connected successfully');
    return 'connected wallet successfully';
  } catch (error) {
    if (error === 'User cancelled the AuthRequest') {
      // console.log('User cancelled the AuthRequest');
      return 'User cancelled the AuthRequest';
    }
    console.error('Connect wallet error:', error);
    throw error;
  }
}
*/


export const WalletConnectionResult = {
    ERROR: 'error',
    CONNECTED: 'connected',
    USER_CANCELLED: 'cancelled',
    WALLET_NOT_FOUND: 'wallet not found'
} as const;

export type WalletConnectionResult = typeof WalletConnectionResult[keyof typeof WalletConnectionResult];

export interface WalletConnectionResponse {
    status: WalletConnectionResult;
    message: string;
    error?: Error;
}


export async function connectWallet(): Promise<WalletConnectionResponse> {
    if (typeof window === 'undefined') {
        return {
            status: WalletConnectionResult.ERROR,
            message: 'Cannot connect wallet in non-browser environment'
        };
    }
    if (!window.arweaveWallet) {
        return {
            status: WalletConnectionResult.WALLET_NOT_FOUND,
            message: 'Arweave Wallet not found'
        };
    }

    try {
        console.log('Connecting wallet...');

        await window.arweaveWallet.connect(
            [
                'ENCRYPT',
                'DECRYPT',
                'DISPATCH',
                'SIGNATURE',
                // 'ACCESS_TOKENS',
                'ACCESS_ADDRESS',
                'SIGN_TRANSACTION',
                'ACCESS_PUBLIC_KEY',
                'ACCESS_ALL_ADDRESSES',
                'ACCESS_ARWEAVE_CONFIG',
            ],
            {
                name: 'Anon',
                logo: 'https://arweave.net/pYIMnXpJRFUwTzogx_z5HCOPRRjCbSPYIlUqOjJ9Srs',
            },
            {
                host: HOST_NAME,
                port: PORT_NUM,
                protocol: PROTOCOL_TYPE,
            }
        );

        console.log('Wallet connected successfully');
        return {
            status: WalletConnectionResult.CONNECTED,
            message: 'Connected wallet successfully'
        };

    } catch (error) {
        // More robust check for user cancellation
        console.log('[arkit.ts] errorMessage', error);
        const errorMessage = error instanceof Error ? error.message : String(error);

        if (errorMessage.toLowerCase().includes('cancel') ||
            errorMessage.toLowerCase().includes('rejected') ||
            errorMessage.toLowerCase().includes('denied')) {
            console.log('User cancelled the wallet connection request');
            return {
                status: WalletConnectionResult.USER_CANCELLED,
                message: 'User cancelled the connection request'
            };
        }

        console.error('Connect wallet error:', error);
        return {
            status: WalletConnectionResult.ERROR,
            message: 'Failed to connect wallet',
            error: error instanceof Error ? error : new Error(String(error))
        };
    }
}

export async function disconnectWallet(): Promise<void> {
    if (typeof window === 'undefined' || !window.arweaveWallet) {
        console.error(
            'Cannot disconnect wallet in non-browser environment or wallet not found'
        );
        return;
    }
    try {
        console.log('Disconnecting wallet...');
        await window.arweaveWallet.disconnect();
        console.log('Wallet disconnected successfully');
    } catch (error) {
        console.error('Disconnect wallet error:', error);
        throw error;
    }
}

export async function getWalletDetails(): Promise<WalletDetails> {
    if (typeof window === 'undefined' || !window.arweaveWallet) {
        throw new Error(
            'Cannot get wallet details in non-browser environment or wallet not found'
        );
    }
    try {
        // const arweave = Arweave.init({
        //   host: HOST_NAME,
        //   port: PORT_NUM,
        //   protocol: PROTOCOL_TYPE,
        // });
        const walletAddress = await window.arweaveWallet.getActiveAddress();
        // const balance = await arweave.wallets
        //   .getBalance(walletAddress)
        //   .then((balanceRaw) => {
        //     const balance = arweave.ar.winstonToAr(balanceRaw);
        //     return Number(balance);
        //   });
        return { walletAddress };
    } catch (error) {
        console.error('Get wallet details error:', error);
        throw error;
    }
}

// arweave-keyfile-FfVg-a1VmSfkvuPjloWV0035ZAijCtLXomKECmzzyEQ.json
export const jwk = {
    "kty": "RSA",
    "e": "AQAB",
    "n": "n3EvSjmA33bJ-76z_NETjNZXTkjXhsN7PK269S-GttcCbOd_GSwnGeheIP-61TEDgfMuMFG8U8Du-mUcpvP82Ue8ist1QqTqCOl4J4DtwzH_dwRyW_UImNpBB47HKKUdj9Y2ukF1eeMvIp0_L7Fqyk30hJ8wsMeX2gHKMnGCbvAVMP0mlJyeEJQzMQNsGSO7_E0S3NwR2UgTNToIY5LJvRbPDQAuhcAWEI-zEBLmeVzerXYI6KAlbdicsetF7jqA-gFAK1-AtLoeFQ-BLaY99PBRU9GfyCUinrWyt-T4FM4EDt60dKy8CjGzE955THVIJ-hgBXD_6rz7R6lfXp1qXNaIjuLs6obPf0i4Ex1jQOe_tzEQ4pp0UPnzDmyihYOopjLptdPKABtZ3f3ENFb92CwAZ9tuTrFI3KvRHE-qf98weTmbKHkx6Xu0fkLZDEZOTAsZqIkwhCu6rUZXcqZYB1Q075ZAiz1ej0SK_SEwnI2YTaAW7dJGxj1dm3pFM1kGzTP_b9jDQU_Rf_5bDndqIbOJY1DPwZPlqBr8TwOP3c7azz5OD3M5gTeHAt71ssbFEt9h6jLt8QEXEaLTch33XvV2_iRwUB5erjp2-rLjdprhZ6RK5w2L-MGjLwwPdcIUNNPnkOr3uTSP6bavNn67pWPsC38jIG9XR5kcWm1uOUk",
    "d": "EE4U1fRXd4LAWRxBb8M5ypdIylqsn71x5tylV9mKXzxRpS1vU_Wt8fpPVfSQ-KhQgYOK36ocJjx-s-CPM4uT-exaHZ982FnhDRRDE1cd-W4tf9BWmYzPWkJHkCxLtZ5dDY6MfjOffd17voByK8Bq-VFLhhx5cDqZDtRMByiQfCPVJvNcdKonh-5_5a1B6rg6yyxel3Nx59R1EmZi4TvroYipl9zC5S6lkv__Ac_M_fA_XWHKu29VJIyYSaGTvy8AbZCfLVBQ6yp1VRYG0dJEV74Tswym2GLjzXMrWZ7yt73xsEuaDKx1dl1qwMdphCYiQOKEn0nVAf5dfBCYDibu73IjYVaO3_sd7DT5JjaU5FjWWiywUzNOKNqMtEJMegbbanQvsJu_sxlqINVDzRjt9HILy3xh51gPmzRnKxARI4Kpox_x5v6ICy0FCiioJ0qx1nxv9o80ThKkIcEF6lBmsXzv0IEO3hhuAgDNCyitv2xdygjyW44-bMIYGlTGqF9z_Bvcw5a1RusJ66GbE0q-IMskDiEUMvO_eELGCX2wQGYBaZ_zaapslp-NSxSXey9y9YRnT5dm42TPTc3a9xeYHj3HDaU6pG4BQxzFE2QXK8dy8UhTHdfwgv_rMJPbg9F3ZYqReOVkA2yGJiOdy66-0jcbdO28XRGbWfnGo4mtr5k",
    "p": "1puEODTTCn0i2L8Gn9emJswp438qkGQT64CaVzB-z86JzhX5JNUJ2n22QZsJDvc4YVYBi5AtsHBbvR9NTkVlz6lfn_XtIYhqsvf5Fgy8UL2rkGlYLlk-8jN1V8anX_TTMT5IzwHvtJxH1QMW9jaKQuKRPrEqN5eaQqkcBpxWkn54INyfj01PZgUisHz4Efe-gRy2OeGy0yKMvo2fMx2IcEgRkUooJS2i-OFza2B-ce4LJ3DRdJCXfGCiU5GELqXxSmm0V7073p_MeLUwGmC4dQQc_CWZW1T1Vab-eGQiOGcoa4Xnf4a2EPEvF5ryDtULUIb2-6ov-bm6J3GOlJuQzw",
    "q": "vjHROFj1kQdKX7msA4AIizgKK1M7YGoStNo-VvbdZfNFbuff_9j4C1YmE9aSdpYxyF1VujuloGYXgb2rlluRjNkoDghHxzxWe7jO6GmcoKWXJgaaLy-v6Zxw9HXtpAJqUJkWvX1vyWKdp6QqtHQSDuwws7yHnHEtVaij72HFZPZbpouSgOP33Cr-Drz5X4KZ2O71Kcl2k3GXzKU5B8Q5x-3k950XImpAouFag5q2oDyFt-j_vDUPHwEMo6UN2Lw8KwpoRT1xlEAZhilgg8lCq3Ovhr7teXCUU68qHqDfYTdwGs0_HwL44bUWYYHYPbChVgYeoOlctmHnZPZNBNsqZw",
    "dp": "QLI_aOZb3OSelbL430UWnMmdsyyJ-1-ANdXeMXy4LhN4rb0oD7d9sfWF9T80uuNChu1zp8w-SduFfH0sQ_Vd3P2Vi1aLNzm12OAyojgSqVCUoQNxBv_2nvNuY5jKqn3XERhSwL03sz4N1aSJzo3gnotI-BpWvM2iPohWn5OP8bfYpSd9nqjSz9GqhIQYEOqb7rZmJQrqawYWYfe1z6YOlLLVQPSXJ6YbZGYq8mrzk4sMp8Y2DqrsUB2dsg3DSIDUPfeh23V70ABilt0gdENGOFiWGFmJYuQ41apzOn4NZu2KXOfQQzysNG1RIg-e-2O0doFJgdLrhaA9A1kTf69qNw",
    "dq": "QweZncs0WHWCT7RHHECuQipw4w4FWhhoGVblK477Pif7a3fK6QdVe-FTsCAqJCMQznWedfD5kUsJs87dvzLsXABYboGakmwAasAaI6y8550UZPFku4aJ78ITyQQayXeUcm1Rp1yi3g2kVGW2KzzQ9HNnQqEKBieY-5xgkkgZ4lg0usBr1IMDYpPAT_9nv7JueBbXTm_TG2moPxZnwAX2-zArRt0VPyrFNuJHHSSUgmpyEfvKzVDB0IJ1KuNLuvu0FNMpJmXeNopUtIS2oBt5JKWz0cBOP0Ne8xNDu-GkeEWqe7ekLFDG1_0TMzAovq0WXxPvDXTRGPHuNBXd1P1Mtw",
    "qi": "xdkG40t_Pterk6rpaxFCIVllaWIJOyVqPHCXdFeeJnat_IXz2t1-mw9oXk1nkV9SUPmA0dYudJpIo5KIdkyKwVtl6JNu5JeDut2rojyaS8CSxHxxVkBbeFYkl1-60AlRfSLkzbjvXK-6CwUjb7R-ILSqqi4QC78wPoBuq0CDrUw3GCT9xvr2K4Pu9qanYCbal71fjGmu7ICMwJJwx05Sgc1L42WprRia80UlRVIuFbplJFNVjgBbGTI4aAE3XzVmMhorsvfwwwEJyjioVf2aOgtKt7wCi-oNosnVbGrV1mjFvWflVJa8tDnqtEK7PgSXsW9q-cnR_X3Il1lCUGvkuw"
}