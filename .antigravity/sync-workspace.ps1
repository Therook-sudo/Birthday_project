# Antigravity Workspace Sync & Link Tool
# Safe Powershell script with standard ASCII only

$ErrorActionPreference = "Stop"

$ideDir = "C:\Users\Lenovo\.gemini\antigravity-ide"
$standDir = "C:\Users\Lenovo\.gemini\antigravity"
$backupRoot = "$env:USERPROFILE\.gemini\backups_sync_$(Get-Date -Format 'yyyyMMdd_HHmmss')"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Antigravity IDE & Standalone Chat Syncer" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "IDE Directory: $ideDir" -ForegroundColor Gray
Write-Host "Standalone Directory: $standDir" -ForegroundColor Gray
Write-Host ""

# 1. Validation
if (-not (Test-Path $ideDir)) {
    Write-Error "IDE Directory not found"
}
if (-not (Test-Path $standDir)) {
    Write-Error "Standalone Directory not found"
}

$ideConversationsPath = "$ideDir\conversations"
$ideBrainPath = "$ideDir\brain"
$standConversationsPath = "$standDir\conversations"
$standBrainPath = "$standDir\brain"

# Check if already linked
$isLinked = $false
if (Test-Path $ideConversationsPath) {
    $item = Get-Item $ideConversationsPath
    if ($item.Attributes -match "ReparsePoint") {
        $isLinked = $true
    }
}

if ($isLinked) {
    Write-Host "Junctions are already linked via NTFS Junctions!" -ForegroundColor Green
    exit 0
}

Write-Host "Starting safe migration..." -ForegroundColor Yellow

# 2. Create Backup Folder
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null
Write-Host "Backup path created at: $backupRoot" -ForegroundColor Gray

# 3. Copy files for safety
if (Test-Path $ideConversationsPath) {
    Copy-Item -Path $ideConversationsPath -Destination "$backupRoot\ide_conversations" -Recurse -Force
}
if (Test-Path $ideBrainPath) {
    Copy-Item -Path $ideBrainPath -Destination "$backupRoot\ide_brain" -Recurse -Force
}
if (Test-Path $standConversationsPath) {
    Copy-Item -Path $standConversationsPath -Destination "$backupRoot\stand_conversations" -Recurse -Force
}
if (Test-Path $standBrainPath) {
    Copy-Item -Path $standBrainPath -Destination "$backupRoot\stand_brain" -Recurse -Force
}
Write-Host "Backups completed successfully." -ForegroundColor Green

# 4. Merge IDE files into Standalone
Write-Host "Merging histories..." -ForegroundColor Gray

if (Test-Path $ideConversationsPath) {
    Get-ChildItem -Path $ideConversationsPath -File | ForEach-Object {
        $dest = "$standConversationsPath\$($_.Name)"
        if (-not (Test-Path $dest)) {
            Copy-Item -Path $_.FullName -Destination $dest -Force
        }
    }
}

if (Test-Path $ideBrainPath) {
    Get-ChildItem -Path $ideBrainPath -Directory | ForEach-Object {
        $dest = "$standBrainPath\$($_.Name)"
        if (-not (Test-Path $dest)) {
            Copy-Item -Path $_.FullName -Destination $dest -Recurse -Force
        }
    }
}
Write-Host "Merge completed successfully." -ForegroundColor Green

# 5. Clean up old IDE folders to make room for links
if (Test-Path $ideConversationsPath) {
    Remove-Item -Path $ideConversationsPath -Recurse -Force
}
if (Test-Path $ideBrainPath) {
    Remove-Item -Path $ideBrainPath -Recurse -Force
}

# 6. Establish NTFS Junction links
cmd.exe /c mklink /J "$ideConversationsPath" "$standConversationsPath" | Out-Null
cmd.exe /c mklink /J "$ideBrainPath" "$standBrainPath" | Out-Null

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   SYNCHRONIZATION COMPLETED SUCCESSFULLY " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Saved chats are now shared and synced in real-time!" -ForegroundColor Green
