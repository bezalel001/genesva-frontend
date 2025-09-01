#!/bin/bash
# Simple script to run import without uv file locking issues

export PYTHONPATH=/app:$PYTHONPATH
/usr/local/bin/python -c "
import sys
sys.path.insert(0, '/app')
exec(open('/app/app/scripts/import_genes.py').read())
" data/genes_human.csv