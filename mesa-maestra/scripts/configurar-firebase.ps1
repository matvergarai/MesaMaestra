# Configura el proyecto Firebase para MesaMaestra.
# Uso: .\scripts\configurar-firebase.ps1
# Requiere: npm install ya ejecutado (firebase-tools incluido).

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

Write-Host "`n=== MesaMaestra · Configuración Firebase ===" -ForegroundColor Cyan

# 1. Generar seed
Write-Host "`n[1/6] Generando seed JSON..." -ForegroundColor Yellow
node scripts/generar-seed-firebase.mjs

# 2. Verificar sesión
Write-Host "`n[2/6] Verificando sesión Firebase..." -ForegroundColor Yellow
$loginOutput = npx firebase login:list 2>&1 | Out-String
if ($loginOutput -match "No authorized accounts") {
    Write-Host "No hay sesión activa. Se abrirá el navegador para iniciar sesión." -ForegroundColor Magenta
    npx firebase login
}

# 3. ID del proyecto
$defaultId = "mesa-maestra-" + (Get-Random -Minimum 10000 -Maximum 99999)
Write-Host "`n[3/6] Crear proyecto Firebase" -ForegroundColor Yellow
Write-Host "ID sugerido: $defaultId" -ForegroundColor Gray
$projectId = Read-Host "Ingresa el ID del proyecto (Enter = usar sugerido)"
if ([string]::IsNullOrWhiteSpace($projectId)) {
    $projectId = $defaultId
}

$exists = npx firebase projects:list 2>&1 | Out-String
if ($exists -notmatch $projectId) {
    Write-Host "Creando proyecto '$projectId'..." -ForegroundColor Green
    npx firebase projects:create $projectId --display-name "MesaMaestra"
} else {
    Write-Host "El proyecto '$projectId' ya existe. Continuando..." -ForegroundColor Green
}

# 4. .firebaserc
Write-Host "`n[4/6] Configurando .firebaserc..." -ForegroundColor Yellow
@{
    projects = @{ default = $projectId }
} | ConvertTo-Json | Set-Content -Path ".firebaserc" -Encoding UTF8
npx firebase use $projectId

# 5. Realtime Database (paso manual en consola)
Write-Host "`n[5/6] Activar Realtime Database (paso manual)" -ForegroundColor Yellow
Write-Host @"

  Abre la consola de Firebase:
    https://console.firebase.google.com/project/$projectId/database

  1. Clic en 'Realtime Database' (menú Build).
  2. Clic en 'Create Database'.
  3. Región: us-central1 (o la más cercana).
  4. Modo: 'Start in test mode' (para desarrollo).

"@ -ForegroundColor White

Read-Host "Presiona Enter cuando hayas creado la base de datos en la consola"

# 6. Desplegar reglas e importar datos
Write-Host "`n[6/6] Desplegando reglas e importando seed..." -ForegroundColor Yellow
npx firebase deploy --only database --project $projectId
npx firebase database:set / firebase/database.seed.json --project $projectId --confirm

$databaseUrl = "https://${projectId}-default-rtdb.firebaseio.com"
Write-Host "`n=== Configuración completada ===" -ForegroundColor Green
Write-Host "Project ID:    $projectId"
Write-Host "Database URL:  $databaseUrl"
Write-Host "Juegos (GET):  ${databaseUrl}/juegos.json"
Write-Host "Categorías:    ${databaseUrl}/categorias.json"
Write-Host "`nCopia la Database URL en src/environments/environment.ts" -ForegroundColor Cyan
