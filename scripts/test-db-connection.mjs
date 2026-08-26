import mysql from "mysql2/promise";
import dns from "dns/promises";

async function testConnections() {
  console.log("--- Testing Database Connection to Hostinger ---");
  
  const user = "u257795766_koyla_admin";
  const password = "Iranikoyla@123";
  const database = "u257795766_koyla_os";
  
  let domainIp = "";
  try {
    const lookup = await dns.lookup("iranikoylashawarma.com");
    domainIp = lookup.address;
    console.log(`Resolved domain iranikoylashawarma.com to IP: ${domainIp}`);
  } catch (e) {
    console.log("Could not resolve iranikoylashawarma.com:", e.message);
  }

  const hostsToTry = [
    "iranikoylashawarma.com",
    domainIp,
    "127.0.0.1",
    "localhost"
  ].filter(Boolean);

  for (const host of hostsToTry) {
    console.log(`\nAttempting connection to host: ${host}:3306 ...`);
    try {
      const conn = await mysql.createConnection({
        host,
        port: 3306,
        user,
        password,
        database,
        connectTimeout: 5000,
        ssl: {
          rejectUnauthorized: false
        }
      });
      console.log(`✅ SUCCESS! Successfully connected to MySQL on ${host}:3306!`);
      const [rows] = await conn.query("SHOW TABLES;");
      console.log("Existing tables in database:", rows);
      await conn.end();
      return host;
    } catch (err) {
      console.log(`❌ Connection to ${host} failed: ${err.message} (code: ${err.code})`);
    }
  }

  return null;
}

testConnections().then((res) => {
  if (res) {
    console.log(`\n>>> Working host found: ${res}`);
  } else {
    console.log("\n>>> Direct remote connection could not be established to candidate hosts.");
  }
  process.exit(0);
});
