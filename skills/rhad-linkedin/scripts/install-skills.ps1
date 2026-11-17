# Installs the companion tools and skills for rhad-linkedin (Windows).
# Usage:  powershell -ExecutionPolicy Bypass -File install-skills.ps1 [-DryRun] [-Only impeccable,hyperframes] [-Skip remotion] [-Yes]
# Always run with -DryRun first. Every third-party command is printed before it runs.
param(
  [switch]$DryRun,
  [string[]]$Only = @(),
  [string[]]$Skip = @(),
  [switch]$Yes,
  [string]$SkillsDir = ''
)
$ErrorActionPreference = 'Continue'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $here
$man = Get-Content (Join-Path $here 'skills-manifest.json') -Raw | ConvertFrom-Json
$skillsHome = if ($SkillsDir) { $SkillsDir } else { Join-Path $HOME '.claude\skills' }
$log = @()

function Want($id) { if ($Only.Count -gt 0 -and ($Only -notcontains $id)) { return $false }; if ($Skip -contains $id) { return $false }; return $true }
function Have-Cmd($c) { return [bool](Get-Command $c -ErrorAction SilentlyContinue) }
function Run($cmd) {
  Write-Host "  > $cmd" -ForegroundColor Cyan
  if ($DryRun) { return $true }
  cmd /c $cmd
  return ($LASTEXITCODE -eq 0)
}
function Installed-Skill($dirs) {
  foreach ($d in $dirs) { foreach ($r in @($skillsHome, (Join-Path $HOME '.agents\skills'))) { if (Test-Path (Join-Path $r $d)) { return $true } } }
  return $false
}

Write-Host "`nrhad-linkedin installer $(if($DryRun){'(DRY RUN, nothing will change)'})" -ForegroundColor Yellow
if (-not $DryRun -and -not $Yes) {
  Write-Host "This installs third-party tools and skills on this machine. Run with -DryRun to preview."
  $a = Read-Host "Continue? (y/N)"; if ($a -notmatch '^(y|yes)$') { Write-Host 'Cancelled.'; exit 1 }
}

# 1. Prerequisites
foreach ($c in 'node','npm','git') { if (-not (Have-Cmd $c)) { Write-Host "MISSING prerequisite: $c. Install it first (https://nodejs.org, https://git-scm.com)." -ForegroundColor Red; if (-not $DryRun) { exit 2 } } }

# 2. Tools
foreach ($t in $man.tools) {
  if (-not (Want $t.id)) { continue }
  $ok = $false
  try { & $t.check[0] $t.check[1..($t.check.Length-1)] 2>$null | Out-Null; $ok = ($LASTEXITCODE -eq 0) } catch { $ok = $false }
  if ($ok) { Write-Host "OK       $($t.id)"; continue }
  Write-Host "INSTALL  $($t.id)" -ForegroundColor Yellow
  $cmds = @(); if ($t.win) { $cmds += $t.win }; if ($t.all) { $cmds += $t.all }
  if (-not $cmds) { Write-Host "  (no installer: $($t.note))"; continue }
  foreach ($c in $cmds) { if (-not (Run $c)) { $log += "FAILED $($t.id): $c"; break } }
}

# 3. Companion skills
foreach ($s in $man.skills) {
  if (-not (Want $s.id)) { continue }
  if (Installed-Skill $s.dirs) { Write-Host "OK       $($s.id)"; continue }
  Write-Host "INSTALL  $($s.id)  $(if($s.note){'[' + $s.note + ']'})" -ForegroundColor Yellow
  foreach ($c in $s.all) { if (-not (Run $c)) { $log += "FAILED $($s.id): $c"; break } }
}

# 4. Bundled skills (copied from this package)
New-Item -ItemType Directory -Force $skillsHome | Out-Null
foreach ($b in $man.bundled) {
  if (-not (Want $b)) { continue }
  # Packaged .skill: bundled-skills\<name> inside this skill. Git repo: sibling folder skills\<name>.
  $src = Join-Path $root "bundled-skills\$b"
  if (-not (Test-Path $src)) { $src = Join-Path (Split-Path -Parent $root) $b }
  $dst = Join-Path $skillsHome $b
  if (Test-Path $dst) { Write-Host "OK       $b (already in ~\.claude\skills; not overwritten)"; continue }
  if (-not (Test-Path $src)) { $log += "MISSING bundled source: $b"; continue }
  Write-Host "COPY     $b -> $dst" -ForegroundColor Yellow
  if (-not $DryRun) { Copy-Item $src $dst -Recurse }
}

Write-Host ''
if ($log.Count) { Write-Host 'Needs attention:' -ForegroundColor Red; $log | ForEach-Object { Write-Host "  $_" } } else { Write-Host 'Done.' -ForegroundColor Green }
Write-Host 'Restart Claude Code, then run: node scripts/preflight.mjs'
