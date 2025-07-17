import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });

jest.mock("@/auth");

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: "admin", id: 1 },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(
      () => ({ data: mockSession, status: "authenticated" }) // return type is [] in v3 but changed to {} in v4
    ),
  };
});

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock(
  "@/infraestructure/kafka/kafka.publisher",
  jest.fn(() => ({
    publishLogEvent: jest.fn(),
  }))
);

jest.mock(
  "@/lib/auth.utils",
  jest.fn(() => ({
    checkAuth: jest.fn(),
  }))
);
