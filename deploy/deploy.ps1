# stockdruid.me 배포 스크립트
#
#   powershell -ExecutionPolicy Bypass -File deploy\deploy.ps1
#
# 최신 코드를 받아 빌드하고 standalone 산출물을 구성한 뒤 PM2 프로세스를 재시작한다.
# PM2 미설치 시: npm i -g pm2

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "[1/6] 최신 코드 가져오는 중" -ForegroundColor Cyan
git pull --ff-only

Write-Host "[2/6] 의존성 설치" -ForegroundColor Cyan
npm ci

# Windows 는 실행 중인 프로세스의 작업 디렉터리를 지우지 못한다. PM2 가
# .next\standalone\server.js 를 물고 있으면 빌드가 EBUSY 로 죽는다.
# 빌드 전에 멈춰 두고 끝난 뒤에 다시 올린다.
pm2 describe stockdruid *> $null
$running = ($LASTEXITCODE -eq 0)
if ($running) {
  Write-Host "[3/6] 빌드 전 서버 정지" -ForegroundColor Cyan
  pm2 stop stockdruid | Out-Null
}

Write-Host "[4/6] 프로덕션 빌드" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
  if ($running) { pm2 start stockdruid | Out-Null }
  throw "빌드 실패. 서버는 이전 산출물로 되돌렸다."
}

# standalone 출력은 static/public 을 자동으로 복사하지 않는다. 직접 넣어줘야 한다.
Write-Host "[5/6] standalone 산출물 구성" -ForegroundColor Cyan
Copy-Item -Recurse -Force ".next\static" ".next\standalone\.next\static"
if (Test-Path "public") {
  Copy-Item -Recurse -Force "public" ".next\standalone\public"
}

Write-Host "[6/6] 서버 재시작" -ForegroundColor Cyan

# standalone 빌드의 server.js 는 자기 디렉터리로 chdir 하므로 프로젝트 루트의
# .env.local 을 읽지 못한다. 여기서 직접 읽어 프로세스 환경에 주입한다.
$envFile = Join-Path (Get-Location) ".env.local"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
      $i = $line.IndexOf("=")
      $key = $line.Substring(0, $i).Trim()
      $val = $line.Substring($i + 1).Trim()
      if ($key) { [Environment]::SetEnvironmentVariable($key, $val, "Process") }
    }
  }
  Write-Host "  .env.local 반영" -ForegroundColor DarkGray
}

# 문의 적재 파일은 빌드 산출물 바깥에 둔다. 지정하지 않으면 배포할 때마다 사라진다.
if (-not $env:CONTACT_LOG_DIR) {
  $env:CONTACT_LOG_DIR = Join-Path (Get-Location) "data"
}

if ($running) {
  pm2 restart stockdruid --update-env
} else {
  pm2 start ".next\standalone\server.js" --name stockdruid --update-env
  pm2 save
}

Write-Host "완료. http://localhost:3000 확인" -ForegroundColor Green
