
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Navigation = () => {
  const { userRole, user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Gallery", path: "/gallery" },
    { name: "Videos", path: "/videos" },
    { name: "About", path: "/about" },
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
      
      {userRole === 'admin' && (
        <Link
          to="/admin"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${
            location.pathname === "/admin" 
              ? "bg-accent text-accent-foreground" 
              : "text-muted-foreground"
          }`}
        >
          Admin
        </Link>
      )}
      
      {user && (
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="ml-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      )}
      
      {!user && (
        <Button variant="ghost" size="sm" asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      )}
    </div>
  );
};

export default Navigation;
