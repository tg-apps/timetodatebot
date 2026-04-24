const pr = new Intl.PluralRules("ru-RU");

function getPluralForm(
  number: number,
  forms: readonly [one: string, few: string, many: string],
): string {
  const rule = pr.select(number);

  switch (rule) {
    case "one":
      return forms[0];
    case "few":
      return forms[1];
    default:
      return forms[2];
  }
}

export { getPluralForm };
