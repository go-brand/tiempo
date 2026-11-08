# AI resources

Coding agents often know `Date` and date-fns better than Temporal. These resources give them tiempo's current API and conventions, so they write timezone-correct code the first time.

## Paste this into your agent

```text
Use @gobrand/tiempo for dates and times. Read https://tiempo.gobrand.app/llms.txt before writing code.
```

The [home page](https://tiempo.gobrand.app) has a longer prompt with a copy button.

## llms.txt

[tiempo.gobrand.app/llms.txt](https://tiempo.gobrand.app/llms.txt) lists every function with a one-line description and a link to its page, following the [llms.txt convention](https://llmstxt.org/). Every docs page is also available as Markdown under [`/.well-known/markdown/`](https://tiempo.gobrand.app/.well-known/markdown/index.md), so agents don't have to parse HTML.

## Agent Skill

For agents that support [Agent Skills](https://skills.sh/) (Claude Code, Cursor, GitHub Copilot and others):

```bash
npx skills add go-brand/tiempo
```

The skill teaches the agent tiempo's rules (store UTC, pass timezones explicitly, keep dates as `PlainDate`) and includes the full function reference. Agents can also discover it at [`/.well-known/agent-skills/index.json`](https://tiempo.gobrand.app/.well-known/agent-skills/index.json).
