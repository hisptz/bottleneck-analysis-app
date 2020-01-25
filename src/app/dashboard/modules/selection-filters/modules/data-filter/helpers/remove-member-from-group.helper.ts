import { Determinant } from 'src/app/models';

export function removeMemberFromGroup(group: Determinant, member: any) {
  if (!group) {
    return null;
  }

  return {
    ...group,
    members: (group.members || []).filter(
      (memberItem: any) => memberItem.id !== member.id
    ),
  };
}
