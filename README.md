1. visit GraphQL API: http://localhost:4000/graphql

2. subscription codesandbox from docs: https://codesandbox.io/s/github/apollographql/docs-examples/tree/main/server-subscriptions?fontsize=14&hidenavigation=1&theme=dark&file=/index.js:1029-1184

3. curl 'http://localhost:4000/graphql' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' --data-binary '{"query":"query{\n messages{\n id\n text\n user\n }\n}\n"}' --compressed

"subscriptions-transport-ws": "^0.9.19",
"graphql-subscriptions": "^1.2.1",
