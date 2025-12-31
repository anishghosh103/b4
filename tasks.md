- google login
- webhook url - basically a unique shortid https://hookone.dev/wh/{shortid}
- event handling

user logs in
they create a webhook / project
they get a webhook url which they can use wherever they want
they start the local cli (npx hookone 3000) that will listen for events and trigger their localhost url
whenever the webhook url is called, we store the query parameter, payload, headers and relay the same to the cli

socket connection will be handled using a tiny server
