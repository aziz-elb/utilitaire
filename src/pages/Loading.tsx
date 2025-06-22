import { particles } from "@/components/ui_style/Particles";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-inwi-purple to-inwi-dark-purple relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 ">
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

      <div className="text-center text-white z-10">
        <div className="mb-8">
          <div>
            <img src="utilitaire-logo.png" alt="logo" className="w-96" />
          </div>
          <p className="text-xl opacity-90 animate-fade-in delay-300">
            Plateforme de Gestion des Projets
          </p>
        </div>

        {/* Loading animation */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>

          <p className="text-sm opacity-75">Chargement...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
