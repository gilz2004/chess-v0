import React from "react";
import { figureDraw } from "../../boardEssentials";
import { FigureWrapper } from "./Figure.styles";

export default function Figure({ symbol, colorByPlayer, ...props }) {
  const { checkCell, pickedBorder } = props;
  return (
    <FigureWrapper
      figureColor={colorByPlayer}
      checkCell={checkCell}
      pickedBorder={pickedBorder}
    >
      {figureDraw[symbol]}
    </FigureWrapper>
  );
}
