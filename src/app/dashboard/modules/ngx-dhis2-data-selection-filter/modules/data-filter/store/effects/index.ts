import { DataGroupEffects } from './data-group.effects';
import { FunctionEffects } from './function.effects';
import { FunctionRuleEffects } from './function-rule.effects';
import { IndicatorEffects } from './indicator.effects';
import { IndicatorGroupEffects } from './indicator-group.effects';
import { DataFilterEffects } from './data-filter.effects';

export const effects: any[] = [
  DataFilterEffects,
  DataGroupEffects,
  FunctionEffects,
  FunctionRuleEffects,
  IndicatorEffects,
  IndicatorGroupEffects
];
