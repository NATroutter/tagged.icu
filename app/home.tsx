'use client'

import type {Settings} from "@/types/interfaces";
import * as React from "react";
import {useRef, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import Markdown from "@/components/Markdown";
import type {DiscordUser} from "@/lib/DiscordStatus";
import AnimatedDock from "@/components/ui/AnimatedDock";
import { motion, AnimatePresence } from "framer-motion";
import {parseCSS} from "@/lib/utils";

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
					<track kind="captions" />
				</audio>
			)}

			{!open && (

				// biome-ignore lint/a11y/useButtonType: Custom button component is not necessary for small project like this
				<button
					className="flex fixed top-0 bottom-0 left-0 right-0 z-50 size-full select-none items-center justify-center bg-black/50 backdrop-blur-lg"
					onClick={reveal}
				>
					<motion.p
						className="whitespace-pre-wrap break-all px-4 text-sm"
						initial={{ opacity: 0, y: "150%", scale: 1.5 }}
						animate={{ opacity: 1, y: "0%", scale: 1 }}
						transition={{ duration: 0.3, type: "spring" }}
					>
						Click to reveal
					</motion.p>
				</button>
			)}

			<AnimatePresence>
				{open && (
					<motion.div
						className="flex flex-col m-auto w-[47rem] max-w-[90vw] justify-center"
						initial={{ y: "10%", scale: 1.1 }}
						animate={{ y: "0%", scale: 1 }}
						exit={{ y: "10%", scale: 1.1 }}
						transition={{ duration: 0.5, type: "spring" }}
					>
						<div
							className="bg-card backdrop-blur-[40px] rounded-xl border border-border shadow-card"
							style={data.bg_card_css !== undefined ? parseCSS(data.bg_card_css) : undefined}
						>
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

									<div className="text-foreground whitespace-pre-wrap leading-tight w-full">
										<div className="hr-text drop-shadow-primary"></div>
									</div>

									{data.content && (
										<div
											className="flex flex-col w-full"
											style={data.content_card_css !== undefined ? parseCSS(data.content_card_css) : undefined}
										>
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
							<div
								className="bg-card backdrop-blur-[40px] rounded-xl border border-border p-3 mt-8 shadow-card"
								style={data.bg_card_css !== undefined ? parseCSS(data.bg_card_css) : undefined}
							>
								<div className="flex justify-between flex-col gap-2 xs:gap-0 xs:flex-row">

									<div className="flex items-start gap-5">
										<div className=" aspect-square h-20">
											<Image
												className="h-full w-full aspect-square m-auto rounded-xl shadow-2xl"
												src={discord.avatar}
												alt="Profile Picture"
												sizes="100vw"
												width={0}
												height={0}
											/>
										</div>

										<div className="mr-3 m-auto flex w-full items-center justify-between gap-4">
											<div className="flex flex-wrap items-center sm:gap-1.5">
												<p className="line-clamp-1 break-all font-medium leading-tight text-base">{discord.username}</p>
												<div className="flex items-center">
													{discord.badges.map((badge) => (
														<TooltipProvider key={badge.name}>
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
										</div>
									</div>

									<div className="flex items-center">
										<Link
											href={discord.profile}
											target="_blank"
											className="w-full xs:w-fit text-center border-color rounded-lg border-width select-none bg-white/[4%] px-5 py-1.5 text-xs duration-300 hover:scale-110 hover:brightness-105"
										>Profile</Link>
									</div>

								</div>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>

	)

}