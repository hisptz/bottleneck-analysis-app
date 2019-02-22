export function getDimensionItemType(dimension: string, dimensionItem: any) {
  switch (dimension) {
    case 'ou': {
      return (
        dimensionItem.dimensionItemType ||
        ((dimensionItem.dimensionItem || dimensionItem.id).indexOf('LEVEL') !==
        -1
          ? 'ORGANISATION_UNIT_LEVEL'
          : (dimensionItem.dimensionItem || dimensionItem.id).indexOf(
              'GROUP'
            ) !== -1
          ? 'ORGANISATION_UNIT_GROUP'
          : (dimensionItem.dimensionItem || dimensionItem.id).indexOf(
              'USER'
            ) !== -1
          ? 'USER_ORGANISATION_UNIT'
          : 'ORGANISATION_UNIT')
      );
    }
    default:
      return dimensionItem.dimensionItemType;
  }
}
