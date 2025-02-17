## Groupe

- Mahamadou GORY KANTÉ
- Salahe-eddine BOUHDJEUR

## Environnement variables

- `web/.env.example`

## Installation

```bash
docker-compose up -d
```

### Seed Neo4j

```bash
docker exec -it neo4j cypher-shell -u neo4j -p password -f ./import/seed-neo4j.cypher
```

### Database Schema

## MongoDB

```mermaid
graph LR
    subgraph MongoDB Schema
        A[Affaires] --> |embed| T(Temoignages)
        A --> |embed| L(Lieux)
        A --> |reference| I(Individus)
    end
```

## Neo4j

```mermaid
graph LR
    subgraph Neo4j Schema
        N_I((Individu)) -->|A_APPELE| N_A((Appel))
        N_A -->|RECU_APPEL| N_I
        N_I -->|UTILISE_ANTENNE | N_ANT((Antenne))
    end
```
