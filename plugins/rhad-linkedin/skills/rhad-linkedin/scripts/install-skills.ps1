# Installs the companion tools and skills for rhad-linkedin (Windows), for Claude Code, Codex, or both.
# Usage:  powershell -ExecutionPolicy Bypass -File install-skills.ps1 [-Agent claude|codex|both] [-DryRun] [-Only a,b] [-Skip c] [-Yes] [-SkillsDir <path>]
# Always run with -DryRun first. Every third-party command is printed before it runs.
param(
  [ValidateSet('claude','codex','both')][string]$Agent = 'claude',
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
$log = @()
$agents = if ($Agent -eq 'both') { @('claude','codex') } else { @($Agent) }
if ($SkillsDir -and $agents.Count -gt 1) { Write-Host '-SkillsDir needs a single -Agent.' -ForegroundColor Red; exit 2 }

function Want($id) { if ($Only.Count -gt 0 -and ($Only -notcontains $id)) { return $false }; if ($Skip -contains $id) { return $false }; return $true }
function Have-Cmd($c) { return [bool](Get-Command $c -ErrorAction SilentlyContinue) }
function Run($cmd) {
  Write-Host "  > $cmd" -ForegroundColor Cyan
  if ($DryRun) { return $true }
  cmd /c $cmd
  return ($LASTEXITCODE -eq 0)
}
function Fill($cmd, $ph) { foreach ($k in $ph.PSObject.Properties.Name) { $cmd = $cmd.Replace('{' + $k + '}', $ph.$k) }; return $cmd }
function Skills-Home($ag) { if ($SkillsDir) { return $SkillsDir }; return (Join-Path $HOME ($man.skillsDir.$ag -replace '/', '\')) }
function Installed-Skill($dirs, $ag) {
  $roots = @((Skills-Home $ag), (Join-Path $HOME '.agents\skills'), (Join-Path $HOME '.claude\skills'))
  foreach ($d in $dirs) { foreach ($r in $roots) { if (Test-Path (Join-Path $r $d)) { return $true } } }
  return $false
}

Write-Host "`nrhad-linkedin installer  agent: $Agent  $(if($DryRun){'(DRY RUN, nothing will change)'})" -ForegroundColor Yellow
if (-not $DryRun -and -not $Yes) {
  Write-Host 'This installs third-party tools and skills on this machine. Run with -DryRun to preview.'
  $a = Read-Host 'Continue? (y/N)'; if ($a -notmatch '^(y|yes)$') { Write-Host 'Cancelled.'; exit 1 }
}

# 1. Prerequisites
foreach ($c in 'node','npm','git') { if (-not (Have-Cmd $c)) { Write-Host "MISSING prerequisite: $c. Install it first (https://nodejs.org, https://git-scm.com)." -ForegroundColor Red; if (-not $DryRun) { exit 2 } } }

# 2. Tools (once)
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

foreach ($ag in $agents) {
  Write-Host "`n== $ag ==" -ForegroundColor Yellow
  if ($ag -eq 'claude' -and -not (Have-Cmd 'claude')) { Write-Host 'note: claude CLI not on PATH. Plugin commands for Claude Code may fail; skills are still copied.' }
  if ($ag -eq 'codex' -and -not (Have-Cmd 'codex')) { Write-Host 'note: codex CLI not on PATH. Skills are still copied to the Codex skills folder.' }
  $ph = $man.placeholders.$ag
  $skillsHome = Skills-Home $ag

  # 3. Companion skills
  foreach ($s in $man.skills) {
    if (-not (Want $s.id)) { continue }
    if (Installed-Skill $s.dirs $ag) { Write-Host "OK       $($s.id)"; continue }
    Write-Host "INSTALL  $($s.id)  $(if($s.note){'[' + $s.note + ']'})" -ForegroundColor Yellow
    $cmds = if ($s.$ag) { $s.$ag } else { $s.all }
    foreach ($c in $cmds) { if (-not (Run (Fill $c $ph))) { $log += "FAILED $($s.id) ($ag): $c"; break } }
  }

  # 4. Bundled skills (packaged .skill: bundled-skills\<name>; git repo: sibling folder)
  if (-not $DryRun) { New-Item -ItemType Directory -Force $skillsHome | Out-Null }
  foreach ($b in $man.bundled) {
    if (-not (Want $b)) { continue }
    $src = Join-Path $root "bundled-skills\$b"
    if (-not (Test-Path $src)) { $src = Join-Path (Split-Path -Parent $root) $b }
    $dst = Join-Path $skillsHome $b
    if (Test-Path $dst) { Write-Host "OK       $b (already in $skillsHome; not overwritten)"; continue }
    if (-not (Test-Path $src)) { $log += "MISSING bundled source: $b"; continue }
    Write-Host "COPY     $b -> $dst" -ForegroundColor Yellow
    if (-not $DryRun) { Copy-Item $src $dst -Recurse }
  }
}

Write-Host ''
if ($log.Count) { Write-Host 'Needs attention:' -ForegroundColor Red; $log | ForEach-Object { Write-Host "  $_" } } else { Write-Host 'Done.' -ForegroundColor Green }
Write-Host 'Restart Claude Code or Codex, then run: node scripts/preflight.mjs'
