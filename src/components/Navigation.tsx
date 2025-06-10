
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const { userRole } = useAuth();

  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link to="/gallery" className="text-gray-700 hover:text-black transition-colors font-medium">
        Gallery
      </Link>
      <Link to="/videos" className="text-gray-700 hover:text-black transition-colors font-medium">
        Videos
      </Link>
      <Link to="/about" className="text-gray-700 hover:text-black transition-colors font-medium">
        About
      </Link>
      <Link to="/members" className="text-gray-700 hover:text-black transition-colors font-medium">
        Members
      </Link>
      <Link to="/contact" className="text-gray-700 hover:text-black transition-colors font-medium">
        Contact
      </Link>
      {userRole === 'admin' && (
        <Link to="/admin" className="text-gray-700 hover:text-black transition-colors font-medium">
          Admin
        </Link>
      )}
    </div>
  );
};

export default Navigation;
