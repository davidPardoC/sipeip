import { Button } from "@/ui/button";

const LoginButton = () => {
  return (
    <form action="/api/auth/signin/keycloak" method="post">
      <Button variant={"default"} className="w-full">
        Inicio de Sesion con SSO
      </Button>
    </form>
  );
};

export default LoginButton;
