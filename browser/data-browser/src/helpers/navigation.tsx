import { paths } from '../routes/paths';
import { unknownSubject } from '@tomic/react';

/** Constructs a URL string with a route, a query Parameter and a value */
function constructURL(
  /** The base path, e.g. '/new' */
  path: string,
  queryParams: Record<string, string> | string[][],
): string {
  const params = new URLSearchParams(queryParams);

  return `${path}?${params}`;
}

const isRemoteResource = (subject: URL) =>
  window.location.origin !== subject.origin;

/** Constructs a URL for opening / showing a Resource. */
export function constructOpenURL(
  subject: string,
  extraParams: Record<string, string> = {},
): string {
  if (subject === unknownSubject) {
    return '#';
  }

  const url = new URL(subject);

  if (isRemoteResource(url)) {
    return constructURL(paths.show, { subject, ...extraParams });
  }

  const path = url.pathname + url.search;

  return path;
}

export function searchURL(query: string, scope?: string): string {
  return constructURL(paths.search, {
    query,
    ...(scope ? { queryscope: scope } : {}),
  });
}

/** Query parameters used by the `/new` route */
export const newURLParams = {
  classSubject: 'classSubject',
  parent: 'parent',
  newSubject: 'newSubject',
};

/** Constructs a URL for the New Resource form */
export function newURL(
  classUrl: string,
  parentURL?: string,
  subject?: string,
): string {
  const navTo = new URL(location.origin);
  navTo.pathname = paths.new;
  navTo.searchParams.append(newURLParams.classSubject, classUrl);
  parentURL && navTo.searchParams.append(newURLParams.parent, parentURL);
  subject && navTo.searchParams.append(newURLParams.newSubject, subject);

  return paths.new + navTo.search;
}

export function editURL(subject: string): string {
  return constructURL(paths.edit, { subject });
}

export function shareURL(subject: string): string {
  return constructURL(paths.share, { subject });
}

export function dataURL(subject: string): string {
  return constructURL(paths.data, { subject });
}

export function pathToURL(path: string): string {
  return window.location.origin + path;
}

export function importerURL(subject: string): string {
  return constructURL(paths.import, { subject });
}

export function historyURL(subject: string): string {
  return constructURL(paths.history, { subject });
}

/**
 * Constructs the URL for the `all-versions` endpoint. Assumes the current URL
 * supports that endpoint
 */
export function versionsURL(subject: string, baseURL: string): string {
  const url = new URL(baseURL);
  url.pathname = paths.allVersions;
  url.searchParams.append('subject', subject);

  return constructOpenURL(url.toString());
}

/** Takes the cursor position, finds the nearest `about=` attributes in DOM nodes */
export function getSubjectFromDom(): string | null {
  const found: string[] = [];
  // NodeList of items that the mouse is currently over in document order. The last element in the NodeList is the most specific, each preceding one should be a parent.
  const nodeList = document.querySelectorAll(':hover');
  nodeList.forEach(node => {
    // The about attirbute should contain a Subject
    const about = node.getAttribute('about');

    if (about !== null) {
      found.unshift(about);
    }
  });

  return found[0];
}
