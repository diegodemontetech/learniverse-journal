import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-i2know-body flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="https://i.ibb.co/Wt4MbD9/i2know.png"
            alt="i2know logo"
            className="mx-auto w-48 mb-8"
          />
        </div>
        <div className="bg-i2know-sidebar rounded-lg p-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: 'dark',
              variables: {
                default: {
                  colors: {
                    brand: '#e80514',
                    brandAccent: '#c40411',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;