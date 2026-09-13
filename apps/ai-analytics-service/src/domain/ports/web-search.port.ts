export const WEB_SEARCH_PORT = Symbol('WEB_SEARCH_PORT');

export interface WebSearchPort {
  search(query: string): Promise<string>;
}
