import z from "zod";

const string = z.string();
const integer = z.coerce.number().int();
const tuple = z.tuple;
const union = z.union;

export { string, integer, tuple, union };
