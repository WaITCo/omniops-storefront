# omniops-storefront

## Projekt

Next.js 15 Headless eCommerce Frontend für den **FORMA Demo-Shop**.
Verbindet sich mit `WaITCo/omniops-os` (Strapi CMS) als Backend.

- **Repo:** https://github.com/WaITCo/omniops-storefront
- **Main Branch:** `main`
- **Sprache:** Deutsch (README, Issues, PRs)
- **Port (lokal):** 3002

---

## Tech Stack

| Bereich | Technologien |
|---------|-------------|
| Framework | Next.js 15 (App Router) |
| Sprache | TypeScript |
| Styling | Tailwind CSS v4 |
| i18n | next-intl (DE + EN) |
| State | Zustand (Cart) |
| Forms | react-hook-form + zod |
| CMS | Strapi 5 (omniops-os, Port 1337) |
| Automation | n8n (omniops-os, Port 5678) |

---

## Brand: FORMA

> **„Werkzeuge, die wirken."**

| Token | Wert |
|-------|------|
| Background | `#FAFAF9` |
| Foreground | `#1A1A18` |
| Accent | `#D4622A` |
| Muted | `#E8E6E1` |

Fonts: `Instrument Serif` (Headings) · `Inter` (Body) · `JetBrains Mono` (Labels/Preise)

---

## Lokale Entwicklung

```bash
# Voraussetzung: omniops-os läuft auf :1337 (Strapi) und :5678 (n8n)
cp .env.example .env.local
# .env.local mit echten Werten befüllen

npm run dev        # Startet auf Port 3002 (NEXT_PUBLIC_SITE_URL anpassen)
npm run build      # TypeScript-Build
npm run lint       # ESLint
```

---

## Workflow: Issue → Branch → PR

1. **Issue** auf GitHub erstellen
2. **Feature-Branch** anlegen: `git checkout -b feature/<nummer>-<kurzbeschreibung>`
3. **Implementieren** mit konventionellen Commits (`feat:`, `fix:`, `chore:`, `docs:`)
4. **Pull Request** gegen `main` (Template unten beachten)
5. **Squash & Merge**

---

## PR-Template

```markdown
## Beschreibung
<!-- Was wurde geändert und warum? Closes #<nummer> -->

## Checkliste

- [ ] **TypeScript** – `npm run build` läuft ohne Fehler
- [ ] **Lint** – `npm run lint` läuft ohne Fehler
- [ ] **i18n** – Neue Strings in `messages/de.json` + `messages/en.json`
- [ ] **Breaking Changes** – Keine ODER Migration dokumentiert
- [ ] **Secrets** – Keine Credentials committed
```
