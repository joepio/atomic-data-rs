/* -----------------------------------
 * GENERATED WITH @tomic/cli
 * For more info on how to use ontologies: https://github.com/atomicdata-dev/atomic-server/blob/develop/browser/cli/readme.md
 * -------------------------------- */

import type { OntologyBaseObject, BaseProps } from '../index.js';

export const server = {
  classes: {
    error: 'https://atomicdata.dev/classes/Error',
    endpoint: 'https://atomicdata.dev/classes/Endpoint',
    drive: 'https://atomicdata.dev/classes/Drive',
    redirect: 'https://atomicdata.dev/classes/Redirect',
    file: 'https://atomicdata.dev/classes/File',
    invite: 'https://atomicdata.dev/classes/Invite',
    endpointResponse:
      'https://atomicdata.dev/ontology/server/class/endpoint-response',
  },
  properties: {
    agent: 'https://atomicdata.dev/properties/invite/agent',
    altText: 'https://atomicdata.dev/ontology/server/property/alt-text',
    attachments: 'https://atomicdata.dev/properties/attachments',
    checksum: 'https://atomicdata.dev/properties/checksum',
    children: 'https://atomicdata.dev/properties/children',
    createdBy: 'https://atomicdata.dev/properties/createdBy',
    defaultOntology:
      'https://atomicdata.dev/ontology/server/property/default-ontology',
    destination: 'https://atomicdata.dev/properties/destination',
    downloadUrl: 'https://atomicdata.dev/properties/downloadURL',
    drives: 'https://atomicdata.dev/properties/drives',
    filename: 'https://atomicdata.dev/properties/filename',
    filesize: 'https://atomicdata.dev/properties/filesize',
    imageHeight: 'https://atomicdata.dev/properties/imageHeight',
    imageWidth: 'https://atomicdata.dev/properties/imageWidth',
    internalId: 'https://atomicdata.dev/properties/internalId',
    mimetype: 'https://atomicdata.dev/properties/mimetype',
    parameters: 'https://atomicdata.dev/properties/endpoint/parameters',
    property: 'https://atomicdata.dev/properties/search/property',
    publicKey: 'https://atomicdata.dev/properties/invite/publicKey',
    redirectAgent: 'https://atomicdata.dev/properties/invite/redirectAgent',
    responseMessage:
      'https://atomicdata.dev/ontology/server/property/response-message',
    results: 'https://atomicdata.dev/properties/endpoint/results',
    status: 'https://atomicdata.dev/ontology/server/property/status',
    target: 'https://atomicdata.dev/properties/invite/target',
    usagesLeft: 'https://atomicdata.dev/properties/invite/usagesLeft',
    users: 'https://atomicdata.dev/properties/invite/users',
    write: 'https://atomicdata.dev/properties/invite/write',
  },
  __classDefs: {
    ['https://atomicdata.dev/classes/Error']: [
      'https://atomicdata.dev/properties/description',
    ],
    ['https://atomicdata.dev/classes/Endpoint']: [
      'https://atomicdata.dev/properties/description',
      'https://atomicdata.dev/properties/endpoint/parameters',
    ],
    ['https://atomicdata.dev/classes/Drive']: [
      'https://atomicdata.dev/properties/read',
      'https://atomicdata.dev/properties/children',
      'https://atomicdata.dev/properties/description',
      'https://atomicdata.dev/properties/subresources',
      'https://atomicdata.dev/properties/write',
      'https://atomicdata.dev/ontology/server/property/default-ontology',
    ],
    ['https://atomicdata.dev/classes/Redirect']: [
      'https://atomicdata.dev/properties/destination',
      'https://atomicdata.dev/properties/invite/redirectAgent',
    ],
    ['https://atomicdata.dev/classes/File']: [
      'https://atomicdata.dev/properties/downloadURL',
      'https://atomicdata.dev/properties/description',
      'https://atomicdata.dev/properties/filesize',
      'https://atomicdata.dev/properties/filename',
      'https://atomicdata.dev/properties/checksum',
      'https://atomicdata.dev/properties/mimetype',
      'https://atomicdata.dev/properties/internalId',
      'https://atomicdata.dev/properties/imageWidth',
      'https://atomicdata.dev/properties/imageHeight',
      'https://atomicdata.dev/ontology/server/property/alt-text',
    ],
    ['https://atomicdata.dev/classes/Invite']: [
      'https://atomicdata.dev/properties/invite/target',
      'https://atomicdata.dev/properties/invite/write',
      'https://atomicdata.dev/properties/createdBy',
      'https://atomicdata.dev/properties/invite/users',
      'https://atomicdata.dev/properties/invite/usagesLeft',
    ],
    ['https://atomicdata.dev/ontology/server/class/endpoint-response']: [
      'https://atomicdata.dev/ontology/server/property/status',
      'https://atomicdata.dev/ontology/server/property/response-message',
    ],
  },
} as const satisfies OntologyBaseObject;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Server {
  export type Error = typeof server.classes.error;
  export type Endpoint = typeof server.classes.endpoint;
  export type Drive = typeof server.classes.drive;
  export type Redirect = typeof server.classes.redirect;
  export type File = typeof server.classes.file;
  export type Invite = typeof server.classes.invite;
  export type EndpointResponse = typeof server.classes.endpointResponse;
}

declare module '../index.js' {
  interface Classes {
    [server.classes.error]: {
      requires: BaseProps | 'https://atomicdata.dev/properties/description';
      recommends: never;
    };
    [server.classes.endpoint]: {
      requires:
        | BaseProps
        | 'https://atomicdata.dev/properties/description'
        | typeof server.properties.parameters;
      recommends: never;
    };
    [server.classes.drive]: {
      requires: BaseProps;
      recommends:
        | 'https://atomicdata.dev/properties/read'
        | typeof server.properties.children
        | 'https://atomicdata.dev/properties/description'
        | 'https://atomicdata.dev/properties/subresources'
        | 'https://atomicdata.dev/properties/write'
        | typeof server.properties.defaultOntology;
    };
    [server.classes.redirect]: {
      requires: BaseProps | typeof server.properties.destination;
      recommends: typeof server.properties.redirectAgent;
    };
    [server.classes.file]: {
      requires: BaseProps | typeof server.properties.downloadUrl;
      recommends:
        | 'https://atomicdata.dev/properties/description'
        | typeof server.properties.filesize
        | typeof server.properties.filename
        | typeof server.properties.checksum
        | typeof server.properties.mimetype
        | typeof server.properties.internalId
        | typeof server.properties.imageWidth
        | typeof server.properties.imageHeight
        | typeof server.properties.altText;
    };
    [server.classes.invite]: {
      requires: BaseProps | typeof server.properties.target;
      recommends:
        | typeof server.properties.write
        | typeof server.properties.createdBy
        | typeof server.properties.users
        | typeof server.properties.usagesLeft;
    };
    [server.classes.endpointResponse]: {
      requires:
        | BaseProps
        | typeof server.properties.status
        | typeof server.properties.responseMessage;
      recommends: never;
    };
  }

  interface PropTypeMapping {
    [server.properties.agent]: string;
    [server.properties.altText]: string;
    [server.properties.attachments]: string[];
    [server.properties.checksum]: string;
    [server.properties.children]: string[];
    [server.properties.createdBy]: string;
    [server.properties.defaultOntology]: string;
    [server.properties.destination]: string;
    [server.properties.downloadUrl]: string;
    [server.properties.drives]: string[];
    [server.properties.filename]: string;
    [server.properties.filesize]: number;
    [server.properties.imageHeight]: number;
    [server.properties.imageWidth]: number;
    [server.properties.internalId]: string;
    [server.properties.mimetype]: string;
    [server.properties.parameters]: string[];
    [server.properties.property]: string;
    [server.properties.publicKey]: string;
    [server.properties.redirectAgent]: string;
    [server.properties.responseMessage]: string;
    [server.properties.results]: string[];
    [server.properties.status]: number;
    [server.properties.target]: string;
    [server.properties.usagesLeft]: number;
    [server.properties.users]: string[];
    [server.properties.write]: boolean;
  }

  interface PropSubjectToNameMapping {
    [server.properties.agent]: 'agent';
    [server.properties.altText]: 'altText';
    [server.properties.attachments]: 'attachments';
    [server.properties.checksum]: 'checksum';
    [server.properties.children]: 'children';
    [server.properties.createdBy]: 'createdBy';
    [server.properties.defaultOntology]: 'defaultOntology';
    [server.properties.destination]: 'destination';
    [server.properties.downloadUrl]: 'downloadUrl';
    [server.properties.drives]: 'drives';
    [server.properties.filename]: 'filename';
    [server.properties.filesize]: 'filesize';
    [server.properties.imageHeight]: 'imageHeight';
    [server.properties.imageWidth]: 'imageWidth';
    [server.properties.internalId]: 'internalId';
    [server.properties.mimetype]: 'mimetype';
    [server.properties.parameters]: 'parameters';
    [server.properties.property]: 'property';
    [server.properties.publicKey]: 'publicKey';
    [server.properties.redirectAgent]: 'redirectAgent';
    [server.properties.responseMessage]: 'responseMessage';
    [server.properties.results]: 'results';
    [server.properties.status]: 'status';
    [server.properties.target]: 'target';
    [server.properties.usagesLeft]: 'usagesLeft';
    [server.properties.users]: 'users';
    [server.properties.write]: 'write';
  }
}
