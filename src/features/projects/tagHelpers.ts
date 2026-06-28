export function parseTagsInput(input: string): string[] {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

export function formatTagsForInput(tags: string[]): string {
  return tags.join(", ");
}
