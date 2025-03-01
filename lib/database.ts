import PocketBase from "pocketbase";
import {HomePage} from "@/types/interfaces";
import logger from "@/lib/logger";
import {withCache} from "@/lib/cache";


//***************************************
//*            DATABASE UTILS           *
//***************************************
export function getFileURL(collection: string, id:string, file:string) : string {
	return `${getPocketBase().baseURL}/api/files/${collection}/${id}/${file}`
}

//***************************************
//*          DATABASE GETTERS           *
//***************************************
export function getPocketBase() : PocketBase {
	return new PocketBase(process.env.POCKETBASE_ADDRESS);
}

export async function getHomePage(): Promise<HomePage | undefined> {
	return withCache(async ()=>{
		try {
			const pb = getPocketBase();
			return await pb.collection("page_home").getFirstListItem<HomePage | undefined>("", {
				expand: "links",
				cache: 'no-store',
			});
		} catch (err) {
			printError(err, "Failed to fetch data for HomePage");
			return undefined;
		}
	}, "home_page_data")
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