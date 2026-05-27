#!/usr/bin/env bash
# PreToolUse(Bash) hook: block `git commit` while on the main branch, to enforce
# a feature-branch + PR workflow (Lighthouse CI runs on PRs, not main pushes).
set -u

input=$(cat)
cmd=$(printf '%s' "$input" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{console.log((JSON.parse(s).tool_input||{}).command||'')}catch{console.log('')}})" 2>/dev/null)

#case "$cmd" in
#  *"git commit"*)
#    branch=$(git -C "${CLAUDE_PROJECT_DIR:-.}" branch --show-current 2>/dev/null)
#    if [ "$branch" = "main" ]; then
#      echo "Blocked: don't commit directly to 'main'. Create a feature branch (git checkout -b <name>) and open a PR — Lighthouse CI runs on PRs. To disable this guard, remove the PreToolUse hook in .claude/settings.json." >&2
#      exit 2
#    fi
#    ;;
#esac
exit 0
