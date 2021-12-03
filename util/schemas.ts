const BadRequestSchema = (exampleMsg) => ({
  description: "Bad request error description",
  type: "object",
  properties: {
    message: { type: "string", description: "Reason of the error" },
  },
  example: {
    message: exampleMsg,
  },
  xml: {
    name: "xml",
  },
});

export const Schemas: any = {
  "POST/fetcher": {
    description: "Creates and initializes a fetcher that pulls HLS live stream and pushes to Mediapackage",
    tags: ["fetcher"],
    body: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of Session" },
        url: { type: "string", description: " Reachable url to HLS" },
        output: { type: "string", description: "Name of chosen Output Plugin type" },
        playload: {
          type: "object",
          description: "Neccessary configuration data associated with chosen Output Plugin type",
          properties: {
            additionalProperties: true,
          },
        },
      },
      example: {
        name: "eyevinn",
        url: "https://demo.vc.eyevinn.technology/channels/eyevinn/master.m3u8",
        output: "mediapackage",
        payload: {
          ingestUrls: [
            {
              url: "https://xxxxx.mediapackage.xxxxx.amazonaws.com/in/v2/xxxxx/xxxxx/channel",
              username: "********************************",
              password: "********************************",
            },
          ],
        },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
          fetcherId: { type: "string" },
          requestData: {
            type: "object",
            properties: {
              name: { type: "string" },
              url: { type: "string" },
              dest: { type: "string" },
            },
          },
        },
        example: {
          message: "Created an Fetcher and started pulling from HLS Live Stream",
          fetcherId: "fef3454-g5y555iu7i8-i8i654",
          requestData: {
            name: "my_fetcher",
            url: "http://live.hls.stream/master.3u8",
            dest: "mediapackage",
          },
        },
      },
      404: BadRequestSchema("Unsupported Plugin Type '*'"),
      409: BadRequestSchema("Error with POST request"),
    },
  },

  "GET/fetcher": {
    description: "Gets List of All Active Fetchers",
    tags: ["fetcher"],

    response: {
      200: {
        description: "On success returns an array of active pull-push sessions",
        type: "array",
        items: {
          type: "object",
          properties: {
            fetcherId: { type: "string", description: "Unique identifier for fetcher session" },
            created: { type: "string", description: "Creation date" },
            name: { type: "string", description: "Name of Session" },
            url: { type: "string", description: " Reachable url to HLS" },
            dest: { type: "string", description: "gonna be some other type later" },
            concurrency: { type: "number", description: "Number of maximum concurrent workers" },
          },
          example: {
            fetcherId: "111310a5-3d46-4c94-a1fa-8c00164e9774",
            created: "2021-11-13T13:08:52.454Z",
            name: "The First Fetcher",
            url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
            dest: "TBD",
            concurrency: 8,
          },
        },
      },
    },
  },
  "DELETE/fetcher/:fetcherId": {
    description: "Deletes the fetcher",
    tags: ["fetcher"],
    params: {
      fetcherId: {
        type: "string",
        description: "an identifier for the fetcher to delete.",
      },
    },
    response: {
      204: {},
      404: BadRequestSchema("Fetcher with specifed ID was not found."),
    },
  },
};
