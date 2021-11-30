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
    along with Foobar.  If not, see <https://www.gnu.org/licenses/>.
 */

import { BehaviorSubject } from "rxjs";
import { AliasProperty } from "../properties/AliasProperty";
import { BooleanProperty } from "../properties/BooleanProperty";
import { TextProperty } from "../properties/TextProperty";
import { TextRequiredProperty } from "../properties/TextRequiredProperty";

export type PropertyItem = {
  comp: React.FC<{ ID: string; propertyName: string; initialValue: string }>;
};

export const PropertyRegistry = new BehaviorSubject<{
  [pkgSlashKey: string]: PropertyItem;
}>({
  "design/text": {
    comp: TextProperty,
  },
  "design/text-required": {
    comp: TextRequiredProperty,
  },
  "design/boolean": {
    comp: BooleanProperty,
  },
  "design/alias": {
    comp: AliasProperty,
  },
});