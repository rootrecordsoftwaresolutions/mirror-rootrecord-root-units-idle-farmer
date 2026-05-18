import { App } from "@capacitor/app";
import { useCallback, useEffect, useState } from "react";
import { syncNativeAds } from "@core/lib/nativeAds";
import { useNativeBackButton } from "./useNativeBackButton";
import { AuthScreen } from "./components/AuthScreen";
import { BottomNav } from "./components/BottomNav";
import { WelcomeBackModal } from "@core/components/WelcomeBackModal";
import { VarmintAlertModal } from "@core/components/VarmintAlertModal";
import { RootEconomyScreen } from "@core/components/RootEconomyScreen";
import { PlaceholderTab } from "./components/PlaceholderTab";
import { PlotsScreen } from "./components/PlotsScreen";
import { PlotDetailScreen } from "@core/components/PlotDetailScreen";
import { SettingsScreen } from "@core/components/SettingsScreen";
import { FarmhandsScreen } from "@core/components/FarmhandsScreen";
import { GuideScreen } from "@core/components/GuideScreen";
import { GameProvider } from "@core/contexts/GameContext";
import { useAuth } from "@core/contexts/AuthContext";
import type { TabId } from "@core/game/types";

function RootFarmsMobileApp() {
  const [tab, setTab] = useState<TabId>("plots");
  const [plotId, setPlotId] = useState<number | null>(null);

  const handleHardwareBack = useCallback(() => {
    if (plotId != null) {
      setPlotId(null);
      return true;
    }
    return false;
  }, [plotId]);
  useNativeBackButton(handleHardwareBack);

  useEffect(() => {
    syncNativeAds();
    const sub = App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        window.dispatchEvent(new Event("rr-farms-resume"));
        syncNativeAds();
      } else {
        window.dispatchEvent(new Event("rr-farms-pause"));
      }
    });
    return () => {
      void sub.then((h) => h.remove());
    };
  }, []);

  let body: React.ReactNode;
  if (tab === "plots") {
    body =
      plotId != null ? (
        <PlotDetailScreen plotId={plotId} onBack={() => setPlotId(null)} variant="mobile" />
      ) : (
        <PlotsScreen onOpenPlot={setPlotId} />
      );
  } else if (tab === "farmhands") {
    body = <FarmhandsScreen />;
  } else if (tab === "guide") {
    body = <GuideScreen />;
  } else if (tab === "settings") {
    body = <SettingsScreen />;
  } else if (tab === "leaderboard") {
    body = <RootEconomyScreen variant="mobile" />;
  } else {
    body = <PlaceholderTab title="Replant" blurb="Reset for permanent multipliers — prestige for Root Farms." />;
  }

  return (
    <div className="app-shell app-shell--mobile">
      <main className="app-main">{body}</main>
      <BottomNav tab={tab} onTab={(t) => { setTab(t); setPlotId(null); }} />
      <WelcomeBackModal />
      <VarmintAlertModal />
    </div>
  );
}

function RootFarmsGate() {
  const auth = useAuth();
  if (!auth.decided) {
    return <div className="boot">Loading…</div>;
  }
  if (!auth.canPlay) {
    return <AuthScreen />;
  }
  return (
    <GameProvider>
      <RootFarmsMobileApp />
    </GameProvider>
  );
}

export default function App() {
  return <RootFarmsGate />;
}
