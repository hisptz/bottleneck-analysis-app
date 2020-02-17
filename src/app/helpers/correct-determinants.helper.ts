import { Determinant } from '../models';
import { generateDeterminants } from './generate-determinants.helper';
import { find } from 'lodash';

export function correctDeterminants(determinants: Determinant[]) {
  const defaultDeterminants = generateDeterminants();
  if (!determinants || determinants.length === 0) {
    return defaultDeterminants;
  }
  return determinants.map((determinant: Determinant) => {
    if (!determinant.sortOrder) {
      const availableDeterminant: Determinant =
        find(defaultDeterminants, ['code', determinant.code]) ||
        find(defaultDeterminants, ['name', determinant.name]);

      return availableDeterminant
        ? { ...determinant, sortOrder: availableDeterminant.sortOrder }
        : determinant;
    }

    return determinant;
  });
}
