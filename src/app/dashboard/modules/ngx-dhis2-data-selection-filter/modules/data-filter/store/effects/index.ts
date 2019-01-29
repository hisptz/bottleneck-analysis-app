import { FunctionEffects } from './function.effects';
import { FunctionRuleEffects } from './function-rule.effects';
import { IndicatorEffects } from './indicator.effects';
import { IndicatorGroupEffects } from './indicator-group.effects';
import { DataFilterEffects } from './data-filter.effects';

export const effects: any[] = [
  DataFilterEffects,
  FunctionEffects,
  FunctionRuleEffects,
  IndicatorEffects,
  IndicatorGroupEffects
];
