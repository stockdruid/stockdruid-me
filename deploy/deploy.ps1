# stockdruid.me 배포 스크립트
#
#   powershell -ExecutionPolicy Bypass -File deploy\deploy.ps1
#
# 최신 코드를 받아 빌드하고 standalone 산출물을 구성한 뒤 PM2 프로세스를 재시작한다.
# PM2 미설치 시: npm i -g pm2

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "[1/5] 최신 코드 가져오는 중" -ForegroundColor Cyan
git pull --ff-only

Write-Host "[2/5] 의존성 설치" -ForegroundColor Cyan
npm ci

Write-Host "[3/5] 프로덕션 빌드" -ForegroundColor Cyan
npm run build

# standalone 출력은 static/public 을 자동으로 복사하지 않는다. 직접 넣어줘야 한다.
Write-Host "[4/5] standalone 산출물 구성" -ForegroundColor Cyan
Copy-Item -Recurse -Force ".next\static" ".next\standalone\.next\static"
if (Test-Path "public") {
  Copy-Item -Recurse -Force "public" ".next\standalone\public"
}

Write-Host "[5/5] 서버 재시작" -ForegroundColor Cyan

# 문의 적재 파일은 빌드 산출물 바깥에 둔다. standalone server.js가 자기 디렉터리로
# chdir하기 때문에, 지정하지 않으면 배포할 때마다 접수된 문의가 사라진다.
$env:CONTACT_LOG_DIR = Join-Path (Get-Location) "data"

$running = pm2 jlist | ConvertFrom-Json | Where-Object { $_.name -eq "stockdruid" }
if ($running) {
  pm2 restart stockdruid --update-env
} else {
  pm2 start ".next\standalone\server.js" --name stockdruid --update-env
  pm2 save
}

Write-Host "완료. http://localhost:3000 확인" -ForegroundColor Green
