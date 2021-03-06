import styled from "styled-components";

export const FigureWrapper = styled.div`
  user-select: none;
  color: ${(props) => (props.figureColor === "white" ? "white" : "#1E1E1E")};
  font-size: 38px;
  font-weight: ${(props) => (props.checkCell ? "600" : "400")};
  border-bottom: ${(props) => {
    if (props.pickedBorder && !props.checkCell) return "3px solid white";
    else if (props.checkCell) return "3px solid red";
    return "none";
  }};
  outline: none;
  @media (max-width: 500px) {
    font-size: 25px;
    transform: ${(props) =>
      props.figureColor === "black" ? "rotate(180deg)" : "none"};
  }
  &:hover {
    transform: scale(1.2);
  }
`;
