export default function useErrors(page: string): { errors: Array<any>; valid: boolean; validate: () => void } {
  return {
    errors: [],
    valid: true,
    validate: () => {},
  };
}
