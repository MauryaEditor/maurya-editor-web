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
export const SimpleComponent: React.FC<object> = (props: any) => {
  return (
    <div style={{ height: "2em", position: "relative" }}>
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "0.5em",
          transform: "translate(0, -50%)",
        }}
      >
        {props.name}
      </span>
    </div>
  );
};
