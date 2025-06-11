
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Gallery", path: "/gallery" },
    { name: "Videos", path: "/videos" },
    { name: "Members", path: "/members" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${
            location.pathname === item.path 
              ? "bg-accent text-accent-foreground" 
              : "text-muted-foreground"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
