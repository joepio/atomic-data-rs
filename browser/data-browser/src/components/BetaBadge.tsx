import { styled } from 'styled-components';

import type { JSX } from 'react';

export function BetaBadge(): JSX.Element {
  return <Badge>BETA</Badge>;
}

const Badge = styled.span`
  background-color: ${p => p.theme.colors.main};
  border-radius: 0.25rem;
  color: white;
  font-weight: bold;
  padding-inline: 0.25rem;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.25);
`;
