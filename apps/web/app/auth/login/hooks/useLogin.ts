import { signIn } from "@/auth";

export const useLogin = () => {
  const handleLogin = async () => {
     signIn();
  };

  return {
    handleLogin,
  };
};
