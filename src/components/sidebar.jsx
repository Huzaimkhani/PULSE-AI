import { cn } from "../lib/utils";
import {
  IconHome,
  IconHeart,
  IconHistory,
  IconDeviceMobile,
  IconUser,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Define the sidebar items with icons matching the screenshot
const navItems = [
  { path: "/", icon: <IconHome className="h-6 w-6 text-blue-600" />, name: "Home" },
  { path: "/analyzer", icon: <IconHeart className="h-6 w-6 text-blue-600" />, name: "AI Analyzer" },
  { path: "/history", icon: <IconHistory className="h-6 w-6 text-blue-600" />, name: "History" },
  { path: "/device", icon: <IconDeviceMobile className="h-6 w-6 text-blue-600" />, name: "Device" },
  { path: "/profile", icon: <IconUser className="h-6 w-6 text-blue-600" />, name: "Profile" },
];

// Main Sidebar Component
export function Sidebar() {
  const location = useLocation();
  let mouseY = useMotionValue(Infinity); // Use Y for vertical sidebar
  const [isHovered, setIsHovered] = useState(false); // Track hover state for the bar

  // Adjust the width of the sidebar to be slimmer, matching the screenshot
  const sidebarWidth = useSpring(isHovered ? 64 : 48, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  // Adjust the height to be slightly taller to match the screenshot
  const sidebarHeight = 320; // Increased from 288px to 320px to fit 5 icons snugly

  // Add scale transform for the entire sidebar when hovered
  const sidebarScale = useSpring(isHovered ? 1.08 : 1, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  // Add a subtle background opacity change for the bar on hover
  const backgroundOpacity = useSpring(isHovered ? 0.95 : 0.9, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <div className="fixed left-0 top-0 h-full w-24 z-50">
      <motion.div
        style={{
          width: sidebarWidth,
          height: sidebarHeight, // Fixed height for the bar
          scale: sidebarScale, // Apply scale transform to the entire sidebar
          backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`, // Dynamic background opacity
        }}
        onMouseMove={(e) => {
          mouseY.set(e.pageY);
          setIsHovered(true); // Set hover state for the bar
        }}
        onMouseLeave={() => {
          mouseY.set(Infinity);
          setIsHovered(false); // Reset hover state for the bar
        }}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center space-y-6 rounded-3xl",
          // Add a beautiful gradient border
          "border-2 border-transparent bg-clip-padding",
          "shadow-[0_0_10px_rgba(59,130,246,0.3)]", // Subtle blue glow shadow
          "backdrop-blur-sm"
        )}
      >
        {navItems.map((item) => (
          <IconContainer
            key={item.path}
            mouseY={mouseY}
            path={item.path}
            name={item.name}
            icon={item.icon}
            isActive={location.pathname === item.path}
            setParentHovered={setIsHovered}
          />
        ))}
      </motion.div>
    </div>
  );
}

// Icon Container Component
function IconContainer({ mouseY, path, name, icon, isActive, setParentHovered }) {
  let ref = useRef(null);

  let distance = useTransform(mouseY, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 30, 20]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 30, 20]);

  let width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  let height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  let widthIcon = useSpring(widthTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });
  let heightIcon = useSpring(heightTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <Link to={path}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => {
          setHovered(true);
          setParentHovered(true); // Trigger parent bar hover state
        }}
        onMouseLeave={() => {
          setHovered(false);
          setParentHovered(false); // Reset parent bar hover state
        }}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full transition-colors",
          isActive ? "bg-blue-200" : "bg-white hover:bg-blue-100"
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 20 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute left-16 top-1/2 -translate-y-1/2 w-fit rounded-md border border-blue-200 bg-white px-2 py-1 text-sm text-blue-600 shadow-md z-50"
            >
              {name}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}