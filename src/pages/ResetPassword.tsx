import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { particles } from "@/components/ui_style/Particles";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      console.log("Password reset requested for:", email);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-inwi-purple to-inwi-dark-purple relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white/20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-white/15 animate-pulse delay-1000"></div>

          <div
            className="absolute rounded-full bg-white/10 backdrop-blur-sm 
                    w-[300px] h-[300px] -top-24 -left-24
                    animate-[float_15s_ease-in-out_infinite,pulse_8s_ease-in-out_infinite_alternate]"
          />

          <div
            className="absolute rounded-full bg-white/10 backdrop-blur-sm 
                    w-[500px] h-[500px] -bottom-48 -right-48
                    animate-[float_20s_ease-in-out_infinite_reverse,pulse_10s_ease-in-out_infinite_alternate-reverse]"
          />

          <div
            className="absolute rounded-full bg-white/10 backdrop-blur-sm 
                    w-[200px] h-[200px] top-[40%] right-[10%]
                    animate-[float_12s_ease-in-out_infinite,pulse_6s_ease-in-out_infinite_alternate]"
          />
          <div
            className="absolute rounded-full bg-white/15 backdrop-blur-sm 
                  w-[150px] h-[150px] bottom-[20%] left-[10%]
                  animate-[float_18s_ease-in-out_infinite_reverse,pulse_9s_ease-in-out_infinite_alternate-reverse]"
          />

          <div
            className="absolute rounded-full bg-white/20 backdrop-blur-sm 
                  w-[80px] h-[80px] top-[20%] left-[20%]
                  animate-[float_10s_ease-in-out_infinite,pulse_5s_ease-in-out_infinite_alternate]"
          />

          <div className="opacity-40">
            <img
              src="inwi-mini-logo.png"
              alt="logo"
              className="w-8 absolute  bottom-8  left-8 animate-pulse "
            />
          </div>

          {/* Particules */}
          <div className="absolute inset-0 overflow-hidden">{particles}</div>
        </div>

        <Card className="w-full max-w-md shadow-xl z-10 animate-fade-in">
          <CardContent className="text-center p-8">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-inwi-purple mb-2">
                Email envoyé !
              </h2>
              <p className="text-gray-600">
                Un lien de réinitialisation a été envoyé à{" "}
                <strong>{email}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Vérifiez votre boîte de réception et suivez les instructions
                pour réinitialiser votre mot de passe.
              </p>

              <Button
                asChild
                className="w-full bg-inwi-purple hover:bg-inwi-dark-purple text-white"
              >
                <Link to="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la connexion
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-inwi-purple to-inwi-dark-purple relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div
          className="absolute rounded-full bg-white/10 backdrop-blur-sm 
                    w-[300px] h-[300px] -top-24 -left-24
                    animate-[float_15s_ease-in-out_infinite,pulse_8s_ease-in-out_infinite_alternate]"
        />

        <div
          className="absolute rounded-full bg-white/10 backdrop-blur-sm 
                    w-[500px] h-[500px] -bottom-48 -right-48
                    animate-[float_20s_ease-in-out_infinite_reverse,pulse_10s_ease-in-out_infinite_alternate-reverse]"
        />

        <div
          className="absolute rounded-full bg-white/10 backdrop-blur-sm 
                    w-[200px] h-[200px] top-[40%] right-[10%]
                    animate-[float_12s_ease-in-out_infinite,pulse_6s_ease-in-out_infinite_alternate]"
        />
        <div
          className="absolute rounded-full bg-white/15 backdrop-blur-sm 
                  w-[150px] h-[150px] bottom-[20%] left-[10%]
                  animate-[float_18s_ease-in-out_infinite_reverse,pulse_9s_ease-in-out_infinite_alternate-reverse]"
        />

        <div
          className="absolute rounded-full bg-white/20 backdrop-blur-sm 
                  w-[80px] h-[80px] top-[20%] left-[20%]
                  animate-[float_10s_ease-in-out_infinite,pulse_5s_ease-in-out_infinite_alternate]"
        />

        <div className="opacity-40">
          <img
            src="inwi-mini-logo.png"
            alt="logo"
            className="w-8 absolute  bottom-8  left-8 animate-pulse "
          />
        </div>

        {/* Particules */}
        <div className="absolute inset-0 overflow-hidden">{particles}</div>
      </div>
     

      <Card className="w-full max-w-md shadow-xl z-10 animate-fade-in">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Mail className="h-12 w-12 text-inwi-purple mx-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-inwi-purple">
            Mot de passe oublié ?
          </CardTitle>
          <CardDescription className="text-gray-600">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Adresse email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@inwi.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className=" pl-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-inwi-purple"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-inwi-purple hover:bg-inwi-dark-purple text-white font-semibold transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi en cours...
                </div>
              ) : (
                "Envoyer le lien de réinitialisation"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              asChild
              className="text-inwi-purple hover:text-inwi-dark-purple"
            >
              <Link to="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
