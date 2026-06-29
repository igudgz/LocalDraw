# AB-18 — Dev Server Evidence

**Date:** 2026-06-28

## Comando

```bash
npm run dev -- --port 5176 --strictPort
```

## Verificacao

```powershell
Invoke-WebRequest -Uri 'http://localhost:5176/' -UseBasicParsing
# StatusCode: 200
```

## Notas

* Servidor iniciado em background durante completude do batch
* Porta 5176 conforme solicitado no prompt original
* App carrega titulo `LocalDraw` e toolbar com ferramentas
