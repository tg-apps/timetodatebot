import { z } from "zod";

import { integer, string } from "~/schemas";

function parseArgs(input: string) {
  const trimmedInput = input.trim();
  if (!trimmedInput) return [];
  const args = input.replaceAll("_", " ").split(/\s+/).filter(Boolean);
  return args;
}

function getArgsFromStringWithSchema<TSchema extends z.ZodType>({
  schema,
  input,
}: {
  schema: TSchema;
  input: string;
}) {
  const args = parseArgs(input);
  return schema.safeParse(args);
}

function getArgsFromString(input: string) {
  const schema = z.array(z.union([integer, string]));
  const args = parseArgs(input);
  return schema.safeParse(args);
}

export { getArgsFromString, getArgsFromStringWithSchema };
