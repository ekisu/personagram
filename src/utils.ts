import { assert as typedAssert } from 'typed-assert';

export function assert(condition: any, msg?: string): asserts condition {
    typedAssert(condition, msg);   
}