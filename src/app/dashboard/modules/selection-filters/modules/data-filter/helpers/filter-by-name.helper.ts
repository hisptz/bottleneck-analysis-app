export function filterByName(list: any[], name: string) {
  const splittedName = name ? name.split(/[\.\-_,; ]/) : [];
  return splittedName.length > 0
    ? list.filter((item: any) =>
        splittedName.some(
          (nameString: string) =>
            item.name.toLowerCase().indexOf(nameString.toLowerCase()) !== -1
        )
      )
    : list;
}
