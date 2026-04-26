// js/modules/password.js

export async function sha1(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-1", buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('').toUpperCase();
}

export async function checkBreach(password) {
  const hash = await sha1(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const data = await res.text();

  const found = data.split("\n").find(line => line.startsWith(suffix));

  if (found) {
    const count = found.split(":")[1];
    return `⚠️ Found ${count} times in breaches`;
  }
  return "✅ No breaches found";
}