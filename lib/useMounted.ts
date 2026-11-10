import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false au rendu serveur et à l'hydratation, true ensuite : pour ce qui dépend de l'heure ou du navigateur. */
export const useMounted = () => useSyncExternalStore(noop, () => true, () => false);
