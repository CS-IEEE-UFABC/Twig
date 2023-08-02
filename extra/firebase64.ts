import { readFileSync } from "node:fs"

if (process.argv.length != 3) {
  console.log("Usage: pnpm firebase64 <path/to/firebase-adminsdk.json>");
  process.exit(1)
}

var content;
var json;

try {
  content = readFileSync(process.argv[2])
} catch (e) {
  console.log(`Error: no such file ${process.argv[2]}`)
  process.exit(2)
}

try {
  json = JSON.parse(content.toString())
} catch (e) {
  console.log(`Error: invalid json ${process.argv[2]}`)
  process.exit(2)
}

console.log(Buffer.from(JSON.stringify(json)).toString("base64"))
