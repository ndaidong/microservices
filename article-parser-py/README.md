# Article Parser service in Python

## Requirements

- Python >= 3.6

## Setup

```bash
git clone https://github.com/ndaidong/microservices.git
cd microservices/article-parser-py
docker-compose up

# or run directly with Python
poetry install
poetry run python3 server.py
```

Running scripts directly requires [poetry](https://python-poetry.org/).

## Test

Before running test, please close other instances of `server.py` to avoid port confliction.
```bash
# install dependencies if not yet
# poetry install

./run_test.sh
```
