export namespace namespace {
  const namespace = "naker_hotu";

  export function namespaced(value: string): string {
    return `${namespace}:${value}`;
  }
}
