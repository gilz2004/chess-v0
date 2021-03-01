import React from "react";
import styled from "styled-components";
import { FaChess } from "react-icons/fa";

const Title = styled.div`
  font-size: 40px;
`;

const Nav = styled.nav`
  //   border-bottom: 2px solid white;
  //   background: #64341b;
  height: 50px;
  margin-bottom: 10px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 35px;
  @media (max-width: 960px) {
    padding: 0 20px;
  }
`;

const NavLinksBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const NavLink = styled.span`
  font-size: 12px;
  cursor: pointer;
  text-decoration: ${(props) => (props.underline ? "underline" : "none")};
`;

const HeaderIcon = styled(FaChess)`
  margin-left: 10px;
  font-size: 30px;
  border: 2px solid white;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  box-shadow: 2px 4px 15px 5px rgba(0, 0, 0, 0.5);
  padding: 2px;
  position: relative;
  top: 25px;
  &:hover {
    padding: 4px;
  }
`;

export default function Header() {
  return (
    <Nav>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid white",
          width: "150px",
        }}
      >
        <Title>Chess</Title>

        <HeaderIcon />
      </div>
      <NavLinksBox>
        <NavLink underline={true}>Local mode</NavLink>
        <NavLink>Online soon</NavLink>
      </NavLinksBox>
    </Nav>
  );
}
