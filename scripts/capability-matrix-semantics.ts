export const temporalInputKinds = [
  "Instant",
  "ZonedDateTime",
  "PlainDate",
  "PlainTime",
] as const;

export type TemporalInputKind = (typeof temporalInputKinds)[number];

export const capabilityMatrixIntro =
  "Every function at a glance — which Temporal types it **accepts** as input and what it **returns**. Generated directly from the current source API.";

const semanticInputNotes: Record<
  string,
  Partial<Record<TemporalInputKind, string>>
> = {};

export function semanticInputNote(
  functionName: string,
  inputKind: TemporalInputKind,
): string | undefined {
  const notes = semanticInputNotes[
    functionName as keyof typeof semanticInputNotes
  ] as Partial<Record<TemporalInputKind, string>> | undefined;

  return notes?.[inputKind];
}

export function capabilityCell(
  functionName: string,
  inputKind: TemporalInputKind,
  accepted: boolean,
): string {
  if (accepted) return "✅";
  return semanticInputNote(functionName, inputKind) ?? "·";
}
