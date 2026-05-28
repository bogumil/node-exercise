import type { ZodError } from 'zod';

type ZodValidationIssue = ZodError['issues'][number];

export function mapZodErrorToFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    mapZodIssue(fieldErrors, issue);
  }

  return fieldErrors;
}

function mapZodIssue(fieldErrors: Record<string, string[]>, issue: ZodValidationIssue) {
  if (issue.code === 'unrecognized_keys' && 'keys' in issue) {
    for (const key of issue.keys) {
      const unknownField = issue.path.length > 0 ? `${issue.path.join('.')}.${key}` : key;
      addFieldError(fieldErrors, unknownField, 'Unknown field');
    }
  } else {
    const field = issue.path.length > 0 ? issue.path.join('.') : '_root';

    addFieldError(fieldErrors, field, issue.message);
  }
}

function addFieldError(fieldErrors: Record<string, string[]>, field: string, message: string) {
  fieldErrors[field] ??= [];
  fieldErrors[field].push(message);
}
