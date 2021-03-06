import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";

import { colours, spacing, fontSizes } from "src/styles";

export const HeaderGrid = styled(Grid)`
  background-color: ${colours.periwinkleBlue};
  color: ${colours.white};
  font-weight: 600;
  padding: ${spacing.four} ${spacing.five};
  justify-content: space-between;
  @media only screen and (max-device-width: 480px) {
    flex-direction: column;
  }
`;

export const SiteTitleWrapper = styled(Grid)`
  max-width:
  font-size: ${fontSizes.subtitle};
  line-height: 1.2;
  display: flex;
  align-items: center;
  @media only screen and (max-device-width: 480px) {
    padding-bottom: ${spacing.three};
  }
`;

export const NavLink = styled(Link)`
  text-decoration: none;
  color: ${colours.white};
  &:hover {
    text-decoration: underline;
  }
`;

export const LinksWrapper = styled(Grid)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  & > a {
    white-space: nowrap;
    font-size: ${fontSizes.title};
    padding-right: ${spacing.three};
  }
  & > a:last-child {
    padding-right: 0;
  }
`;

export const SiteLogoDiv = styled.div`
  background-image: url("/assets/outofpocketicon@3x.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-right: ${spacing.three};
`;
