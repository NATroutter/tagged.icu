import * as React from "react";
import Home from "@/app/home";
import {getSettings} from "@/lib/database";
import ContentError from "@/components/errors/ContentError";
import {getDiscord} from "@/lib/DiscordStatus";

// ISR: Revalidate every x seconds
export const revalidate = 120;

export default async function HomePage() {
  const data = await getSettings();
  if (!data) return (<ContentError/>);

  const discord = (data.discord_id ? await getDiscord(data.discord_id) : undefined);

  return (
        <Home data={data} discord={discord}></Home>
  );
}
