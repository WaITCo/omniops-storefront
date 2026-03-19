# omniops-storefront

Next.js 15 Headless eCommerce Frontend für den **FORMA Demo-Shop** – entwickelt von [WaITCo](https://github.com/WaITCo).

---

## Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Tech Stack](#tech-stack)
3. [Brand: FORMA](#brand-forma)
4. [Voraussetzungen](#voraussetzungen)
5. [Lokale Entwicklung](#lokale-entwicklung)
6. [Projektstruktur](#projektstruktur)
7. [n8n Workflows](#n8n-workflows)
8. [Deployment](#deployment)
9. [Entwicklungs-Workflow](#entwicklungs-workflow)

---

## Überblick

`omniops-storefront` ist ein modernes, headless eCommerce-Frontend auf Basis von **Next.js 15 (App Router)**. Es verbindet sich mit dem Backend-Stack aus [`WaITCo/omniops-os`](https://github.com/WaITCo/omniops-os) und demonstriert den Einsatz von Strapi als Headless CMS sowie n8n für die Shop-Automatisierung.

Der Shop operiert unter der fiktiven Brand **FORMA** und dient als vollständiger Demo-Storefront mit Produktkatalog, Warenkorb und Checkout-Flow.

---

## Tech Stack

| Bereich         | Technologien                      |
|-----------------|-----------------------------------|
| Framework       | Next.js 15 (App Router)           |
| Sprache         | TypeScript                        |
| Styling         | Tailwind CSS v4                   |
| i18n            | next-intl (DE + EN)               |
| State           | Zustand (Cart)                    |
| Forms           | react-hook-form + zod             |
| CMS/Backend     | Strapi 5 (omniops-os, Port 1337)  |
| Automatisierung | n8n (omniops-os, Port 5678)       |

---

## Brand: FORMA

> **„Werkzeuge, die wirken."**

| Token      | Wert      |
|------------|-----------|
| Background | `#FAFAF9` |
| Foreground | `#1A1A18` |
| Accent     | `#D4622A` |
| Muted      | `#E8E6E1` |

**Fonts:** `Instrument Serif` (Headings) · `Inter` (Body) · `JetBrains Mono` (Labels/Preise)

---

## Voraussetzungen

- **Node.js** 20+
- **[omniops-os](https://github.com/WaITCo/omniops-os)** läuft lokal:
  - Strapi CMS auf Port `1337`
  - n8n auf Port `5678`
- n8n Workflows importiert (siehe [n8n Workflows](#n8n-workflows))

---

## Lokale Entwicklung

```bash
# 1. Umgebungsvariablen vorbereiten
cp .env.example .env.local
# .env.local mit den lokalen Werten befüllen

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten
npm run dev   # → http://localhost:3002
```

Weitere nützliche Befehle:

```bash
npm run build   # TypeScript-Build (Produktions-Check)
npm run lint    # ESLint
```

---

## Projektstruktur

```
omniops-storefront/
├── src/
│   ├── app/              # Next.js App Router (Seiten & Layouts)
│   ├── components/       # Wiederverwendbare UI-Komponenten
│   ├── i18n/             # Internationalisierung (next-intl)
│   └── lib/              # API-Clients, Utilities, Typen
├── messages/             # Übersetzungsdateien (de.json, en.json)
├── public/               # Statische Assets
├── n8n/
│   └── workflows/        # n8n Workflow-Definitionen (JSON)
├── terraform/            # Infrastruktur als Code (AWS/GCP)
├── docker/               # Docker-Konfigurationen
└── docker-compose.yml
```

---

## n8n Workflows

Der Storefront nutzt **n8n** für die Shop-Automatisierung. Die Workflow-Definitionen liegen im Verzeichnis [`n8n/workflows/`](./n8n/workflows/) und müssen einmalig manuell in n8n importiert werden.

### Import-Anleitung

1. n8n öffnen: [http://localhost:5678](http://localhost:5678)
2. Oben rechts auf **„+"** → **„Import from file"** klicken
3. Die gewünschte JSON-Datei aus `n8n/workflows/` auswählen
4. Credentials (SMTP, CRM, etc.) im Workflow hinterlegen
5. Workflow aktivieren

### Enthaltene Workflows

| Datei                          | Workflow                               | Beschreibung |
|--------------------------------|----------------------------------------|--------------|
| `welcome-email.json`           | eCommerce – Willkommens-E-Mail         | Versendet automatisch eine Willkommens-E-Mail bei Neuregistrierung |
| `order-confirmation-email.json`| eCommerce – Bestellbestätigung per E-Mail | Sendet eine Bestellbestätigung nach erfolgreichem Checkout |
| `order-to-crm.json`            | eCommerce – Bestellung in Twenty CRM  | Überträgt neue Bestellungen automatisch in Twenty CRM |
| `abandoned-cart-reminder.json` | eCommerce – Abandoned Cart Reminder   | Erinnert Nutzer per E-Mail an nicht abgeschlossene Bestellungen |
| `low-stock-alert.json`         | eCommerce – Low Stock Alert           | Benachrichtigt intern, wenn der Lagerbestand eines Produkts einen Schwellenwert unterschreitet |

---

## Deployment

```bash
# AWS
make deploy-aws

# Google Cloud Platform
make deploy-gcp GCP_PROJECT_ID=<id>
```

Die Infrastruktur wird über Terraform verwaltet (siehe `terraform/`). Details zum vollständigen Deployment-Workflow in [CLAUDE.md](CLAUDE.md).

---

## Entwicklungs-Workflow

1. **Issue** auf GitHub erstellen
2. **Feature-Branch** anlegen:
   ```bash
   git checkout -b feature/<issue-nummer>-<kurzbeschreibung>
   ```
3. **Implementieren** mit konventionellen Commits:
   - `feat:` – Neues Feature
   - `fix:` – Bugfix
   - `chore:` – Wartung/Konfiguration
   - `docs:` – Dokumentation
4. **Pull Request** gegen `main` öffnen
5. **Squash & Merge**
