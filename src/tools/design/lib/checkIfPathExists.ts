/**
    Copyright 2021 Quaffles    
 
    This file is part of Maurya Editor.
    Maurya Editor is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.
    Maurya Editor is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with Quaffles.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * check if path exists in obj
 * if terminal element is undefined, it will treat it as if path doesn't exists
 * @param obj
 * @param path
 * @returns
 */
export const checkIfPathExists = (
  obj: { [key: string | number]: any },
  path: (string | number)[]
): boolean => {
  let curr: any = obj;
  for (let i = 0; i < path.length; i++) {
    curr = curr[path[i]];
    if (!curr) {
      return false;
    }
  }
  return true;
};
