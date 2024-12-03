import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const customTheme = {
  default: {
    colors: {
      brand: '#e80514',
      brandAccent: '#c70512',
      brandButtonText: 'white',
      defaultButtonBackground: '#2c2c2c',
      defaultButtonBackgroundHover: '#3c3c3c',
      inputBackground: '#231f1f',
      inputBorder: '#3c3c3c',
      inputBorderHover: '#4c4c4c',
      inputBorderFocus: '#e80514',
      inputText: 'white',
      inputPlaceholder: '#666666',
    },
    space: {
      buttonPadding: '12px 16px',
      inputPadding: '12px 16px',
    },
    borderWidths: {
      buttonBorderWidth: '0',
      inputBorderWidth: '1px',
    },
    radii: {
      borderRadiusButton: '4px',
      buttonBorderRadius: '4px',
      inputBorderRadius: '4px',
    },
    fonts: {
      bodyFontFamily: `"Gotham", system-ui, sans-serif`,
      buttonFontFamily: `"Gotham", system-ui, sans-serif`,
      inputFontFamily: `"Gotham", system-ui, sans-serif`,
      labelFontFamily: `"Gotham", system-ui, sans-serif`,
    },
  }
};

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#2c2c2c] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="https://i.ibb.co/Wt4MbD9/i2know.png"
            alt="i2know Logo"
            className="mx-auto h-24 w-auto"
          />
        </div>
        <div className="bg-[#231f1f] p-8 rounded-lg shadow-xl">
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{ theme: customTheme }}
            theme="default"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;