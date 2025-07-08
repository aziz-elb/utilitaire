import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";
import {
  Activity,
  Users,
  ListChecks,
  FileText,
  Mail,
  Lock,
  Wallet,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthContext";
import Loading from "./Loading";

import { particles  } from "@/components/ui_style/Particles";

const DEFAULT_CREDENTIALS = {
  email: 'usertest@gmail.com',
  password: 'passwd',
};

const FeatureCard = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center text-white/90 transition-all duration-300 hover:bg-white/20 hover:scale-105 cursor-pointer">
    <div className="mb-4">{icon}</div>
    <h3 className="font-semibold">{title}</h3>
  </div>
);

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_CREDENTIALS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect');
      toast.error(err.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleRememberMeChange = (checked: CheckedState) => {
    setRememberMe(checked === true);
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-inwi-purple to-inwi-dark-purple p-12 text-white">
        {/* Floating shapes */}
        {/* <div className="absolute inset-0 opacity-20"> */}
        <div className="absolute  inset-0 overflow-hidden z-10">
          
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

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full ">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img src="utilitaire-logo.png" alt="logo" className="w-80" />
            </div>
            <h2 className="text-3xl font-semibold">
              Plateforme de Gestion des Projets
            </h2>
            <div className="w-24 h-1 bg-inwi-pink mx-auto rounded-full"></div>
            <p className="text-white/80 max-w-lg mx-auto">
              Bienvenue sur la plateforme de gestion des projets d'INWI.
              Connectez-vous pour accéder à vos projets, suivre leur avancement
              et collaborer avec votre équipe.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12 w-full max-w-2xl">
            <FeatureCard
              icon={<Activity size={32} />}
              title="Suivi en temps réel"
            />

            <FeatureCard
              icon={<ListChecks size={32} />}
              title="Gestion des tâches"
            />
            <FeatureCard
              icon={<FileText size={32} />}
              title="Rapports détaillés"
            />
            <FeatureCard
              icon={<DollarSign size={32} />} // ou <DollarSign size={32} />
              title="Suivi des budgets"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-inwi-purple to-inwi-pink bg-clip-text text-transparent transition-transform duration-300 hover:scale-105 inline-block">
              Connexion
            </h1>
            <p className="text-balance text-muted-foreground">
              Entrez vos identifiants pour vous connecter
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                  className="pl-10"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={handleRememberMeChange}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Se souvenir de moi
                </Label>
              </div>
              <Link
                to="/reset-password"
                className="text-sm underline text-inwi-purple hover:text-inwi-dark-purple"
              >
                Mot de passe oublié?
              </Link>
            </div>
            {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-inwi-purple hover:bg-inwi-dark-purple text-white"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
