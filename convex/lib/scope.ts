import type { Id } from "../_generated/dataModel";

export function requireSameOrg(
  record: { organisationId: Id<"organisations"> },
  expectedOrgId: Id<"organisations">,
): void {
  if (record.organisationId !== expectedOrgId) {
    throw new Error("Scope violation: record belongs to a different organisation");
  }
}
