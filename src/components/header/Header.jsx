import React from "react";
import {
  HeaderIcon,
  Nav,
  NavLink,
  NavLinksBox,
  Title,
  TitleWrapper,
} from "./Header.styles";

export default function Header() {
  return (
    <Nav>
      <TitleWrapper>
        <Title>Chess</Title>
        <HeaderIcon />
      </TitleWrapper>
      <NavLinksBox>
        <NavLink underline={true}>Local mode</NavLink>
        <NavLink>Online soon</NavLink>
      </NavLinksBox>
    </Nav>
  );
}
