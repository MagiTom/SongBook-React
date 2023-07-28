export const DBConfig = {
    name: "SongList",
    version: 1,
    objectStoresMeta: [
      {
        store: "songs",
        storeConfig: { keyPath: "id", autoIncrement: true },
        storeSchema: [
          { name: "title", keypath: "title", options: { unique: false } },
          { name: "text", keypath: "text", options: { unique: false } },
          { name: "semitones", keypath: "semitones", options: { unique: false } },
        ],
      },
    ],
  };