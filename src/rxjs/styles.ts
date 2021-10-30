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
import React from "react";
import { BehaviorSubject } from "rxjs";

export const HeaderHeight = new BehaviorSubject<string>("3em");

export const MenuWidth = new BehaviorSubject<string>("5em");

export const WindowContainerStack = new BehaviorSubject<React.FC[]>([]);

export const SubContainerStack = new BehaviorSubject<React.FC[]>([]);

(globalThis as any).SubContainerStack = SubContainerStack;

export const WindowMouseUp = new BehaviorSubject<MouseEvent | null>(null);

(globalThis as any).WindowMouseUp = WindowMouseUp;

window.addEventListener("mouseup", (event) => {
	WindowMouseUp.next(event);
});

export const WindowMouseDown = new BehaviorSubject<MouseEvent | null>(null);

(globalThis as any).WindowMouseDown = WindowMouseDown;
