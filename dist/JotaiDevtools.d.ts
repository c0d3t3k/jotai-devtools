/// <reference types="react" />
import { WritableAtom } from 'jotai';
interface Config {
    instanceID?: number;
    name?: string;
    serialize?: boolean;
    actionCreators?: any;
    latency?: number;
    predicate?: any;
    autoPause?: boolean;
}
interface JotaiDevtoolsProps {
    atom: WritableAtom<any, any>;
    name?: string;
    config?: Config;
}
export declare const useJotaiDevtools: ({ atom, name, config, ...props }: JotaiDevtoolsProps) => void;
export declare const JotaiDevtools: React.FC<JotaiDevtoolsProps>;
export {};
