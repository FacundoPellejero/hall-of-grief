// Menú de inicio + menú de pausa + opciones de accesibilidad (volumen y silencio).

export class Menus {
  constructor(audio, controls) {
    this.audio = audio;
    this.controls = controls;

    this.started = false; // el jugador ya apretó "Comenzar"
    this.ended = false; // se llegó a la pantalla final
    this.suppressPause = false; // el próximo soltado de pointer lock es intencional

    this.$pause = document.getElementById("pause-menu");
    this.$resume = document.getElementById("btn-resume");
    this.$restart = document.getElementById("btn-restart");
    this.$note = document.getElementById("pause-note");

    this.sliders = [...document.querySelectorAll("[data-volume]")];
    this.outputs = [...document.querySelectorAll("[data-volume-out]")];
    this.muteButtons = [...document.querySelectorAll("[data-mute]")];

    this.bindAudioControls();
    this.bindStartMenu();
    this.bindPause();
    this.syncAudioUI();
  }

  // Menú de inicio
  bindStartMenu() {
    const main = document.getElementById("start-main");
    const panel = document.getElementById("start-options-panel");
    const open = document.getElementById("btn-options");
    const back = document.getElementById("btn-options-back");
    if (!main || !panel || !open || !back) return;

    open.addEventListener("click", () => {
      main.hidden = true;
      panel.hidden = false;
      open.setAttribute("aria-expanded", "true");
      const first = panel.querySelector("[data-volume]");
      if (first) first.focus();
    });
    back.addEventListener("click", () => {
      panel.hidden = true;
      main.hidden = false;
      open.setAttribute("aria-expanded", "false");
      open.focus();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) back.click();
    });
  }

  // Accesibilidad
  bindAudioControls() {
    this.sliders.forEach((slider) => {
      slider.addEventListener("input", () => {
        this.audio.setVolume(slider.value / 100);
        // Si estaba silenciado y el jugador mueve el volumen se desmutea
        if (this.audio.muted && Number(slider.value) > 0)
          this.audio.toggleMute(false);
        this.syncAudioUI();
      });
      // Al soltar el deslizador suena una nota suave para que se oiga el nivel elegido
      slider.addEventListener("change", () => {
        if (this.audio.ctx) this.audio.playSoft(392, 0.06);
      });
    });

    this.muteButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.audio.toggleMute();
        this.syncAudioUI();
      });
    });
  }

  syncAudioUI() {
    const pct = Math.round(this.audio.volume * 100);
    const muted = this.audio.muted;
    this.sliders.forEach((s) => {
      s.value = String(pct);
      s.setAttribute(
        "aria-valuetext",
        muted ? `${pct}%, silenciado` : `${pct}%`,
      );
      s.style.setProperty("--fill", `${pct}%`);
    });
    this.outputs.forEach((o) => (o.textContent = `${pct}%`));
    this.muteButtons.forEach((b) => {
      b.setAttribute("aria-pressed", String(muted));
      const state = b.querySelector("[data-mute-state]");
      if (state) state.textContent = muted ? "Sí" : "No";
    });
  }

  // Pausa
  bindPause() {
    document.addEventListener("pointerlockchange", () => {
      const locked = document.pointerLockElement != null;
      if (locked) {
        this.hidePause();
        return;
      }
      // Desbloqueo intencional del juego (pantalla final, memorial): no es una pausa
      if (this.suppressPause) {
        this.suppressPause = false;
        return;
      }
      if (!this.started || this.ended) return;
      this.showPause();
    });

    document.addEventListener("pointerlockerror", () => {
      if (!this.$pause.hidden) {
        this.$note.textContent = "Esperá un momento y volvé a intentar.";
      }
    });

    this.$resume.addEventListener("click", () => {
      this.$note.textContent = "";
      this.controls.lock();
    });

    // Reiniciar pide una segunda confirmación
    const label = this.$restart.textContent;
    let timer = null;
    this.$restart.addEventListener("click", () => {
      if (this.$restart.dataset.armed === "1") {
        window.location.reload();
        return;
      }
      this.$restart.dataset.armed = "1";
      this.$restart.textContent =
        "¿Seguro? Vas a perder tu recorrido. Clic de nuevo para reiniciar";
      timer = setTimeout(() => this.resetRestart(label), 4000);
    });
    this._resetRestart = () => {
      clearTimeout(timer);
      this.resetRestart(label);
    };
  }

  resetRestart(label) {
    delete this.$restart.dataset.armed;
    this.$restart.textContent = label;
  }

  showPause() {
    this.$note.textContent = "";
    this.$pause.hidden = false;
    document.body.classList.add("is-paused");
    this.$resume.focus({ preventScroll: true });
  }

  hidePause() {
    if (this.$pause.hidden) return;
    this.$pause.hidden = true;
    document.body.classList.remove("is-paused");
    this._resetRestart && this._resetRestart();
  }

  // ---------- Hooks que usa main.js ----------
  markStarted() {
    this.started = true;
  }

  markEnded() {
    this.ended = true;
    this.hidePause();
  }

  // Soltar el pointer lock a propósito (pantalla final, memorial) sin que salte la pausa
  unlockQuietly() {
    if (document.pointerLockElement) {
      this.suppressPause = true;
      setTimeout(() => (this.suppressPause = false), 600);
    }
    this.controls.unlock();
  }
}
