import PocketBase from "pocketbase";
import type {Settings} from "@/types/interfaces";
import logger from "@/lib/logger";
import {config} from "@/lib/config";


function getFileURL(collection: string, id: string, file: string): string {
	return `${config.POCKETBASE.PUBLIC}/api/files/${collection}/${id}/${file}`;
}
function getPocketBase(): PocketBase {
	return new PocketBase(config.POCKETBASE.SERVER);
}

export async function getSettings(): Promise<Settings | undefined> {
	try {
		const pb = getPocketBase();
		const data = await pb.collection("settings").getFirstListItem<Settings | undefined>("", {
			expand: "links",
		});
		if (!data) return undefined;

		data.profile_picture = data.profile_picture && getFileURL("settings", data.id, data.profile_picture);
		data.background = data.background && getFileURL("settings", data.id, data.background);
		data.audio = data.audio && getFileURL("settings", data.id, data.audio);

		return data;
	} catch (err) {
		printError(err, "Failed to fetch data for HomePage");
		return undefined;
	}
}

//***************************************
//*           ERROR HANDLING            *
//***************************************
interface PocketBaseError {
	code: number;
	message: string;
}
function isPocketBaseError(err: unknown): err is { response: PocketBaseError } {
	return typeof err === "object" && err !== null && "response" in err;
}
function printError(err: unknown, message: string) {
	if (err && isPocketBaseError(err)) {
		const code = err.response.code ? (" ("+err.response.code+")") : "";
		const resp = err.response.message ? (": "+err.response.message) : "";
		logger.error(message+code+resp, "PocketBase");
	} else {
		logger.error(message, "PocketBase");
	}
}