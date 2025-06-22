
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-inwi-dark-purple via-inwi-purple to-inwi-pink relative overflow-hidden">
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-60 h-60 bg-inwi-pink/20 rounded-full -top-10 -left-20 animate-float" style={{ animationDelay: '0s', animationDuration: '15s' }}></div>
        <div className="absolute w-72 h-72 bg-inwi-accent/20 rounded-full -bottom-20 -right-10 animate-float" style={{ animationDelay: '3s', animationDuration: '18s' }}></div>
        <div className="absolute w-40 h-40 bg-inwi-tertiary/20 rounded-full top-1/2 left-1/4 animate-float" style={{ animationDelay: '6s', animationDuration: '12s' }}></div>
        <div className="absolute w-24 h-24 bg-inwi-secondary/20 rounded-full bottom-1/4 right-1/3 animate-float" style={{ animationDelay: '9s', animationDuration: '20s' }}></div>
        <div className="absolute w-32 h-32 bg-inwi-pink/10 rounded-full top-10 right-20 animate-float" style={{ animationDelay: '1s', animationDuration: '10s' }}></div>
      </div>

      <div className="text-center text-white z-10 max-w-2xl mx-auto px-6">
        {/* 404 Number */}
        <div className="mb-8 mt-4 md:mt-0">
          <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r  from-white to-inwi-tertiary bg-clip-text text-transparent animate-fade-in">
            404
          </h1>
          <div className="w-32 h-1 bg-white mx-auto rounded-full animate-fade-in delay-300"></div>
        </div>

        {/* Error message */}
        <div className="mb-12 animate-fade-in delay-500">
          <h2 className="text-3xl font-semibold mb-4">
            Oops! Page introuvable
          </h2>
          <p className="text-xl opacity-90 mb-2">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <p className="text-sm opacity-75 font-mono bg-white/10 rounded-lg px-4 py-2 inline-block">
            {location.pathname}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col  sm:flex-row gap-4 justify-center items-center animate-fade-in delay-700">
          <Button 
            asChild
            className="bg-inwi-pink w-7/10 text-white hover:bg-inwi-accent  py-6 text-lg font-semibold transition-all duration-200 transform hover:scale-101"
          >
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Link>
          </Button>
          
        
        </div>  

        {/* Help section */}
        <div className="mt-16 p-6 bg-white/10 rounded-2xl backdrop-blur-sm animate-fade-in delay-1000">
          <h3 className="text-lg font-semibold mb-3">Besoin d'aide ?</h3>
          <p className="text-sm opacity-90 mb-4">
            Si vous pensez qu'il s'agit d'une erreur, contactez notre équipe support.
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-xs">
            <span className="bg-inwi-pink/20 px-3 py-1 rounded-full">Support: support@inwi.ma</span>
            <span className="bg-inwi-pink/20 px-3 py-1 rounded-full">Tél: +212 501 66 66 65</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
