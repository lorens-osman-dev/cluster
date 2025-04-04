import { normalizePath } from 'obsidian';

interface ParsedPath {
  /** The full directory path such as '/home/user/dir' or 'folder/sub' */
  dir: string;
  /** The file name without extension */
  name: string;
}

export const path = {
  /**
   * Parses the file path into a directory and file name.
   * If the path string does not include a file name, it will default to
   * 'Untitled'.
   *
   * @example
   * parse('/one/two/file name')
   * // ==> { dir: '/one/two', name: 'file name' }
   *
   * parse('\\one\\two\\file name')
   * // ==> { dir: '/one/two', name: 'file name' }
   *
   * parse('')
   * // ==> { dir: '', name: 'Untitled' }
   *
   * parse('/one/two/')
   * // ==> { dir: '/one/two/', name: 'Untitled' }
   */
  parse(pathString: string): ParsedPath {
    //@ts-ignore
    const regex = /(?<dir>([^/\\]+[/\\])*)(?<name>[^/\\]*$)/;
    const match = String(pathString).match(regex);
    //@ts-ignore
    const { dir, name } = match && match.groups;
    return { dir, name: name || 'Untitled' };
  },

  /**
   * Joins multiple strings into a path using Obsidian's preferred format.
   * The resulting path is normalized with Obsidian's `normalizePath` func.
   * - Converts path separators to '/' on all platforms
   * - Removes duplicate separators
   * - Removes trailing slash
   */
  join(...strings: string[]): string {
    const parts = strings.map((s) => String(s).trim()).filter((s) => s != null);
    return normalizePath(parts.join('/'));
  },
};
