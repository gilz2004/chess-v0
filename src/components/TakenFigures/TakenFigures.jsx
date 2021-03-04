import React from "react";
import { figureDraw } from "../../boardEssentials";
import {
  TakenFiguresWrapper,
  TakenFigure,
  TakenFiguresBox,
} from "./TakenFigures.styles";

export default function TakenFigures({ takenFigures }) {
  return (
    <TakenFiguresWrapper>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "white",
        }}
      >
        Taken figures{" "}
      </h2>
      <TakenFiguresBox>
        {takenFigures.map((figure, index) => {
          return (
            <TakenFigure
              key={index}
              style={{
                color: figure.player === "black" ? "black" : "white",
              }}
            >
              {/* TODO:REPLACE THIS WITH A COMPONENT */}
              {figureDraw[figure.type]}
            </TakenFigure>
          );
        })}
      </TakenFiguresBox>
    </TakenFiguresWrapper>
  );
}
