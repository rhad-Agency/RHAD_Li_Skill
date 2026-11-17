# One-step install for rhad-linkedin (Windows).
#   powershell -ExecutionPolicy Bypass -File install.ps1 -DryRun   # preview, changes nothing
#   powershell -ExecutionPolicy Bypass -File install.ps1           # install
# Options: -Force (overwrite skills already installed), -SkillsDir <path>, -Yes (no prompt),
#          -Only a,b / -Skip a,b (limit third-party installs), -SkipDeps (copy skills only)
param(
  [switch]$DryRun,
  [switch]$Force,
  [switch]$Yes,
  [switch]$SkipDeps,
  [string]$SkillsDir = '',
  [string[]]$Only = @(),
  [string[]]$Skip = @()
)
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $repo 'skills'
$dst = if ($SkillsDir) { $SkillsDir } else { Join-Path $HOME '.claude\skills' }

Write-Host "`nrhad-linkedin  ->  $dst  $(if($DryRun){'(DRY RUN)'})" -ForegroundColor Yellow
if (-not $DryRun -and -not $Yes) { $a = Read-Host 'Copy skills and install dependencies? (y/N)'; if ($a -notmatch '^(y|yes)$') { Write-Host 'Cancelled.'; exit 1 } }

if (-not $DryRun) { New-Item -ItemType Directory -Force $dst | Out-Null }
foreach ($d in Get-ChildItem $src -Directory) {
  $target = Join-Path $dst $d.Name
  if ((Test-Path $target) -and -not $Force) { Write-Host "SKIP     $($d.Name) (exists, use -Force to overwrite)"; continue }
  Write-Host "COPY     $($d.Name)"
  if (-not $DryRun) { if (Test-Path $target) { Remove-Item $target -Recurse -Force }; Copy-Item $d.FullName $target -Recurse }
}

if ($SkipDeps) { Write-Host 'Dependencies skipped.'; exit 0 }
$inst = Join-Path $src 'rhad-linkedin\scripts\install-skills.ps1'
$args2 = @('-NoProfile','-ExecutionPolicy','Bypass','-File',$inst,'-SkillsDir',$dst,'-Yes')
if ($DryRun) { $args2 += '-DryRun' }
if ($Only.Count) { $args2 += @('-Only', ($Only -join ',')) }
if ($Skip.Count) { $args2 += @('-Skip', ($Skip -join ',')) }
powershell @args2
