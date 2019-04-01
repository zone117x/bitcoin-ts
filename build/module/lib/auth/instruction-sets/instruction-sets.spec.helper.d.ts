import { AuthenticationVirtualMachine } from '../virtual-machine';
import { MinimumProgramState } from './common/common';
export declare type Expectation<ProgramState> = [ProgramState, Partial<ProgramState>];
export declare const testVMOperation: <ProgramState extends MinimumProgramState<number>>(name: string, getVm: () => AuthenticationVirtualMachine<ProgramState>, steps: ReadonlyArray<[ProgramState, Partial<ProgramState>]>) => void;
