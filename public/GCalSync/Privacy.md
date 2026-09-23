# GCalSync — Privacy Policy

*Last updated: March 12, 2026*

## Overview

GCalSync is a Google Workspace Add-on developed by Twilight Coders LLC. We take your privacy seriously. This policy explains what data the Add-on accesses and how it is handled.

## Data Access

GCalSync accesses the following data through the Google Calendar API:

- **Source calendar events:** Event times, titles, descriptions, attendee lists, and status from the calendar you configure as your source
- **Primary calendar events:** Events on your primary calendar to identify previously synced entries

## Data Usage

Accessed data is used solely to:

- Create, update, and delete "blocked" time entries on your primary calendar
- Determine which events match your configured filters (weekday, working hours, confirmation status)
- Apply your privacy preferences (hiding or showing event details)

## Data Storage

- **Configuration** (source calendar ID, filter preferences, sync tokens) is stored in your Google Apps Script User Properties, which are scoped to your Google account
- **No data is stored on external servers.** The Add-on runs entirely within Google Apps Script
- **No data is shared with third parties.** Twilight Coders LLC does not collect, transmit, or have access to your calendar data

## Data Retention

- Synced events remain on your primary calendar until deleted by the Add-on or by you
- Configuration is retained in your User Properties until you uninstall the Add-on or clear it manually

## Permissions

The Add-on requests the following OAuth scopes:

- `calendar` — Read and write calendar events (required for syncing)
- `calendar.addons.execute` — Run as a Calendar add-on
- `script.locale` — Detect your locale for timezone handling

## Changes

We may update this Privacy Policy from time to time. Changes will be reflected in the "Last updated" date above.

## Contact

For privacy questions or concerns, open an issue at [github.com/TwilightCoders/GCalSync](https://github.com/TwilightCoders/GCalSync/issues) or email support@twilightcoders.net.
