import { HashFunction } from '../bin/bin';
export declare const benchmarkHashingFunction: <T extends HashFunction>(hashFunctionName: string, hashFunctionPromise: Promise<T>, nodeJsAlgorithm: "ripemd160" | "sha1" | "sha256" | "sha512") => void;
