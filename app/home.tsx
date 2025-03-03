'use client'

import {Settings} from "@/types/interfaces";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Markdown from "@/components/Markdown";
import {DiscordUser} from "@/lib/DiscordStatus";
import {useRef, useState} from "react";
import AnimatedDock from "@/components/ui/AnimatedDock";

export default function Home({data, discord} : { data:Settings, discord: DiscordUser|undefined}) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [open, setOpen] = useState<boolean>(false);

	function reveal() {
		setOpen(true)
		if (audioRef.current) {
			audioRef.current.volume = data.audio_volume;
			audioRef.current.play();
		}
	}

	return (
		<div className="flex flex-col m-auto">
			{(data.audio && data.audio_volume > 0 && (data.audio.endsWith("mp3") || data.audio.endsWith("wav"))) && (
				<audio ref={audioRef} controls={true} loop={true} className="mx-auto my-5 hidden">
					{data.audio.endsWith(".mp3") && (<source src={data.audio} type="audio/mpeg"/>)}
					{data.audio.endsWith(".wav") && (<source src={data.audio} type="audio/wav"/>)}
				</audio>
			)}
			<button
				className={`${open ? "invisible" : "visible"} flex fixed top-0 bottom-0 left-0 right-0 z-50 size-full select-none items-center justify-center bg-black/50 backdrop-blur-lg`}
				onClick={reveal}
			>
				<p className={`
				whitespace-pre-wrap break-all px-4 text-sm animate-slideinup
				motion-scale-in-[1.5] motion-translate-x-in-[0%] motion-translate-y-in-[150%] motion-opacity-in-[0%] motion-duration-[0.30s] motion-ease-spring-bouncy
				`}>Click to reveal</p>
			</button>

			<div className={`${open ? "visible motion-scale-in-[1.1] motion-translate-x-in-[0%] motion-translate-y-in-[10%] motion-duration-[0.50s] motion-ease-spring-bouncy" : "invisible"} flex flex-col m-auto w-[47rem] max-w-[90vw] justify-center`}>
				<div className="bg-card backdrop-blur-[40px] rounded-xl border border-border shadow-card">
					<div className="pt-10 px-10 pb-10">
						<div className="flex items-center justify-center flex-col gap-8">
							{data.profile_picture && (
								<div className="flex flex-col max-w-28 m-auto">
									<Image
										className="h-full w-full aspect-square m-auto rounded-full shadow-2xl"
										src={data.profile_picture}
										alt="Profile Picture"
										sizes="100vw"
										width={0}
										height={0}
									/>
								</div>
							)}

							<div className="flex justify-center items-center z-10 flex-col gap-1">
								<h1 className="break-all text-2xl font-semibold">{data.username}</h1>
							</div>

							<div className="text-text whitespace-pre-wrap leading-tight w-full">
								<div className="hr-text drop-shadow-theme"></div>
							</div>

							{data.content && (
								<div className="flex flex-col w-full">
									<Markdown content={data.content}/>
								</div>
							)}

							<div className="flex flex-wrap items-center justify-center max-w-full">
								<AnimatedDock items={data.expand.links}/>
							</div>

						</div>
					</div>
				</div>

				{discord && (
					<div className="bg-card backdrop-blur-[40px] rounded-xl border border-border p-3 mt-8 shadow-card">
						<div className="flex items-center gap-5">
							<div className="-m-2">
								<div className="m-2 aspect-square h-16 sm:h-20">
									<Image
										className="h-full w-full aspect-square m-auto rounded-xl shadow-2xl"
										src={discord.avatar}
										alt="Profile Picture"
										sizes="100vw"
										width={0}
										height={0}
									/>
								</div>
							</div>
							<div className="mr-3 m-auto flex w-full items-center justify-between gap-4">
								<div className="flex flex-wrap items-center sm:gap-1.5">
									<p className="line-clamp-1 break-all font-medium leading-tight text-base">{discord.username}</p>
									<div className="flex items-center">
										{discord.badges.map((badge, index) => (
											<TooltipProvider key={index}>
												<Tooltip>
													<TooltipTrigger>
														<div className="flex items-center justify-center size-[20px]">
															<Image
																className="h-full w-full aspect-square m-auto"
																src={badge.url}
																alt="Badge Picture"
																sizes="100vw"
																width={0}
																height={0}
															/>
														</div>
													</TooltipTrigger>
													<TooltipContent>
														<div className="bg-neutral-900 flex m-auto justify-center gap-2 text-center px-3 py-1.5 rounded-lg">
															<p>{badge.name}</p>
														</div>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										))}
									</div>
								</div>
								<Link href={discord.profile} target="_blank" className="border-color rounded-lg border-width select-none bg-white/[4%] px-5 py-1.5 text-xs duration-300 hover:scale-110 hover:brightness-105">Profile</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>

	)

}