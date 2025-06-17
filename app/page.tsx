'use client'
import { Flex, Radio, RadioChangeEvent, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";
import { HowToPlayButton } from "./howToPlayButton";

export default function TopMenu() {
  const [players, setPlayers] = useState(1);

  const updatePlayers = (event: RadioChangeEvent) => {
    setPlayers(event.target.value);
  }

  return (
    <Flex className="mainWrap">
      <Flex className="flexColumn backingContainer">
        <Typography className="whiteText title">Othello</Typography>
        <Link href={{
          pathname: '/game',
          query: {
            type: 'classic',
            players: players,
          }}}
          className="linkButton"
        >Play Classic</Link>
        <Radio.Group
          onChange={updatePlayers}
          value={players}
          options={[
            { value: 1, label: 'Singleplayer' },
            { value: 2, label: 'Multiplayer' },
          ]}
        />
        <HowToPlayButton/>
      </Flex>
    </Flex>
  );
}
