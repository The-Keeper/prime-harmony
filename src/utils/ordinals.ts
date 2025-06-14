type OrdinalRules = Partial<Record<Intl.LDMLPluralRule, string>>;

export function createOrdinalFunction(locale: string, suffixes: OrdinalRules) {
  // Create the PluralRules instance once during initialization
  const pluralRules = new Intl.PluralRules(locale, { type: 'ordinal' });
  
  // Return a pre-configured function
  return (number: number) => {
    if (Number.isNaN(number) || !Number.isFinite(number)) {
      return number.toString();
    }
    
    const pluralRule = pluralRules.select(number) as Intl.LDMLPluralRule;    
    return number.toString() + (suffixes[pluralRule] ?? suffixes.other);
  };
}