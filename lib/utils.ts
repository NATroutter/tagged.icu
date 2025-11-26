import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import transform, {Style} from 'css-to-react-native';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitList<T>(inputList: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < inputList.length; i += chunkSize) {
    result.push(inputList.slice(i, i + chunkSize));
  }
  return result;
}

export function parseCSS(css: string) : Style {
	const pairs = css
		.split(';')
		.map(rule => rule.trim())
		.filter(rule => rule)
		.map(rule => {
			const [prop, val] = rule.split(':').map(s => s.trim());
			return [prop, val] as [string, string]; // TypeScript type assertion
		});

	return transform(pairs);
}