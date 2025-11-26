import {cn, splitList} from "@/lib/utils"; // Import utility for conditional class names
import {
	AnimatePresence, // Enables animation presence detection
	type MotionValue, // Type for motion values
	motion, // Main component for animations
	useMotionValue, // Hook to create a motion value
	useSpring, // Hook to create smooth spring animations
	useTransform, // Hook to transform motion values
} from "framer-motion";
import Link from "next/link"; // Next.js Link component for navigation
import {useEffect, useRef, useState} from "react"; // Importing React hooks
import type {LinkData} from "@/types/interfaces";
import DynamicIcon from "@/lib/dynamicIcon";
import useWindowDimensions from "@/hooks/useWindowDimensions"; // Importing icons from lucide-react

// Interface for props accepted by the AnimatedDock component
interface AnimatedDockProps {
	items: LinkData[]; // Array of menu items
	largeClassName?: string; // Optional class name for large dock
}

function getCount(width: number) : number {
	let count: number;
	if (width < 300) {
		count = 1;
	} else if (width < 360) {
		count = 2;
	} else if (width < 420) {
		count = 3;
	} else if (width < 480) {
		count = 4;
	} else if (width < 540) {
		count = 5;
	} else if (width < 600) {
		count = 6;
	} else if (width < 660) {
		count = 7;
	} else if (width < 720) {
		count = 8;
	} else if (width < 780) {
		count = 9;
	} else {
		count = 10;
	}
	return count;
}

// Main AnimatedDock component that renders both LargeDock and SmallDock
export default function AnimatedDock({ items, largeClassName }: AnimatedDockProps) {
	const {width} = useWindowDimensions();
	const [lists, setLists] = useState<LinkData[][]>();

	useEffect(()=>{
		setLists(splitList(items, getCount(width)));
	}, [items, width])
	
	return (
		<>
			{
			lists?.map((list, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: too much work to fix it
				<LargeDock key={index} items={list} className={largeClassName} animate={width>490} />
			))
			}
		</>
	);
}

// Component for the large dock, visible on larger screens
const LargeDock = ({items,className,animate}: { items: LinkData[]; className?: string; animate:boolean }) => {
	const mouseXPosition = useMotionValue(Infinity); // Create a motion value for mouse X position
	if (animate) {
		return (
			<motion.div
				onMouseMove={(e) => mouseXPosition.set(e.pageX)} // Update mouse X position on mouse move
				onMouseLeave={() => mouseXPosition.set(Infinity)} // Reset on mouse leave
				className={cn(
					"mx-auto h-16 items-center gap-4 rounded-2xl flex max-w-full", // Large dock styles
					className,
				)}
			>
				{items.map((item) => (
					<DockIcon mouseX={mouseXPosition} key={item.id} item={item} animate={animate} />
				))}
			</motion.div>
		);
	}
	return (
		<div className={cn("mx-auto h-16 items-center gap-4 rounded-2xl flex max-w-full",className)}>
			{items.map((item) => (
				<DockIcon mouseX={mouseXPosition} key={item.id} item={item} animate={animate} />
			))}
		</div>
	);
};

// Component for individual icons in the dock
function DockIcon({mouseX,item,animate}: { mouseX: MotionValue; item:LinkData,animate:boolean }) {
	const ref = useRef<HTMLDivElement>(null); // Ref for measuring distance from mouse

	// Calculate the distance from the mouse to the icon
	const distanceFromMouse = useTransform(mouseX, (val) => {
		const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }; // Get icon bounds
		return val - bounds.x - bounds.width / 2; // Calculate distance from center
	});

	// Transform properties for width and height based on mouse distance
	const widthTransform = useTransform(distanceFromMouse, [-150, 0, 150], [45, 80, 45]);
	const heightTransform = useTransform(distanceFromMouse, [-150, 0, 150], [45, 80, 45]);

	// Transform properties for icon size based on mouse distance
	const iconWidthTransform = useTransform(distanceFromMouse, [-150, 0, 150], [25, 45, 25]);
	const iconHeightTransform = useTransform(distanceFromMouse, [-150, 0, 150], [25, 45, 25]);

	// Spring animations for smooth transitions
	const animWidth = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
	const animHeight = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });
	const iconWidth = useSpring(iconWidthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
	const iconHeight = useSpring(iconHeightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

	const [isHovered, setIsHovered] = useState(false); // State for hover effect

	if (animate) {
		return (
			<Link href={item.url}>
				<motion.div
					ref={ref} // Reference for measuring
					style={{ width: animWidth, height: animHeight }} // Set dynamic width and height
					onMouseEnter={() => {
						if (animate) {
							setIsHovered(true);
						}
					}} // Handle mouse enter
					onMouseLeave={() => setIsHovered(false)} // Handle mouse leave
					className="flex aspect-square items-center justify-center rounded-full shadow-lg backdrop-blur-md bg-black/20 text-white"
				>
					<AnimatePresence>
						{/* Tooltip that appears on hover */}
						{isHovered && (
							<motion.div
								initial={{ opacity: 0, y: 10, x: "-50%" }} // Initial animation state
								animate={{ opacity: 1, y: 0, x: "-50%" }} // Animation to visible state
								exit={{ opacity: 0, y: 2, x: "-50%" }} // Animation to exit state
								className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border px-2 py-0.5 text-xs border-neutral-900 bg-neutral-800 text-white"
							>
								{item.name} {/* Tooltip text */}
							</motion.div>
						)}
					</AnimatePresence>
					<motion.div
						style={{ width: iconWidth, height: iconHeight }} // Set dynamic icon size
						className="flex items-center justify-center drop-shadow-foreground"
					>
						<DynamicIcon iconName={item.icon} size={60} />
					</motion.div>
				</motion.div>
			</Link>
		);
	}
	return (
		<Link href={item.url}>
			<motion.div
				ref={ref} // Reference for measuring
				style={{ width: animWidth, height: animHeight }} // Set dynamic width and height
				className="flex aspect-square items-center justify-center rounded-full shadow-lg backdrop-blur-md bg-black/20 text-white"
			>
				<div
					className="flex items-center justify-center drop-shadow-foreground"
				>
					<DynamicIcon iconName={item.icon} size={60} className="hidden md:block" />
					<DynamicIcon iconName={item.icon} size={24} className="flex md:hidden" />
				</div>
			</motion.div>
		</Link>
	);
}