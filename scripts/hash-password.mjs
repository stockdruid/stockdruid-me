/**
 * 관리자 비밀번호 해시 생성기.
 *
 *   npm run admin:hash
 *
 * 입력한 비밀번호는 화면에 찍히지 않고 어디에도 저장되지 않는다.
 * 출력된 한 줄을 .env.local 에 붙여넣으면 된다.
 *
 * scrypt 를 쓴다. 파라미터는 OWASP 권장치(N=2^17, r=8, p=1)를 따른다.
 */
import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const SCRYPT_PARAMS = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
const KEY_LEN = 64;
const MIN_LENGTH = 12;

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const onData = (char) => {
      // 입력 중에는 아무것도 출력하지 않는다. 어깨너머로 보이지 않게.
      if (["\n", "\r", ""].includes(char.toString())) {
        process.stdin.removeListener("data", onData);
      } else {
        process.stdout.write("[2K[200D" + question);
      }
    };
    process.stdin.on("data", onData);
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const password = await askHidden("관리자 비밀번호 (화면에 표시되지 않음): ");

if (password.length < MIN_LENGTH) {
  console.error(`\n비밀번호가 너무 짧습니다. ${MIN_LENGTH}자 이상으로 정하세요.`);
  process.exit(1);
}

const confirm = await askHidden("한 번 더 입력: ");
if (password !== confirm) {
  console.error("\n두 입력이 다릅니다. 다시 실행하세요.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await scryptAsync(password, salt, KEY_LEN, SCRYPT_PARAMS);

const encoded = `scrypt$${SCRYPT_PARAMS.N}$${SCRYPT_PARAMS.r}$${SCRYPT_PARAMS.p}$${salt.toString("base64")}$${Buffer.from(hash).toString("base64")}`;

console.log("\n아래 두 줄을 .env.local 에 붙여넣으세요.\n");
console.log(`ADMIN_PASSWORD_HASH=${encoded}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64")}`);
console.log("\n붙여넣은 뒤 서버를 재시작하면 /admin 으로 로그인할 수 있습니다.");
