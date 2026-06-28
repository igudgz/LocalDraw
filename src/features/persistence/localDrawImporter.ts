import {
  LocalDrawSerializationError,
  validateLocalDrawFile,
  type LocalDrawFile,
} from "./localDrawSerializer";

export type LocalDrawImportSuccess = {
  ok: true;
  file: LocalDrawFile;
};

export type LocalDrawImportFailure = {
  ok: false;
  error: string;
};

export type LocalDrawImportResult = LocalDrawImportSuccess | LocalDrawImportFailure;

export function parseLocalDrawFile(raw: string): LocalDrawImportResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      error: "Invalid JSON in .localdraw file",
    };
  }

  try {
    validateLocalDrawFile(parsed);
  } catch (error) {
    if (error instanceof LocalDrawSerializationError) {
      return {
        ok: false,
        error: error.message,
      };
    }

    return {
      ok: false,
      error: "Failed to validate .localdraw file",
    };
  }

  return {
    ok: true,
    file: parsed,
  };
}
