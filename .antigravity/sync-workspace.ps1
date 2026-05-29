# Antigravity Workspace Sync & Link Tool
# This script merges your conversation histories and links them using NTFS junctions.
# Run this script with Administrator privileges to create junctions successfully if required.

$ErrorActionPreference = "Stop"

$ideDir = "C:\Users\Lenovo\.gemini\antigravity-ide"
$standDir = "C:\Users\Lenovo\.gemini\antigravity"
$backupRoot = Join-Path $env:USERPROFILE ".gemini\backups_sync_$(Get-Date -Format 'yyyyMMdd_HHmmss')"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Antigravity IDE & Standalone Chat Syncer" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "IDE Directory: $ideDir" -ForegroundColor Gray
Write-Host "Standalone Directory: $standDir" -ForegroundColor Gray
Write-Host ""

# 1. Validation
if (-not (Test-Path $ideDir)) {
    Write-Error "IDE Directory not found at $ideDir"
}
if (-not (Test-Path $standDir)) {
    Write-Error "Standalone Directory not found at $standDir"
}

$ideConversationsPath = Join-Path $ideDir "conversations"
$ideBrainPath = Join-Path $ideDir "brain"
$standConversationsPath = Join-Path $standDir "conversations"
$standBrainPath = Join-Path $standDir "brain"

# Check if junctions are already present
$ideConversationsAttr = (Get-Item $ideConversationsPath).Attributes
$ideBrainAttr = (Get-Item $ideBrainPath).Attributes

if ($ideConversationsAttr -match "ReparsePoint" -and $ideBrainAttr -match "ReparsePoint") {
    Write-Host "✓ Directories are already linked via NTFS Junctions!" -ForegroundColor Green
    Write-Host "Your saved chats are fully synchronized in real-time." -ForegroundColor Green
    exit 0
}

Write-Host "Starting safe migration and synchronization..." -ForegroundColor Yellow

# 2. Backup
Write-Host "Creating backup folder at: $backupRoot" -ForegroundColor Gray
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$backupIdeConversations = Join-Path $backupRoot "ide_conversations"
$backupIdeBrain = Join-Path $backupRoot "ide_brain"
$backupStandConversations = Join-Path $backupRoot "stand_conversations"
$backupStandBrain = Join-Path $backupRoot "stand_brain"

Write-Host "Backing up existing files..." -ForegroundColor Gray
if (Test-Path $ideConversationsPath) {
    Copy-Item -Path $ideConversationsPath -Destination $backupIdeConversations -Recurse -Force
}
if (Test-Path $ideBrainPath) {
    Copy-Item -Path $ideBrainPath -Destination $backupIdeBrain -Recurse -Force
}
if (Test-Path $standConversationsPath) {
    Copy-Item -Path $standConversationsPath -Destination $backupStandConversations -Recurse -Force
}
if (Test-Path $standBrainPath) {
    Copy-Item -Path $standBrainPath -Destination $backupStandBrain -Recurse -Force
}
Write-Host "✓ Backups completed successfully." -ForegroundColor Green

# 3. Merging files into Standalone
Write-Host "Merging IDE files into Standalone directories..." -ForegroundColor Gray

# Merge conversations (only copy if target doesn't exist)
if (Test-Path $ideConversationsPath) {
    Get-ChildItem -Path $ideConversationsPath -File | ForEach-Object {
        $destFile = Join-Path $standConversationsPath $_.Name
        if (-not (Test-Path $destFile)) {
            Copy-Item -Path $_.FullName -Destination $destFile -Force
        }
    }
}

# Merge brain directory (only copy subfolders if target doesn't exist)
if (Test-Path $ideBrainPath) {
    Get-ChildItem -Path $ideBrainPath -Directory | ForEach-Object {
        $destSubdir = Join-Path $standBrainPath $_.Name
        if (-not (Test-Path $destSubdir)) {
            Copy-Item -Path $_.FullName -Destination $destSubdir -Recurse -Force
        }
    }
}
Write-Host "✓ Merge completed successfully." -ForegroundColor Green

# 4. Deleting IDE directories to prepare for junction creation
Write-Host "Replacing IDE directories with NTFS Junctions..." -ForegroundColor Gray

if (Test-Path $ideConversationsPath) {
    Remove-Item -Path $ideConversationsPath -Recurse -Force
}
if (Test-Path $ideBrainPath) {
    Remove-Item -Path $ideBrainPath -Recurse -Force
}

# 5. Creating Junctions
cmd.exe /c mklink /J "$ideConversationsPath" "$standConversationsPath" | Out-Null
cmd.exe /c mklink /J "$ideBrainPath" "$standBrainPath" | Out-Null

# 6. Verify and finish
if (Test-Path $ideConversationsPath -and Test-Path $ideBrainPath) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host " ★ SYNCHRONIZATION COMPLETED SUCCESSFUL ★" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Conversations and brain histories are now perfectly synced!" -ForegroundColor Green
    Write-Host "You can close and reopen your IDE and Antigravity standalone app to see all chats." -ForegroundColor Yellow
} else {
    Write-Error "Failed to link directories correctly."
}
