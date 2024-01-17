import { Resource, Core, Store } from '@tomic/react';

export async function filterAllowsOnly(
  resource: Resource<Core.Property>,
  isA: string,
  store: Store,
): Promise<string[]> {
  const allowsOnly = resource.props.allowsOnly ?? [];
  const filteredTags: string[] = [];

  for (const line of allowsOnly) {
    const lineResource = await store.getResourceAsync(line);

    if (lineResource.hasClasses(isA)) {
      filteredTags.push(line);
    }
  }

  return filteredTags;
}
