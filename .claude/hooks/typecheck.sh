#!/usr/bin/env bash
# PostToolUse hook: after a TypeScript file is edited, run the typechecker and
# surface any errors back to Claude (exit 2 feeds stderr in as feedback).
set -u

input=$(cat)
file=$(printf '%s' "$input" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{console.log((JSON.parse(s).tool_input||{}).file_path||'')}catch{console.log('')}})" 2>/dev/null)

case "$file" in
  *.ts | *.tsx)
    cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
    if ! out=$(npm run typecheck 2>&1); then
      {
        echo "Type errors after editing $file:"
        printf '%s\n' "$out" | tail -30
      } >&2
      exit 2
    fi
    ;;
esac
exit 0
