import { InterventionConfig } from "../../../shared/interfaces/interventionConfig";

export function validate(interventionConfig: InterventionConfig): boolean {
  return Boolean(interventionConfig.name);
}
