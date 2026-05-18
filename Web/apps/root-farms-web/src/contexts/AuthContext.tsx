import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getStoredEmail, isAuthed, loginRequest, logoutRequest, signupRequest, tryHydrateSessionFromCookie } from "../lib/api";
import { clearEntitlement } from "../lib/entitlement";



type AuthCtx = {

  decided: boolean;

  email: string;

  authed: boolean;

  guestMode: boolean;

  canPlay: boolean;

  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; detail: string }>;

  register: (email: string, password: string) => Promise<{ ok: true } | { ok: false; detail: string }>;

  enterGuestMode: () => void;

  logout: () => Promise<void>;

};



const Ctx = createContext<AuthCtx | null>(null);



export function AuthProvider({ children }: { children: ReactNode }) {

  const [decided, setDecided] = useState(false);

  const [epoch, setEpoch] = useState(0);

  const [guestMode, setGuestMode] = useState(false);



  const sync = useCallback(() => setEpoch((n) => n + 1), []);



  useEffect(() => {

    let cancelled = false;

    (async () => {

      await tryHydrateSessionFromCookie();

      if (!cancelled) {

        sync();

        setDecided(true);

      }

    })();

    return () => {

      cancelled = true;

    };

  }, [sync]);



  const login = useCallback(

    async (email: string, password: string) => {

      const out = await loginRequest(email, password);

      if (out.ok) {

        setGuestMode(false);

        sync();

      }

      return out;

    },

    [sync],

  );



  const register = useCallback(

    async (email: string, password: string) => {

      const out = await signupRequest(email, password);

      if (out.ok) {

        setGuestMode(false);

        sync();

      }

      return out;

    },

    [sync],

  );



  const enterGuestMode = useCallback(() => {

    setGuestMode(true);

    clearEntitlement();

    sync();

  }, [sync]);



  const logout = useCallback(async () => {

    if (guestMode) {

      setGuestMode(false);

      sync();

      return;

    }

    await logoutRequest();

    sync();

  }, [guestMode, sync]);



  const authed = isAuthed();



  const value = useMemo<AuthCtx>(

    () => ({

      decided,

      email: authed ? getStoredEmail() : "",

      authed,

      guestMode,

      canPlay: authed || guestMode,

      login,

      register,

      enterGuestMode,

      logout,

    }),

    [decided, epoch, authed, guestMode, login, register, enterGuestMode, logout],

  );



  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;

}



export function useAuth(): AuthCtx {

  const v = useContext(Ctx);

  if (!v) throw new Error("useAuth must be used within AuthProvider");

  return v;

}

