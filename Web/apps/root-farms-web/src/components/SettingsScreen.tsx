import { useAuth } from "../contexts/AuthContext";
import { useGame } from "../contexts/GameContext";
import { PLOT_COUNT, ROWS_PER_PLOT } from "../game/catalog";

export function SettingsScreen() {
  const auth = useAuth();
  const game = useGame();

  return (
    <div className="screen settings-screen">
      <h1>Settings</h1>
      <section className="settings-block">
        <h2>Account</h2>
        {auth.guestMode ? (
          <>
            <p className="settings-line">Playing as guest (test build)</p>
            <p className="settings-note">
              Guest progress is not saved. Closing the app resets your farm and balance.
            </p>
            <button type="button" className="btn btn-ghost" onClick={() => void auth.logout()}>
              Leave guest mode
            </button>
          </>
        ) : (
          <>
            <p className="settings-line">Signed in as {auth.email}</p>
            <button type="button" className="btn btn-ghost" onClick={() => void auth.logout()}>
              Sign out
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => void game.refreshServerBalance()}>
              Refresh balance
            </button>
          </>
        )}
      </section>
      <section className="settings-block">
        <h2>Game</h2>
        <p className="settings-line">{PLOT_COUNT} edible root varieties · {ROWS_PER_PLOT} rows each</p>
        <button type="button" className="btn btn-danger" onClick={() => game.resetProgress()}>
          Reset farm progress
        </button>
      </section>
      {!auth.guestMode ? (
        <section className="settings-block">
          <h2>Root Units (beta)</h2>
          <p className="settings-note">
            Root Farms uses the same Root Units balance as your rootrecord.info account when signed in.
          </p>
        </section>
      ) : null}
    </div>
  );
}
