import mime from 'mime-types';
import { ArweaveSigner, TurboFactory } from "@ardrive/turbo-sdk/web";
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { jwk } from './arkit';

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
export const CommonTags = [
    { name: 'App-Author', value: "aykansal" },
    { name: "Version", value: "2.0.0" },
    { name: "Authority", value: "fcoN_xJeisVsPXA-trzVAuIiqO3ydLQxM-L4XbrQKzY" },
    { name: "Scheduler", value: "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA" },
];
// Custom error class for insufficient balance
export class InsufficientBalanceError extends Error {
    constructor(required: number, current: number) {
        super(`Insufficient AR balance. Required: ${required.toFixed(4)} AR, Current: ${current.toFixed(4)} AR`);
        this.name = 'InsufficientBalanceError';
    }
}

const FREE_UPLOAD_SIZE = 100 * 1024 // 100KB in bytes

// Initialize authenticated client with Wander

const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https"
})

const signer = new ArweaveSigner(jwk as JWKInterface);

// const signer = new ArconnectSigner(window.arweaveWallet);
const turbo = TurboFactory.authenticated({ signer });

console.log('Turbo client initialized with ArconnectSigner');

function fileToUint8Array(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

export const uploadToTurbo = async (file: File, isManifest = false, creator: string) => {
    console.log(`Starting upload to Turbo for file: ${file.name}, size: ${file.size} bytes, isManifest: ${isManifest}`);

    const fileSize = file.size;
    const fileName = file.name;
    const contentType = file.type || mime.lookup(fileName) || 'application/octet-stream';

    console.log(`File details - Name: ${fileName}, Size: ${fileSize}, Content-Type: ${contentType}`);

    if (fileSize > FREE_UPLOAD_SIZE) {
        throw new Error('File size is too large');
    }

    try {
        console.log('Converting file to buffer...');
        const buffer = await fileToUint8Array(file);

        console.log('Starting file upload to Turbo...');
        const uploadResult = await turbo.uploadFile({
            fileStreamFactory: () => {
                return new ReadableStream({
                    start(controller) {
                        controller.enqueue(buffer);
                        controller.close();
                    }
                });
            },
            fileSizeFactory: () => fileSize,
            dataItemOpts: {
                tags: [
                    { name: 'Version', value: '1.0.0' },
                    { name: 'Artist', value: creator },
                    { name: 'Content-Type', value: contentType },
                    { name: 'App-Name', value: 'Drawwy' },
                    ...(isManifest ? [{ name: 'Type', value: 'manifest' }] : [])
                ]
            }
        });

        console.log(`Uploaded ${fileName} (${contentType}) successfully. TX ID: ${uploadResult.id}`);
        return uploadResult.id;
    } catch (error) {
        console.error('Upload error:', error);
        if (error instanceof Error && error.message.includes("File size is too large")) {
            console.log("File size is too large");
            return;
        }
        throw error;
    }
};

