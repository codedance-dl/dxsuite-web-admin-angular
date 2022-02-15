/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateOperator } from '@ngxs/store';
import { Predicate } from '@ngxs/store/operators/internals';

export const isPredicate = <T>(value: Predicate<T> | boolean | number | number[]): value is Predicate<T> => typeof value === 'function';

export const findIndices = <T>(predicate: Predicate<T>, existing: Readonly<T[]>): number[] => existing.reduce<number[]>((acc, it, i) => {
    const index = predicate(it as any) ? i : -1;
    return invalidIndex(index) ? acc : [...acc, index];
  }, []);

export const isArrayNumber = (value: number[]): boolean => !value.some(isNumber);

export const invalidIndexs = <T>(indices: number[], existing: Readonly<T[]>): boolean => indices.some(index => !existing[index] || !isNumber(index) || invalidIndex(index));

export const isStateOperator = <T>(value: Partial<T> | StateOperator<T>): value is StateOperator<T> => typeof value === 'function';

export const isNumber = (value: any): value is number => typeof value === 'number';

export const invalidIndex = (index: number): boolean => Number.isNaN(index) || index === -1;

export const isObject = (value: any): boolean => typeof value === 'object';
