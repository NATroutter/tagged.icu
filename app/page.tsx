import * as React from "react";
import Home from "@/app/home";
import {getFileURL, getSettings} from "@/lib/database";
import ContentError from "@/components/errors/ContentError";
import {getDiscord} from "@/lib/DiscordStatus";

export default async function HomePage() {
  const data = await getSettings();
  if (!data) return (<ContentError/>);

  data.profile_picture = getFileURL("settings", data.id, data.profile_picture);
  data.audio = getFileURL("settings", data.id, data.audio);

  const discord = (data.discord_id ? await getDiscord(data.discord_id) : undefined);

  return (
        <Home data={data} discord={discord}></Home>
  );
}
