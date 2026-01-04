- when a request comes in, it sends a predefined response immediately and then starts processing webhook request
  - we transform the request as required
  - we send the transformed payload to destination
  - destination could be the user's webhook or cli
  - cli is just for local testing and has a daily/hourly limit
- predefined workflows
  - user create a webhook
  - they can add a production webhook url where we will be relaying the requests or they could test using cli
  - the webhook can be:
    - either vanilla, whatever comes is passed as it is
    - or platform specific
      - payment platforms - stripe or dodopayments or polar
        - verify signature
        - subscription handling - active/cancelled/failed/renewed/upgraded
        - one-time payment handling - completed/failed
      - esign platforms - pandadoc or docusign or documenso
        - verify signature
        - signing - send/signed/completed/cancelled

socket connection will be handled using a tiny server

✅ landing page - hookone.dev
✅ authentication - just google for now
✅ webhook url creation
✅ cli package
✅ event relaying and storage
✅ subscriptions
⬜️ workflows
⬜️ deployment

The "Comparison" Table

The Fix: Answer "Why not Ngrok?" or "Why not Logs?"

Implementation:

Create a simple comparison table:

Column 1 (HookOne): Replay History, Edit Payloads, Filter by JSON Content, Persistent URL.

Column 2 (CLI Tunnels): Ephemeral URLs, No History, Cant Edit/Replay.

Column 3 (App Logs): Hard to search, No Replay capability.

## To Do

- fix payment failed
- make event time (2m ago) increment in realtime
- restrict cli to just one device / webhook
- add filter capability
- create an all events page
- workflows
  - Additional workflows (Stripe one-time payment, PandaDoc signing)
  - Recording & replay of real events
