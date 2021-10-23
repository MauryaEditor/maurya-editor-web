import React from "react";
import { BehaviorSubject } from "rxjs";

export const HeaderHeight = new BehaviorSubject<string>("2.5em");

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
