import * as z from "zod/mini";

const string = z.string();
const integer = z.pipe(z.coerce.number(), z.int());
const tuple = z.tuple;
const union = z.union;

export { string, integer, tuple, union };
